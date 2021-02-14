"use strict";

// Bu formada göndər json-u
// getQuestions funkçiyasinda sorgu gedir
// Cavab massiv olsun 15 obyektdən ibarət
// [
//     {
//         "question": "1-ci sual",
//         "answers": [
//             "1-ci variant",
//             "2-ci variant",
//             "3-cü variant",
//             "4-cü variant"
//         ],
//         "selected": null
//     },
//     ...
// ]

const startExamBtn = document.querySelector("#start-exam");
const quizContainer = document.querySelector(".quiz-container");
const questionContainer = document.querySelector(".quiz-question p");
const variantsList = document.querySelector(".quiz-question ul");
variantsList.addEventListener("change", chooseOption);

let questionsArray;
let currentQuestionIndex = 0;
let questionNumbers = document.querySelectorAll(".quiz-timeline > span");

questionNumbers.forEach((item) => {
    item.addEventListener("click", (event) => {
        setQuestion(event.target.textContent - 1);
        event.stopPropagation();
    });
});

document.querySelector("#finish-exam").addEventListener("click", finishExam);

if (!sessionStorage.questions) {
    quizContainer.style.display = "none";
    startExamBtn.addEventListener("click", getQuestions);
} else {
    startExamBtn.parentElement.style.display = "none";
    questionsArray = JSON.parse(sessionStorage.getItem("questions"));
    setQuestion(0);
}

async function getQuestions(event) {
    let response = await fetch("");
    let json = await response.json();
	questionsArray = JSON.parse(json);
	questionsArray.forEach((item) => setRandomVariants(item.answers));
	sessionStorage.setItem("questions", JSON.stringify(questionsArray));
    startExamBtn.parentElement.style.display = "none";
    quizContainer.style.display = "block";
    setQuestion(0);
    event.stopPropagation();
}

function finishExam(event) {
	sessionStorage.clear();
	window.location.reload();
    event.stopPropagation();
}

function setQuestion(index) {
	currentQuestionIndex = index > 14 ?
	    0 :
	    index < 0 ?
	    14 :
	    index;

	let questionObject = questionsArray[currentQuestionIndex];

	if (!questionObject) {
        questionContainer.textContent = "";
        variantsList.style.display = "none";
	    return;
    }

	questionContainer.textContent = questionObject.question;
    variantsList.style.display = "block";

	for (let i = 0; i < 4; i++) {
		let li = variantsList.children[i];

		i === questionObject.selected ?
            li.firstElementChild.checked = true :
            li.firstElementChild.checked = false;

		li.lastElementChild.textContent = questionObject["answers"][i];
	}
}

function setRandomVariants(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function chooseOption(event) {
	let questionObject = questionsArray[currentQuestionIndex];
	questionObject.selected = +event.target.value;
	sessionStorage.setItem("questions", JSON.stringify(questionsArray));
}
