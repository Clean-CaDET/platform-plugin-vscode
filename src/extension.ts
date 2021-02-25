import * as vscode from 'vscode';
import { PlatformConnection } from './ccadet/platform/platform-connection';
import { EducationalPanel } from './ccadet/educational-panel/educational-panel';

export function activate(context: vscode.ExtensionContext) {
	console.log('Clean CaDET is now active.');

	const platformConnection = new PlatformConnection();
	const educationalPanel = new EducationalPanel(context);

	// The command has been defined in the package.json file and parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('clean-cadet.analysis', (selectedElement) => {
		platformConnection.getClassQualityAnalysis(selectedElement.path)
			.then(response => educationalPanel.showQualityAnalysisResults(response))
			.catch(console.error);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
