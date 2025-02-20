chrome.runtime.onMessage.addListener((message) => {
	if (message.action === 'highlightText') {
		window.location.assign(message.link);
	}
});
