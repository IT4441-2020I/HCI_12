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

// window.addEventListener("load", (event)=>{
// 	readJSONFile("resources/js/course-info.json",loadLearningPath);
// })

document.addEventListener("DOMContentLoaded", (event)=>{
	readJSONFile("resources/js/course-info.json",loadLearningPath);
});


function loadLearningPath(text_json){
	let courseData = JSON.parse(text_json);
	let learningPathEl = document.querySelector("#steno_learning_path");
	learningPathEl.innerHTML = "";
	for (let i=1; i<=courseData.sections.length; i++){
		let sectionData = courseData.sections[i-1];

		let sectionEl = document.createElement("div");
		sectionEl.classList.add("timeline-title");

		let sectionId = "collapseExample"+i;
		let countLectures = sectionData.lectures.length;
		let subtitle = "";
		if (sectionData.description && sectionData.description!=""){
			subtitle = "<i>Mục tiêu</i> : "+sectionData.description;
		}

		sectionEl.innerHTML = `
         	<b>${sectionData.name}</b> &middot; ${countLectures} bài học &middot; ${sectionData['time-estimate']} 
          	<div class="timeline-subtitle">${subtitle}</div>
           	<a class="timeline-content-more" data-toggle="collapse" href="#${sectionId}" role="button" aria-expanded="false" aria-controls="${sectionId}" id="collapse${i}">
			    Xem các bài học
			</a>
		    <div class="collapse" id="${sectionId}"></div>
		`;

		let listLecture = sectionEl.querySelector(":scope #"+sectionId);

		for (let j=1; j<=sectionData.lectures.length; j++){
			let lectureData = sectionData.lectures[j-1];

			let lectureEl = document.createElement("div");
			lectureEl.classList.add("timeline-content");

			let icon = "<i class='fas fa-play'></i>";

			if (lectureData.done == true){
				lectureEl.classList.add("complete");
				icon = "<i class='fas fa-undo-alt'></i>";
			}else if (lectureData.done == false){
				lectureEl.classList.add("failue");
				icon = "<i class='fas fa-undo-alt'></i>";
			}
			
			lectureEl.innerHTML = `
				<div>
         			<div class="content-title">
 						<b>${i}.${j}. ${lectureData.name} &middot;</b>&nbsp;${lectureData['time-estimate']}
 					</div>
 					<div class="content-subtitle">
 						${lectureData.description}
 					</div>
 				</div>
 				<div class="icon-content">
 					<a style="color: inherit;">
                    	${icon}
                  	</a>
 				</div>
			`;

			lectureEl.onclick = (eventClick)=>{
				location.href = './learn-dynamic.html?section='+i+"&lecture="+j;
			}

			listLecture.appendChild(lectureEl);
		}

		learningPathEl.appendChild(sectionEl);
	}

	let timelineEndEl = document.createElement("div");
	timelineEndEl.classList.add("timeline-end");
	timelineEndEl.innerHTML = "<b>Kết thúc khóa học</b>";
	learningPathEl.appendChild(timelineEndEl);
}
