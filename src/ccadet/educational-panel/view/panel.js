(function () {
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
            "Your submission is not yet there. Keep going to complete the challenge!";
        if(analysisResults.challengeCompleted) results.style.color = 'green';
        else results.style.color = 'unset';
        
        hintNum.textContent = createHintNumText(analysisResults.applicableHints.length, analysisResults.challengeCompleted);

        hints.innerHTML = createHintContent(analysisResults.applicableHints);
        solution.innerHTML = '<b>Solution</b>: <a href="' + analysisResults.solutionUrl + '">Watch the video!</a>';

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
            if(success) return "You can view all the available hints for this completed challenge.";
            if(hintNumber == 1) return "You have 1 hint available.";
            return "You have " + hintNumber + " hints available.";
        }
    });
}());