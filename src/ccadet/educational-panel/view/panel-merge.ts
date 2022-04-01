// TODO: Automatically create from panel.html and panel.js as part of vscode:prepublish.
// Currently we have to manually copy the html and inline the js script. 
export function getPanelHtml() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src self; img-src https://i.ibb.co/ vscode-resource:; script-src vscode-resource: 'self' 'unsafe-inline'; style-src vscode-resource: 'self' 'unsafe-inline';"/>
    <title>Challenge Analysis Results</title>
</head>
<body>
    <br><br>
    <h1 id="results"></h1>
    <p>ID izazova: <span id="challenge-id"></span></p>
    <p>
        <span id="hint-num"></span>
        <button id="show-hints" onclick="showHints()">Prikaži hintove</button>
    </p>

    <div id="hint-panel" style="display:none">
        <hr></hr>
        <div id="hints"></div>
    </div>

    <p>
        <button id="show-solution" onclick="showSolution()">Prikaži rešenje</button>
    </p>
    <div id="solution-panel" style="display:none">
        <p>Računaj da se tvoje rešenje može razlikovati od našeg u određenim aspektima i dalje biti validno.</p>
        <div id="solution"></div>
    </div>
    <br><br>

    <script>
        const challengeId = document.getElementById('challenge-id');
        const results = document.getElementById('results');
        const hintPanel = document.getElementById('hint-panel');
        const hintButton = document.getElementById('show-hints');
        const hintNum = document.getElementById('hint-num');
        const hints = document.getElementById('hints');
    
        const solutionPanel = document.getElementById('solution-panel');
        const solutionButton = document.getElementById('show-solution');
        const solution = document.getElementById('solution');
        
        // Handle messages sent from the extension to the webview
        window.addEventListener('message', event => {
            hintPanel.style.display = 'none';
            hintButton.style.display = 'block';
            solutionPanel.style.display = 'none';
            solutionButton.style.display = 'block';
            const analysisResults = event.data.analysisResults;
            
            
            challengeId.textContent = analysisResults.challengeId;
    
            results.textContent = analysisResults.challengeCompleted ?
            "Čestitam! Uspešno si završio si izazov." :
            "Tvoja submisija još nije skroz ispravna. Nastavi da radiš kako bi uspešno završio izazov!";
            if(analysisResults.challengeCompleted) {
                results.style.color = 'green';
                hintButton.style.display = 'none';
            }
            else {
                results.style.color = 'unset';
                hintButton.style.display = 'block';
            }
            
            hintNum.textContent = createHintNumText(analysisResults.applicableHints.length, analysisResults.challengeCompleted);

            hints.innerHTML = createHintContent(analysisResults.applicableHints);
            solution.innerHTML = '<b>Rešenje</b>: <a href="' + analysisResults.solutionUrl + '">Analiziraj ove materijale.</a>';

            function createHintContent(applicableHints) {
                var hintPrint = "<div style='border-bottom: 1px solid gray'>";
                for(var i = 0; i < applicableHints.length; i++) {
                    var hint = applicableHints[i];
                    hintPrint += "<p>" + hint.content + "</p>";
                    hintPrint += "<p><b>Applicable to</b>:</p>";
                    for(var j = 0; j < hint.applicableToCodeSnippets.length; j++) {
                        hintPrint += "<p>" + hint.applicableToCodeSnippets[j] + "</p>";
                    }
                    hintPrint += "</div><br><br>";
                }

                return hintPrint;
            }

            function createHintNumText(hintNumber, success) {
                if(success) return "Savladao si izazov. Možeš ispitati naše rešenje da razmotriš gde se razlikujemo. Ne zaboravi da osvežiš tačnost izazova na web prikazu Tutora.";
                if(hintNumber == 1) return "Imaš 1 hint na raspolaganju.";
                return "Imaš " + hintNumber + " hintova na raspolaganju.";
            }
        });
    </script>
    <script>
        const vscode = acquireVsCodeApi();
        function showHints() {
            document.getElementById('hint-panel').style.display = 'block';
            document.getElementById('show-hints').style.display = 'none';
            vscode.postMessage({
                command: 'show-hints'
            });
        }
        function showSolution() {
            document.getElementById('solution-panel').style.display = 'block';
            document.getElementById('show-solution').style.display = 'none';
            vscode.postMessage({
                command: 'show-solution'
            });
        }
    </script>
</body>
</html>
    `;
};