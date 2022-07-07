//section:query selector variables go here 👇
let startGameButton = document.getElementById("start-button");
let gameTimeDisplay = document.getElementById("game-timer");
let answerContainer = document.getElementById("answer-container"); //used to add answer list to the page
let homePageContainer = document.getElementById("start-page");
let questionInput = document.getElementById("question-input"); //used to add question to the page
let answerStatus = document.getElementById("answer-status");
let playerInitials = document.getElementById("player-initials");
let saveButton = document.getElementById("save-button");
let saveScorePage = document.getElementById("save-score-page");
let finalScoreInfo = document.querySelector("#save-score-page p");
let highScoresPage = document.getElementById('high-scores-container');
let header = document.getElementById('header');
let homePageButton = document.getElementById('back-to-start-page');

//section:global variables go here 👇
let questionNumber = 0;
let gameDuration = 60;
let countDownTime;
let questionTimer;

//section:event listeners go here 👇
startGameButton.addEventListener("click", startGame);
answerContainer.addEventListener("click", isAnswerCorrect);
saveButton.addEventListener("click", savePlayerInitialsAndScore);
homePageButton.addEventListener("click", backToHomePage);

//section:functions and event handlers go here 👇
function startGame() {
  startGameTimer()
  displayQuestion();
}

function startGameTimer() {
  countDownTime = setInterval(() => {
    gameDuration--;
    if (gameDuration > 0) {
      console.log(gameDuration);
      gameTimeDisplay.innerText = `Time Remaining: ${gameDuration} second(s)`;
    } else {
      console.log(gameDuration);
      gameTimeDisplay.innerText = `Time Remaining: 0 second(s)`;
      endGame();
    }
  }, 1000);
}

function displayQuestion(questionNumber = 0) {
  console.log(questionNumber);
  homePageContainer.classList.add("hide");
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
  startQuestionTimer();
}

//scrolls to next question 2 seconds after answer is selected
function startQuestionTimer() {
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
  answerStatus.classList.add("hide");
  saveScorePage.classList.remove("hide");
  gameDuration < 0
    ? (finalScoreInfo.innerText = `Your final score is 0.`)
    : (finalScoreInfo.innerText = `Your final score is ${gameDuration}.`);
}

function savePlayerInitialsAndScore(event) {
  event.preventDefault();
  console.log(playerInitials.value, saveButton.value, saveButton.innerText);
  localStorage.setItem(playerInitials.value, "22");
  displayHighScoresPage();
}

function displayHighScoresPage() {
  saveScorePage.classList.add("hide");
  highScoresPage.classList.remove("hide");
  console.log(document.getElementById('header'));
  header.classList.add('cloak');
}

function backToHomePage() {
  highScoresPage.classList.add("hide");
  header.classList.remove('cloak');
  homePageContainer.classList.remove("hide");
  resetQuestionContainer();
  resetGameStatsTimers();
}

function resetQuestionContainer() {
  questionInput.innerText = null;
  answerContainer.innerHTML = ``;
  answerStatus.innerText = null;
  answerContainer.addEventListener("click", isAnswerCorrect);
  answerContainer.style.borderBottom = null;
  questionInput.classList.remove("hide");
  answerContainer.classList.remove("hide");
  answerStatus.classList.remove("hide");
}

function resetGameStatsTimers() {
  gameDuration = 60;
  questionNumber = 0;
  countDownTime = null;
  questionTimer = null;
  gameTimeDisplay.innerText = `Time Remaining: ${gameDuration} second(s)`;
}

// Creates an H3 element for the answer status
// var tag = document.createElement('h3');
// tag.setAttribute('id', 'answer-status');
// tag.style.borderTop = "3px solid grey";
// Appends tag as child of question page
//  document.getElementById('question-page').appendChild(tag);
//  tag.textContent = "Correct!"; // Adds text content to created tag
//  tag.textContent = "Wrong!"; // Adds text content to created tag
