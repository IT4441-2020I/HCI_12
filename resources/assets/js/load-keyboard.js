/**
  * @param {String} url - address for the HTML to fetch
  * @return {String} the resulting HTML string fragment
  */
async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

async function loadKeyboards(){
	let listEl = document.querySelectorAll("*[data-keyboard]");
	for (let i=0; i<listEl.length; i++){
		let el = listEl[i];
		let url = el.getAttribute("data-keyboard");
		el.innerHTML = await fetchHtmlAsText(url);
	}
}

window.addEventListener('load', (event) => {
	loadKeyboards();

});
