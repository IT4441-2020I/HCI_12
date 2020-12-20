function toggleSidebar() {
	let sidebar = document.getElementById("learn_sidebar");
	let isExpand = sidebar.classList.contains("learn-sidebar-expanded");
	setSidebarExpand(!isExpand);
}
function setSidebarExpand(isExpand){
	let sidebar = document.getElementById("learn_sidebar");
	if (isExpand){
		sidebar.classList.remove("learn-sidebar-collapsed");
		sidebar.classList.add("learn-sidebar-expanded");
	}else{
		sidebar.classList.remove("learn-sidebar-expanded");
		sidebar.classList.add("learn-sidebar-collapsed");
	}
}

function changeTab(el,index){
	let listItem = el.querySelectorAll(":scope > div:nth-child(1)>*");
	for (let i=0; i<listItem.length; i++){
		if (i == index){
			listItem[i].classList.add("active-tab");
		}else{
			listItem[i].classList.remove("active-tab");
		}
	}

	let listContent = el.querySelectorAll(":scope > div:nth-child(2)>*");
	if (index < 0 || index >= listContent.length) return;
	for (let i=0; i<listContent.length; i++){
		listContent[i].hidden = (i!=index);
	}
}

function toggleHandAssist(typeAssistEl){
	let handAssist = typeAssistEl.querySelector(":scope >div:nth-child(2)");
	let isAssistModeOn = !handAssist.hidden;

	isAssistModeOn = !isAssistModeOn; // toggle

	handAssist.hidden = !isAssistModeOn;
	let toggleBtn = typeAssistEl.querySelector(":scope >div:nth-child(3) > button");
	toggleBtn.innerHTML = isAssistModeOn?"Tắt hỗ trợ":"Bật hỗ trợ";
}

function setupEventListener(){
	let tabEls = document.querySelectorAll(".surface-use-tabs");
	for (let i=0; i<tabEls.length; i++){
		let el = tabEls[i];
		let listItem = el.querySelectorAll(":scope > div:nth-child(1)>*");
		let listContent = el.querySelectorAll(":scope > div:nth-child(2)>*");

		for (let j=0; j<listItem.length; j++){
			listItem[j].onclick = (event)=>{
				changeTab(el,j);
			};
		}

		changeTab(el,0);
	}

	let typingAssistEls = document.querySelectorAll(".typing-assist");
	for (let i=0; i<typingAssistEls.length; i++){
		let el = typingAssistEls[i];
		let toggleButton = el.querySelector(":scope >div:nth-child(3) > button");
		if (toggleButton){
			toggleButton.onclick = (event)=>{
				toggleHandAssist(el);
			};
		}
	}

	let learnTypeSpeelEls = document.querySelectorAll(".learn-practice-spell, .learn-practice-word, .learn-practice-sentence, .learn-practice-paragraph");
	for (let i=0; i<learnTypeSpeelEls.length; i++){
		let el = learnTypeSpeelEls[i];
		let configEl = el.querySelector(":scope .learn-practice-spell-config");
		let toggleConfigButton = el.querySelector(":scope .learn-practice-title > div:last-child > button:first-child");
		if (toggleConfigButton){
			toggleConfigButton.onclick = (event)=>{
				configEl.hidden = !configEl.hidden;
			};
		}
	}

	let listSelection = document.querySelectorAll(".list-spell-group > *");
	for (let j=0;j<listSelection.length;j++){
		listSelection[j].onclick = (event)=>{
			if (listSelection[j].classList.contains("spell-item-selected")){
				listSelection[j].classList.remove("spell-item-selected");
			}else{
				listSelection[j].classList.add("spell-item-selected");
			}
		}
	}
}



/*
// dynamic load page
*/

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

function readJSONFile(file, callback, errorCallback=null) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4) {
			if (rawFile.status == "200"){
				callback(rawFile.responseText);
			}else{
				if (errorCallback) errorCallback(rawFile.status);
			}
		}
	}
	rawFile.send(null);
}

async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

async function loadLesson(text_json){
	let courseData = JSON.parse(text_json);
	let params = getSearchParameters();
	let section = params.section,
		lecture = params.lecture;
	if (!(section && lecture)){
		section = lecture = 1;
	}
	

	// load sidebar
	let listSectionEl = document.querySelector("#list_lectures");
	listSectionEl.innerHTML = "";
	for (let i=1; i<=courseData.sections.length; i++){
		let sectionData = courseData.sections[i-1];
		let sectionEl = document.createElement("li");
		sectionEl.innerHTML = sectionData.name+"<ol></ol>";
		listSectionEl.appendChild(sectionEl);

		let listLectureEl = sectionEl.querySelector(":scope > ol");
		for (let j=1; j<=sectionData.lectures.length; j++){
			let lectureData = sectionData.lectures[j-1];
			let lectureEl = document.createElement("li");
			if (i==section&&j==lecture){
				lectureEl.classList.add("active-link-sidebar");
			}
			lectureEl.innerHTML = "<a href='?section="+i+"&lecture="+j+"'>"+lectureData.name+"</a>";
			listLectureEl.appendChild(lectureEl);
		}
	}

	// load main
	
	let sectionInfo = courseData.sections[section-1];
	let lectureInfo = sectionInfo.lectures[lecture-1];

	document.querySelector("#learn_main_title > p").innerHTML = section+". "+sectionInfo.name;
	document.querySelector("#learn_main_title > h1").innerHTML = section+"."+lecture+". "+lectureInfo.name;
	let listPanelsContainer = document.querySelector("#list_panels");

	for (let i=0; i<lectureInfo.content.length; i++){
		let contentInfo = lectureInfo.content[i];

		let section = document.createElement("div");
		section.classList.add("learn-section");

		section.innerHTML = "<h2>"+contentInfo.title+"</h2>" + (await fetchHtmlAsText("learn-panel-html/"+contentInfo.panel));

		listPanelsContainer.appendChild(section);

		if (lectureInfo.config){
			if (lectureInfo.config.type == "learn-typing-spell"){

			}else if (lectureInfo.config.type == "practice-spell"){

			}
		}
	}

	// setup bottom button
	let prevLink = document.querySelector("#bottom_buttons >div:nth-child(1) > a");
	let nextLink = document.querySelector("#bottom_buttons >div:nth-child(3) > a");

	let prevLecture=null, nextLecture=null;
	
	if (lecture==1){
		if (section > 1){
			let prevSection = courseData.sections[section-1-1];
			prevLecture = prevSection.lectures[prevSection.lectures.length-1];
			prevLink.setAttribute("href", "?section="+(parseInt(section)-1)+"&lecture="+(prevSection.lectures.length-1));
		}
	}else{
		prevLecture = courseData.sections[section-1].lectures[lecture-1-1];
		prevLink.setAttribute("href", "?section="+section+"&lecture="+(parseInt(lecture)-1));
	}
	if (lecture==courseData.sections[section-1].lectures.length){
		if (section < courseData.sections.length){
			let nextSection = courseData.sections[section-1+1];
			nextLecture = nextSection.lectures[0];
			nextLink.setAttribute("href", "?section="+(parseInt(section)+1)+"&lecture="+(nextSection.lectures.length-1));
		}
	}else{
		nextLecture = courseData.sections[section-1].lectures[lecture-1+1];
		nextLink.setAttribute("href", "?section="+section+"&lecture="+(parseInt(lecture)+1));
	}

	if (prevLecture){
		let prevLectureInfoEl = document.querySelector("#bottom_buttons >div:nth-child(1) > p");
		let str = "Bài trước: <b>"+prevLecture.name+"</b>";
		if (prevLecture.description && prevLecture.description != "")
			str += "<br>Nội dung bài học: "+prevLecture.description;
		prevLectureInfoEl.innerHTML = str;
	}
	if (nextLecture){
		let nextLectureInfoEl = document.querySelector("#bottom_buttons >div:nth-child(3) > p");
		let str = "Bài tiếp theo: <b>"+nextLecture.name+"</b>";
		if (nextLecture.description && nextLecture.description != "")
			str += "<br>Nội dung bài học: "+nextLecture.description;
		nextLectureInfoEl.innerHTML = str;
	}

	let currLecture = courseData.sections[section-1].lectures[lecture-1];
	let currLectureInfoEl = document.querySelector("#bottom_buttons >div:nth-child(2) > p");
	let str = "Bài hiện tại: <b>"+currLecture.name+"</b>";
	if (currLecture.description && currLecture.description != "")
		str += "<br>Nội dung bài học: "+currLecture.description;
	currLectureInfoEl.innerHTML = str;



	//

	loadKeyboards();
	setupEventListener();
}

async function loadKeyboards(){
	let listEl = document.querySelectorAll("*[data-keyboard]");
	for (let i=0; i<listEl.length; i++){
		let el = listEl[i];
		let url = el.getAttribute("data-keyboard");
		el.innerHTML = await fetchHtmlAsText(url);
	}
}

window.addEventListener("load", (event)=>{
	readJSONFile("resources/js/course-info.json",loadLesson);
});