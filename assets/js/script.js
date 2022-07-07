//section:query selector variables go here 👇
let startGameButton = document.getElementById("start-button");
let gameTimeDisplay = document.getElementById("game-timer");
let answerContainer = document.getElementById("answer-container"); //used to add answer list to the page
let startPageContainer = document.getElementById("start-page");
let questionInput = document.getElementById("question-input"); //used to add question to the page
let answerStatus = document.getElementById("answer-status");
let playerInitials = document.getElementById("player-initials");
let saveButton = document.getElementById("save-button");
let saveScorePage = document.getElementById("save-score-page");
let finalScoreInfo = document.querySelector("#save-score-page p");

//section:global variables go here 👇
let questionNumber = 0;
let gameDuration = 60;
let countDownTime;
let questionTimer;

//section:event listeners go here 👇
startGameButton.addEventListener("click", gameTimer);
answerContainer.addEventListener("click", isAnswerCorrect);
saveButton.addEventListener("click", saveInitialsAndScore);

//section:functions and event handlers go here 👇
function gameTimer() {
  displayQuestion();

  countDownTime = setInterval(() => {
    gameDuration--;
    if (gameDuration > 0) {
      console.log(gameDuration);
      gameTimeDisplay.innerText = `Time Remaining: ${gameDuration} second(s)`;
    } else {
      gameTimeDisplay.innerText = `Time Remaining: 0 second(s)`;
      endGame();
    }
  }, 1000);
}

function displayQuestion(questionNumber = 0) {
  startPageContainer.classList.add("hide");
  questionInput.innerText = `${questionList[questionNumber].question}`;
  answerContainer.innerHTML = ``;
  for (let i = 0; i < questionList[questionNumber].answerList.length; i++) {
    answerContainer.innerHTML += `
       <li>${questionList[questionNumber].answerList[i]}</li>
    `;
  }
  answerContainer.addEventListener("click", isAnswerCorrect);
}

function isAnswerCorrect(event) {
  let selectedAnswer = event.target.innerText;
  let correctAnswer = questionList[questionNumber].correctAnswer;
  answerContainer.removeEventListener("click", isAnswerCorrect); //prevents selection of another answer
  answerContainer.style.borderBottom = "3px solid grey";
  //evaluate if answer is correct
  selectedAnswer === correctAnswer
    ? (answerStatus.innerText = "Correct")
    : ((answerStatus.innerText = `Wrong! Correct answer is "${correctAnswer}" (time reduced by 10 seconds)`),
      (gameDuration -= 10));
  setQuestionTimer();
}

//scrolls to next question 2 seconds after answer is selected
function setQuestionTimer() {
  questionTimer = setTimeout(() => {
    questionNumber++;
    if (questionNumber <= questionList.length - 1) {
      displayQuestion(questionNumber);
      answerStatus.innerText = "";
      answerStatus.style.border = null;
      answerContainer.style.borderBottom = null;
    } else {
      endGame();
    }
  }, 2000);
}

function endGame() {
  console.log("clear - end game");
  clearTimeout(questionTimer);
  clearInterval(countDownTime);
  questionInput.classList.add("hide");
  answerContainer.classList.add("hide");
  saveScorePage.classList.remove("hide");
  answerStatus.classList.add("hide");
  gameDuration < 0
    ? (finalScoreInfo.innerText = `Your final score is 0.`)
    : (finalScoreInfo.innerText = `Your final score is ${gameDuration}.`);
}

function saveInitialsAndScore(event) {
  // event.preventDefault();
  console.log(playerInitials.value, saveButton.value, saveButton.innerText);
  localStorage.setItem(playerInitials.value, "22");
}

// Creates an H3 element for the answer status
// var tag = document.createElement('h3');
// tag.setAttribute('id', 'answer-status');
// tag.style.borderTop = "3px solid grey";
// Appends tag as child of question page
//  document.getElementById('question-page').appendChild(tag);
//  tag.textContent = "Correct!"; // Adds text content to created tag
//  tag.textContent = "Wrong!"; // Adds text content to created tag
