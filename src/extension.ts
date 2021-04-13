import * as vscode from 'vscode';
import { PlatformConnection } from './ccadet/platform-connection/platform-connection';
import { EducationalPanel } from './ccadet/educational-panel/educational-panel';
import { enterChallengeId, enterStudentId } from './ccadet/challenge-input/challenge-input';

export function activate(context: vscode.ExtensionContext) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; //TODO: DANGEROUS AND SHOULD BE REMOVED AFTER TEST RUN
	console.log('Clean CaDET is now active.');

	let platformConnection: PlatformConnection | null;
	let studentId: string | undefined;

	let ccadetStart = vscode.commands.registerCommand('clean-cadet.start', () => {
		enterStudentId(studentId || "")
			.then(id => {
				if(!id) {
					vscode.window.showErrorMessage("Student index is required. Enter it through Ctrl+Shift+P > CCaDET Start");
					return;
				}
				studentId = id;
				platformConnection = setupConnection();
			})
			.catch(console.error);
	});

	let ccadetChallenge = vscode.commands.registerCommand('clean-cadet.challenge', (selectedElement) => {
		if(!studentId) {
			vscode.window.showErrorMessage("Student index is required. Enter it through Ctrl+Shift+P > CCaDET Start");
			return;
		}
		if(!platformConnection) {
			vscode.window.showErrorMessage("Define platform.tutorUrl in settings and run Ctrl+Shift+P > CCaDET Start.");
			return;
		}
		enterChallengeId()
		    .then(challenge => platformConnection?.getChallengeAnalysis(selectedElement.path, challenge, studentId || "")
				.then(response => {
					EducationalPanel.createOrShow(context.extensionUri);
					EducationalPanel.instance?.showChallengeAnalysisResults(response);
				})
				.catch(handleBackendError))
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
	} else {
		vscode.window.showErrorMessage("Define platform.tutorUrl in settings and run Ctrl+Shift+P > CCaDET Start.");
	}
	return null;
}

export function deactivate() {}

function handleBackendError(error: any): void | PromiseLike<void> {
	switch(error.response.status) {
		case 400:
			vscode.window.showErrorMessage("Bad submission. Did you select the appropriate file/folder to submit?");
			break;
		case 404:
			vscode.window.showErrorMessage("Challenge not found. Did you submit the correct ID (from the Tutor page)?");
			break;
		default:
			console.error(error);
	}
}

