"use strict";

// JSON bu formatda olmalidi
// [
//     {
//         "question": "1-ci sual",
//         "answers": ["1", "2", "3", "4"]
//     },
//     ...
// ]

const startExamBtn = document.querySelector("#start-exam");
const quizContainer = document.querySelector(".quiz-container");
const questionNumbers = document.querySelectorAll(".quiz-timeline span");
const questionContainer = document.querySelector(".quiz-question p");
const variantsList = document.querySelector(".quiz-question ul");
const resultContainer = document.querySelector(".result-container");
const resultFields = document.querySelectorAll(".result-field");

let currentQuestionIndex = +sessionStorage.currentQuestion || 0;
let questionsArray;

startExamBtn.addEventListener("click", getQuestions);
variantsList.addEventListener("change", chooseOption);
document.querySelector("#finish-exam").addEventListener("click", finishExam);

questionNumbers.forEach((item) => {
    item.addEventListener("click", (event) => {
        setQuestion(event.target.textContent - 1, currentQuestionIndex);
        event.stopPropagation();
    });
});

if (!sessionStorage.questions) {
    quizContainer.style.display = "none";
} else {
    startExamBtn.parentElement.style.display = "none";
    questionsArray = JSON.parse(sessionStorage.getItem("questions"));
    setQuestion(currentQuestionIndex, currentQuestionIndex);
}

async function getQuestions(event) {
    let response = await fetch("");
    let json = await response.json();
    questionsArray = JSON.parse(json);
    questionsArray.forEach((item) => {
        item.ra = setRandomVariants(item.answers);
        item.selected = null;
    });

    sessionStorage.setItem("questions", JSON.stringify(questionsArray));
    startExamBtn.parentElement.style.display = "none";
    resultContainer.classList.remove("d-flex", "center");
    quizContainer.style.display = "block";
    setQuestion(0, 0);
    event.stopPropagation();
}

function finishExam(event) {
    if (!confirm("İmtahan sonlandirilsin?")) return;

    let questionsCount = questionsArray.length;
    let right = 0, wrong = 0, notAnswered = 0;
    startExamBtn.textContent = "İmtahana yenidən başla";
    startExamBtn.parentElement.style.display = "flex";
    quizContainer.style.display = "none";
    questionNumbers[currentQuestionIndex].classList.remove("selected-question");

    for (let question of questionsArray) {
        question.selected === null ?
            notAnswered++ :
            question.selected === question.ra ?
            right++ :
            wrong++;
    }

    showResult(questionsCount, right, wrong, notAnswered);
    sessionStorage.clear();
    event.stopPropagation();
}

function setQuestion(index, previousQuestionIndex) {
    currentQuestionIndex = index > 14 ? 0 : index < 0 ? 14 : index;
    sessionStorage.setItem("currentQuestion", currentQuestionIndex);
    let questionObject = questionsArray[currentQuestionIndex];
    questionNumbers[previousQuestionIndex].classList.remove("selected-question");
    questionNumbers[currentQuestionIndex].classList.add("selected-question");

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
    let ra = 0;

    for (let i = 3; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        ra = (i === ra) ? j : (j === ra) ? i : ra;
    }

    return ra;
}

function chooseOption(event) {
    let questionObject = questionsArray[currentQuestionIndex];
    questionObject.selected = +event.target.value;
    sessionStorage.setItem("questions", JSON.stringify(questionsArray));
}

function showResult(a, b, c, d) {
    resultContainer.classList.add("d-flex", "center");
    resultFields[0].textContent = a;
    resultFields[1].textContent = b;
    resultFields[2].textContent = c;
    resultFields[3].textContent = d;
}
