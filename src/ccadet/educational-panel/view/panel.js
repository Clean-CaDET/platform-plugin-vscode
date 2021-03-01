(function () {
    const fullName = document.getElementById('full-name');
    
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data;
        console.log(message.analysisResults);
        fullName.textContent = message.analysisResults.metrics.fullName;
    });
}());