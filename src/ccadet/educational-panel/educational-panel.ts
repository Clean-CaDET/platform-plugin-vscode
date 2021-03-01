import * as vscode from 'vscode';
import * as fs from 'fs';
import { ClassQualityAnalysisDTO } from '../platform/dtos/class-quality-analysis-dto';

export class EducationalPanel {
    public static instance: EducationalPanel | undefined;
    private _panel!: vscode.WebviewPanel;
    private _basePath: vscode.Uri;

    private _disposables: vscode.Disposable[] = [];
    
    public static createOrShow(extensionUri: vscode.Uri) {
		if (EducationalPanel.instance) {
			EducationalPanel.instance._panel.reveal(vscode.ViewColumn.One);
			return;
		}
		EducationalPanel.instance = new EducationalPanel(extensionUri);
	}


    private constructor(uri: vscode.Uri) {
		this._basePath = vscode.Uri.joinPath(uri, 'src', 'ccadet', 'educational-panel', 'view');

		this._panel = vscode.window.createWebviewPanel(
			'ccadet-edu-panel',
            'Clean CaDET Analysis Results',
			vscode.ViewColumn.One,
			{
                enableScripts: true,
                localResourceRoots: [this._basePath]
            }
		);

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this.loadHTML().then(html => this._panel.webview.html = html);
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
        return fs.promises.readFile(vscode.Uri.joinPath(this._basePath, 'panel.html').fsPath)
            .then(html => {
                const webview = this._panel.webview;
        
		        const scriptPathOnDisk = vscode.Uri.joinPath(this._basePath, 'panel.js');
                const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

                return html.toString().replace("{{scriptPath}}", scriptUri.toString());
            });
    }

    public showQualityAnalysisResults(qualityAnalysisResults: ClassQualityAnalysisDTO) {
        this._panel.webview.postMessage({analysisResults: qualityAnalysisResults});
    }
}