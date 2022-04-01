import * as vscode from 'vscode';
import { PlatformConnection } from './ccadet/platform-connection/platform-connection';
import { EducationalPanel } from './ccadet/educational-panel/educational-panel';
import { enterChallengeId, enterStudentId } from './ccadet/challenge-input/challenge-input';

export function activate(context: vscode.ExtensionContext) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; //TODO: DANGEROUS AND SHOULD BE REMOVED AFTER TEST RUN
	console.log('Clean CaDET je aktivan.');

	let platformConnection: PlatformConnection | null;
	let learnerIndex: string | undefined;

	let ccadetStart = vscode.commands.registerCommand('clean-cadet.start', () => {
		enterStudentId(learnerIndex || "")
			.then(index => {
				if(!index) {
					vscode.window.showErrorMessage("Neophodno je da uneseš indeks. Aktiviraj Ctrl+Shift+P > CCaDET Start");
					return;
				}
				learnerIndex = index;

				platformConnection = setupConnection();
				if(platformConnection != null) {
					platformConnection.loginUser(index)
					  .then(() =>
						  vscode.window.showInformationMessage("Uspešno si se prijavio sa indeksom: " + learnerIndex)
					  )
					  .catch(handleLoginError);
				}
			})
			.catch(console.error);
	});

	let ccadetChallenge = vscode.commands.registerCommand('clean-cadet.challenge', (selectedElement) => {
		if(!platformConnection) {
			vscode.window.showErrorMessage("Definiši platform.tutorUrl u Settings pa aktiviraj Ctrl+Shift+P > CCaDET Start.");
			return;
		}
		enterChallengeId()
		    .then(challenge => platformConnection?.getChallengeAnalysis(selectedElement.path, challenge)
				.then(response => {
					EducationalPanel.createOrShow(context.extensionUri, platformConnection);
					EducationalPanel.instance?.showChallengeAnalysisResults(response);
				})
				.catch(handleSubmissionError))
			.catch(vscode.window.showErrorMessage);
	});

	context.subscriptions.push(ccadetStart);
	context.subscriptions.push(ccadetChallenge);
}

function setupConnection() {
	let configuration = vscode.workspace.getConfiguration();
	let tutorUrl = configuration.get<string>("platform.tutorUrl", "");
	if (tutorUrl) {
		return new PlatformConnection(tutorUrl);
	}
	vscode.window.showErrorMessage("Definiši platform.tutorUrl u Settings pa aktiviraj Ctrl+Shift+P > CCaDET Start.");
	return null;
}

export function deactivate() {}

function handleSubmissionError(error: any): void | PromiseLike<void> {
	switch(error.response.status) {
		case 400:
			vscode.window.showErrorMessage("Loša submisija. Da li si odabraio prikladan file/folder za submisiju? Da li si ispravan ID izazova naveo (pogledaj web prikaz Tutora)?");
			break;
		case 404:
			vscode.window.showErrorMessage("Izazov nije pronađen. Da li si ispravan ID izazova naveo (pogledaj web prikaz Tutora)?");
			break;
		default:
			console.error(error);
	}
}

function handleLoginError(error: any) {
	switch(error.response.status) {
		case 404:
			vscode.window.showErrorMessage("Indeks nije validan. Proveri da si registrovan na platformu i da je indeks ispravan.");
			break;
		default:
			console.error(error);
	}
}

