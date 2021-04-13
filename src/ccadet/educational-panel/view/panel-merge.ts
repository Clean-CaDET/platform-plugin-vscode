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
    <h3 id="results"></h3>
    <p>Challenge id: <span id="challenge-id"></span></p>
    <p>
        <span id="hint-num"></span>
        <button id="show-hints" onclick="showHints()">Show Hints</button>
    </p>

    <div id="hint-panel" style="display:none">
        <hr></hr>
        <div id="hints"></div>
    </div>

    <p>
        <hr></hr>
        <button id="show-solution" onclick="showSolution()">Show Solution</button>
    </p>
    <div id="solution-panel" style="display:none">
        <hr></hr>
        <p>Note that your solution can differ from ours in some aspects.</p>
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
                "Congratulations! You have completed the challenge." :
                "Your submission is not yet there. Keep going to complete the challenge!"
            
            hintNum.textContent = createHintNumText(analysisResults.applicableHints.length, analysisResults.challengeCompleted);
    
            hints.innerHTML = createHintContent(analysisResults.applicableHints);
            solution.innerHTML = "<b>Solution</b>: " + createLearningObjectContent(analysisResults.solution);
    
            function createHintContent(applicableHints) {
                var hintPrint = "<div style='border-bottom: 1px solid gray'>";
                for(var i = 0; i < applicableHints.length; i++) {
                    var hint = applicableHints[i];
                    hintPrint += "<p>" + hint.content + "</p>";
                    if(hint.learningObject) {
                        hintPrint += createLearningObjectContent(hint.learningObject);
                    }
                    hintPrint += "<p style='white-space: pre;'><b>Applicable to</b>:\\r\\n" + hint.applicableToCodeSnippets.join("\\r\\n");
                    hintPrint += "</div><br><br>";
                }
    
                return hintPrint;
            }
    
            function createHintNumText(hintNumber, success) {
                if(success) return "You can view all the available hints for this completed challenge.";
                if(hintNumber == 1) return "You have 1 hint available.";
                return "You have " + hintNumber + " hints available.";
            }
    
            function createLearningObjectContent(learningObject) {
                if(learningObject.typeDiscriminator === 'text') {
                    return "<p>" + learningObject.content + "</p>";
                }
                if(learningObject.typeDiscriminator === 'image') {
                    var image = '<img src="' + learningObject.url + '">';
                    image += '<small>(<a href="' + learningObject.url + '">open image in browser)</a>) ' + learningObject.caption + '</small>';
                    return image;
                }
                if(learningObject.typeDiscriminator === 'video') {
                    return '<a href="' + learningObject.url + '">Check out this video for guidance.</a>'
                }
                return "";
            }
        });
    </script>
    <script>
        function showHints() {
            document.getElementById('hint-panel').style.display = 'block';
            document.getElementById('show-hints').style.display = 'none';
        }
        function showSolution() {
            document.getElementById('solution-panel').style.display = 'block';
            document.getElementById('show-solution').style.display = 'none';
        }
    </script>
</body>
</html>
    `;
};