chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			console.log("chrome-extensions/userscripts/src/inject.js");
			// ----------------------------------------------------------

			switch (location.hostname) {
				case 'www.amazon.com':
					runAmazonScripts();
					break;

				case 'github.com':
					runGithubScripts();
					break;
			
				default:
					break;
			}
		}
	}, 10);
});

const runAmazonScripts = () => {
	const href = location.href;
	const redirectHref = href.replace(/:\/\/www.amazon.com/, '://smile.amazon.com/');
	location.replace(redirectHref);
}

const runGithubScripts = () => {
	document.addEventListener('transitionend', (event) => {
		if (event.target.className === "pjax-loader-bar" && event.propertyName === "opacity") {
			updateGithubPage();
		}
	});

	updateGithubPage();
}

const updateGithubPage = () => {
	if (location.pathname.match(/^\/vitalsource\/fraction\/pull\/.+/)) {
		const headerMeta = document.querySelector(".gh-header-meta");
		const branchElement = headerMeta.querySelector('.head-ref');
		const match = branchElement.innerText.match(/[Bb][Oo]-\d+/);
		if (match) {
			const issueId = match[0].toUpperCase();

			// create wrapper container
			const linkWrapper = document.createElement("a");
			linkWrapper.setAttribute("href", `https://tickets.ingramcontent.com/browse/${issueId}`);
			linkWrapper.setAttribute("target", "_blank");
			linkWrapper.style.marginLeft = "5px";
			linkWrapper.style.textDecoration = "underline";

			const linkContent = document.createTextNode(`${issueId}`);

			linkWrapper.appendChild(linkContent);

			// branchElement.querySelector("span").style.textDecoration = "underline";

			// insert wrapper before el in the DOM tree
			branchElement.parentNode.insertBefore(linkWrapper, branchElement.nextSibling);
		}
	}
}
