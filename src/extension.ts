import * as vscode from 'vscode';
import { PlatformConnection } from './ccadet/platform/platform-connection';
import { EducationalPanel } from './ccadet/educational-panel/educational-panel';

export function activate(context: vscode.ExtensionContext) {
	console.log('Clean CaDET is now active.');

	const platformConnection = new PlatformConnection();
	
	let ccadetStart = vscode.commands.registerCommand('clean-cadet.start', () => {
		EducationalPanel.createOrShow(context.extensionUri);
	});

	let ccadetAnalysis = vscode.commands.registerCommand('clean-cadet.analysis', (selectedElement) => {
		platformConnection.getClassQualityAnalysis(selectedElement.path)
			.then(response => EducationalPanel.instance?.showQualityAnalysisResults(response))
			.catch(console.error);
	});

	context.subscriptions.push(ccadetStart);
	context.subscriptions.push(ccadetAnalysis);
}

export function deactivate() {}
