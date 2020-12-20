function toggleHidden(elementQuery){
	let queryResult = document.querySelectorAll(elementQuery);
	for (let i=0; i<queryResult.length; i++){
		let el = queryResult[i];
		el.hidden = !el.hidden;
	}
}

function toggleClass(elementQuery,className){
	let queryResult = document.querySelectorAll(elementQuery);
	for (let i=0; i<queryResult.length; i++){
		let el = queryResult[i];
		if (el.classList.contains(className)){
			el.classList.remove(className);
		}else{
			el.classList.add(className);
		}
	}
}

function switchText(elementQuery,listText){
	let queryResult = document.querySelectorAll(elementQuery);
	for (let i=0; i<queryResult.length; i++){
		let el = queryResult[i];
		for (let j=0; j<listText.length; j++){
			if (listText[j] == el.innerText){
				el.innerText = listText[(j+1)%listText.length];
				break;
			}
		}
	}
}