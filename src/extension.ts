import * as vscode from 'vscode';
import { PlatformConnection } from './ccadet/platform/platform-connection';
import { EducationalPanel } from './ccadet/educational-panel/educational-panel';
import { enterChallengeId, enterStudentId } from './ccadet/challenge-input/challenge-input';

export function activate(context: vscode.ExtensionContext) {
	console.log('Clean CaDET is now active.');

	const platformConnection = new PlatformConnection();
	
	let ccadetStart = vscode.commands.registerCommand('clean-cadet.start', () => {
		EducationalPanel.createOrShow(context.extensionUri);
	});

	let ccadetAnalysis = vscode.commands.registerCommand('clean-cadet.analysis', (selectedElement) => {
		platformConnection.getQualityAnalysis(selectedElement.path)
			.then(response => EducationalPanel.instance?.showQualityAnalysisResults(response))
			.catch(console.error);
	});
	//TODO: Student id
	let ccadetChallenge = vscode.commands.registerCommand('clean-cadet.challenge', (selectedElement) => {
		enterChallengeId()
		    .then(challenge => {
				platformConnection.getChallengeAnalysis(selectedElement.path, challenge)
					.then(response => EducationalPanel.instance?.showQualityAnalysisResults(response))
					.catch(console.error);
			});
	});

	context.subscriptions.push(ccadetStart);
	context.subscriptions.push(ccadetAnalysis);
	context.subscriptions.push(ccadetChallenge);
}

export function deactivate() {}
