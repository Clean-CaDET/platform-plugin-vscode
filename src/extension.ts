import * as vscode from 'vscode';
import { PlatformConnection } from './ccadet/platform-connection/platform-connection';
import { EducationalPanel } from './ccadet/educational-panel/educational-panel';
import { enterChallengeId, enterStudentId } from './ccadet/challenge-input/challenge-input';

export function activate(context: vscode.ExtensionContext) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; //TODO: DANGEROUS AND SHOULD BE REMOVED AFTER TEST RUN
	console.log('Clean CaDET is now active.');

	let platformConnection: PlatformConnection;
	let studentId: string | undefined;

	let ccadetStart = vscode.commands.registerCommand('clean-cadet.start', () => {
		enterStudentId(studentId || "")
			.then(id => studentId = id)
			.catch(console.error);
		
		let configuration = vscode.workspace.getConfiguration();
		let tutorUrl = configuration.get<string>("platform.tutorUrl", "");
		if(tutorUrl) {
			platformConnection = new PlatformConnection(tutorUrl);
		} else {
			vscode.window.showErrorMessage("No URL specified in settings (platform.tutorUrl field). Define it and rerun this command.");
		}
	});

	let ccadetChallenge = vscode.commands.registerCommand('clean-cadet.challenge', (selectedElement) => {
		if(!studentId) {
			vscode.window.showErrorMessage("Student index is required. Enter it through Ctrl+Shift+P > CCaDET Start");
			return;
		}
		if(!platformConnection) {
			vscode.window.showErrorMessage("Platform connection not established. Define platform.tutorUrl in settings and run CCaDET Start.");
			return;
		}
		enterChallengeId()
		    .then(challenge => platformConnection.getChallengeAnalysis(selectedElement.path, challenge, studentId || "")
			.then(response => {
				EducationalPanel.createOrShow(context.extensionUri);
				EducationalPanel.instance?.showChallengeAnalysisResults(response);
			})
			.catch(console.error));
	});

	context.subscriptions.push(ccadetStart);
	context.subscriptions.push(ccadetChallenge);
}

export function deactivate() {}
