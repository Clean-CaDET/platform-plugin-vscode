(function () {
    const challengeId = document.getElementById('challenge-id');
    const results = document.getElementById('results');
    const hintPanel = document.getElementById('hint-panel');
    const hintButton = document.getElementById('show-hints');
    const hintNum = document.getElementById('hint-num');
    const hints = document.getElementById('hints');
    
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        hintPanel.style.display = 'none';
        hintButton.style.display = 'block';
        const analysisResults = event.data.analysisResults;
        
        
        challengeId.textContent = analysisResults.challengeId;

        results.textContent = analysisResults.challengeCompleted ?
            "Congratulations! You have completed the challenge." :
            "Your submission is not yet there. Keep going to complete the challenge!"
        
        hintNum.textContent = createHintNumText(analysisResults.applicableHints.length, analysisResults.challengeCompleted);

        hints.innerHTML = createHintContent(analysisResults.applicableHints);

        function createHintContent(applicableHints) {
            var hintPrint = "<div style='border-bottom: 1px solid gray'>";
            for(var i = 0; i < applicableHints.length; i++) {
                var hint = applicableHints[i];
                hintPrint += "<p>" + hint.content + "</p>";
                if(hint.learningObject) {
                    hintPrint += createLearningObjectContent(hint.learningObject);
                }
                hintPrint += "<p style='white-space: pre;'><b>Applicable to</b>:\r\n" + hint.applicableToCodeSnippets.join("\r\n");
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
                image += '<small>' + learningObject.caption + '</small>';
                return image;
            }
            
            return "";
        }
    });
}());