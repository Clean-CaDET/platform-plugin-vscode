import * as vscode from 'vscode';
import { PlatformConnection } from './ccadet/platform-connection';

export function activate(context: vscode.ExtensionContext) {
	console.log('Clean CaDET is now active.');

	const platformConnection = new PlatformConnection();

	// The command has been defined in the package.json file and parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('clean-cadet.analysis', (selectedElement) => {
		platformConnection.getClassQualityAnalysis(selectedElement.path)
			.then(console.log)
			.catch(console.error);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
