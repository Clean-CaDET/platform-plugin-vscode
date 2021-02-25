import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ClassQualityAnalysisDTO } from '../platform/dtos/class-quality-analysis-dto';

export class EducationalPanel {
    private panel!: vscode.WebviewPanel;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.initializeView();
    }

    private initializeView() {
        if(!this.panel) {
            this.panel = vscode.window.createWebviewPanel(
                'ccadet-edu-panel',
                'Clean CaDET Analysis Results',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            this.LoadHTML().then(html => {
                this.panel.webview.html = html;
            });
        } else {
            this.panel.reveal(vscode.ViewColumn.One)
        }
    }

    private LoadHTML() {
        const basePath = path.join(this.context.extensionPath, 'src', 'ccadet', 'educational-panel', 'view')
        
        //const JSDiskPath = vscode.Uri.file(path.join(basePath, 'panel.js'));

        return fs.promises.readFile(path.join(basePath, 'panel.html'))
            .then(html => { return html.toString()});


        //const htmlDiskPath = vscode.Uri.file(path.join(basePath, 'panel.html'));
        //this.panel?.webview.asWebviewUri(onDiskPath);
    }

    public showQualityAnalysisResults(qualityAnalysisResults: ClassQualityAnalysisDTO) {
        this.initializeView();
        this.panel.webview.postMessage({analysisResults: qualityAnalysisResults});
    }
}