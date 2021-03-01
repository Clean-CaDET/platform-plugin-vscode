(function () {
    const fullName = document.getElementById('full-name');
    
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const analysisResults = event.data.analysisResults;
        fullName.textContent = analysisResults.metrics.fullName;
    });
}());