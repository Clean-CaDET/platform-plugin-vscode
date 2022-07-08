import * as vscode from 'vscode';
import { PlatformConnection } from './ccadet/platform-connection/platform-connection';
import { EducationalPanel } from './ccadet/educational-panel/educational-panel';
import { enterChallengeId, enterStudentId } from './ccadet/challenge-input/challenge-input';

export function activate(context: vscode.ExtensionContext) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; //TODO: DANGEROUS AND SHOULD BE REMOVED AFTER TEST RUN
	console.log('Clean CaDET is active.');

	let platformConnection: PlatformConnection | null;
	let learnerIndex: string | undefined;

	let ccadetStart = vscode.commands.registerCommand('clean-cadet.start', () => {
		enterStudentId(learnerIndex || "")
			.then(index => {
				if(!index) {
					vscode.window.showErrorMessage("You need to enter your username. Activate the prompt through Ctrl+Shift+P > CCaDET Start");
					return;
				}
				learnerIndex = index;

				platformConnection = setupConnection();
				if(platformConnection != null) {
					platformConnection.loginUser(index)
					  .then(() =>
						  vscode.window.showInformationMessage("You have successfully logged in with the username: " + learnerIndex)
					  )
					  .catch(handleLoginError);
				}
			})
			.catch(console.error);
	});

	let ccadetChallenge = vscode.commands.registerCommand('clean-cadet.challenge', (selectedElement) => {
		if(!platformConnection) {
			vscode.window.showErrorMessage("Define the *platform.tutorUrl* in the Settings to point to your deployed Tutor instance and then activate Ctrl+Shift+P > CCaDET Start.");
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
	vscode.window.showErrorMessage("Define the *platform.tutorUrl* in the Settings to point to your deployed Tutor instance and then activate Ctrl+Shift+P > CCaDET Start.");
	return null;
}

export function deactivate() {}

function handleSubmissionError(error: any): void | PromiseLike<void> {
	switch(error.response.status) {
		case 400:
			vscode.window.showErrorMessage("Invalid submission. Did you select the appropriate file/folder? Did you enter the correct challenge ID (shown on the web view)?");
			break;
		case 404:
			vscode.window.showErrorMessage("Challenge not found. Did you enter the correct challenge ID (shown on the web view)?");
			break;
		default:
			console.error(error);
	}
}

function handleLoginError(error: any) {
	switch(error.response.status) {
		case 404:
			vscode.window.showErrorMessage("Username is invalid. Check if you are registered on the platform and that your username is correct.");
			break;
		default:
			console.error(error);
	}
}

