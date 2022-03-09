import * as vscode from 'vscode';
import * as fs from 'fs';
import { getPanelHtml } from './view/panel-merge';
import { ChallengeEvaluation } from '../platform-connection/view-model/challenge-evaluation';
import { PlatformConnection } from '../platform-connection/platform-connection';

const PRODUCTION = true;

export class EducationalPanel {
    public static instance: EducationalPanel | undefined;
    private _platformConnection: PlatformConnection | null;
    private _basePath: vscode.Uri;
    private _panel!: vscode.WebviewPanel;

    private _disposables: vscode.Disposable[] = [];

    private _lastAnalysis: ChallengeEvaluation | undefined;
    
    public static createOrShow(extensionUri: vscode.Uri, platformConnection: PlatformConnection | null) {
		if (EducationalPanel.instance) {
			EducationalPanel.instance._panel.reveal(vscode.ViewColumn.One);
			return;
		}
		EducationalPanel.instance = new EducationalPanel(extensionUri, platformConnection);
	}

    private constructor(uri: vscode.Uri, platformConnection: PlatformConnection | null) {
        this._platformConnection = platformConnection;
		this._basePath = vscode.Uri.joinPath(uri, 'src', 'ccadet', 'educational-panel', 'view');

		this._panel = vscode.window.createWebviewPanel(
			'ccadet-edu-panel',
            'Challenge Analysis Results',
			vscode.ViewColumn.One,
			{
                enableScripts: true,
                localResourceRoots: [this._basePath],
                retainContextWhenHidden: true
            }
		);

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this.loadHTML().then(html => this._panel.webview.html = html);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'show-hints':
                        this._platformConnection?.seekHelp(this._lastAnalysis?.challengeId || 0, "hints");
                        break;
                    case 'show-solution':
                        this._platformConnection?.seekHelp(this._lastAnalysis?.challengeId || 0, "solution");
                }
            },
            undefined,
            this._disposables
        );
    }

    private dispose() {
		EducationalPanel.instance = undefined;
		this._panel.dispose();

		while (this._disposables.length) {
			const d = this._disposables.pop();
			if (d) d.dispose();
		}
	}

    private loadHTML() {
        if(PRODUCTION) return Promise.resolve(getPanelHtml());
        
        return fs.promises.readFile(vscode.Uri.joinPath(this._basePath, 'panel.html').fsPath)
            .then(html => {
                const webview = this._panel.webview;
        
		        const scriptPathOnDisk = vscode.Uri.joinPath(this._basePath, 'panel.js');
                const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

                return html.toString().replace("{{scriptPath}}", scriptUri.toString());
            });
    }

    public showChallengeAnalysisResults(analysisResults: ChallengeEvaluation) {
        this._panel.webview.postMessage({analysisResults: analysisResults});
        this._lastAnalysis = analysisResults;
    }
}