import * as vscode from 'vscode';
import { PlatformConnection } from './ccadet/platform-connection/platform-connection';
import { EducationalPanel } from './ccadet/educational-panel/educational-panel';
import { enterChallengeId, enterStudentId } from './ccadet/challenge-input/challenge-input';

export function activate(context: vscode.ExtensionContext) {
	console.log('Clean CaDET is now active.');

	const platformConnection = new PlatformConnection();
	let studentId: string | undefined;

	let ccadetStart = vscode.commands.registerCommand('clean-cadet.start', () => {
		enterStudentId()
			.then(id => studentId = id)
			.catch(console.error);
	});

	let ccadetAnalysis = vscode.commands.registerCommand('clean-cadet.analysis', (selectedElement) => {
		platformConnection.getQualityAnalysis(selectedElement.path)
			.then(response => {
				EducationalPanel.createOrShow(context.extensionUri);
				EducationalPanel.instance?.showQualityAnalysisResults(response);
			})
			.catch(console.error);
	});

	let ccadetChallenge = vscode.commands.registerCommand('clean-cadet.challenge', (selectedElement) => {
		if(!studentId) {
			vscode.window.showErrorMessage("Student index is required. Enter it through Ctrl+Shift+P > CCaDET Start");
			return;
		}
		enterChallengeId()
		    .then(challenge => platformConnection.getChallengeAnalysis(selectedElement.path, challenge, studentId || "")
			.then(response => vscode.window.showInformationMessage("Challenge result: " + response.responseText))
			.catch(console.error));
	});

	context.subscriptions.push(ccadetStart);
	context.subscriptions.push(ccadetAnalysis);
	context.subscriptions.push(ccadetChallenge);
}

export function deactivate() {}
