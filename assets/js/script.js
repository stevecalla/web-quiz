//section:query selector variables go here 👇
let startGameButton = document.getElementById("start-button");
let gameTimeDisplay = document.getElementById("game-timer");
let answerContainer = document.getElementById("answer-container"); //used to add answer list to the page
let homePageMainContainer = document.getElementById("home-page");
let questionPage = document.getElementById("question-page");
let questionInput = document.getElementById("question-input"); //used to add question to the page
let answerStatus = document.getElementById("answer-status");
let playerInitials = document.getElementById("player-initials");
let saveButton = document.getElementById("save-button");
let saveScorePage = document.getElementById("save-score-page");
let finalScoreInfo = document.querySelector("#save-score-page p");
let highScoresPage = document.getElementById("high-scores-container");
let header = document.getElementById("header");
let homePageButton = document.getElementById("back-to-start-page");
let clearScoresButton = document.getElementById("clear-scores-button");
let highScoresLink = document.getElementById("high-scores-header");
let displayQuestionNumber = document.getElementById("question-number");

//section:global variables go here 👇
let questionNumber = 0;
let gameDuration = 60;
let gameTimer;
let questionTimer;

//section:event listeners go here 👇
startGameButton.addEventListener("click", startGame);
saveButton.addEventListener("click", savePlayerInitialsAndScore);
homePageButton.addEventListener("click", backToHomePage);
clearScoresButton.addEventListener("click", clearLocalStorage);
highScoresLink.addEventListener("click", function () {
  showHidePages(highScoresPage);
});

//section:functions and event handlers go here 👇
function startGame() {
  startGameTimer();
  displayQuestion();
}

function startGameTimer() {
  gameTimer = setInterval(() => {
    gameDuration--;
    if (gameDuration > 0) {
      // console.log(gameDuration);
      gameTimeDisplay.textContent = `Time Remaining: ${gameDuration} second(s)`;
    } else {
      console.log(gameDuration);
      gameTimeDisplay.textContent = `Time Remaining: 0 second(s)`;
      endGame();
    }
  }, 1000);
}

function displayQuestion(questionNumber = 0) {
  showHidePages(questionPage);
  insertQuestionContent(questionNumber);
}

function insertQuestionContent(questionNumber) {
  let question = questionList[questionNumber].question;
  let answerList = questionList[questionNumber].answerList;
  questionInput.textContent = question; //insert question
  answerContainer.textContent = null; //clear prior answers
  answerList.forEach((answer) => {
    //populate answers in list
    let choiceList = answerContainer.appendChild(document.createElement("li"));
    choiceList.textContent = answer;
  });
  displayQuestionNumber.textContent = `Question: ${questionNumber + 1} of ${
    questionList.length
  }`;
  answerContainer.addEventListener("click", isAnswerCorrect); //assign event listener to the new answer choices
}

function isAnswerCorrect(event) {
  let selectedAnswer = event.target.textContent;
  let correctAnswer = questionList[questionNumber].correctAnswer;
  answerContainer.removeEventListener("click", isAnswerCorrect); //prevents selection of another answer
  answerContainer.classList.add("add-border"); //add solid grey border via class and css vs using .style.borderBottom
  //evaluate if answer is correct
  selectedAnswer === correctAnswer
    ? (answerStatus.textContent = "Correct")
    : ((answerStatus.textContent = `Wrong! Correct answer is "${correctAnswer}" (time reduced by 10 seconds)`),
      (gameDuration -= 10));
  startQuestionTimer();
}

//scrolls to next question 2 seconds after answer is selected
function startQuestionTimer() {
  questionTimer = setTimeout(() => {
    questionNumber++;

    questionNumber <= questionList.length - 1
      ? ((answerStatus.textContent = ""),
        displayQuestion(questionNumber),
        answerContainer.classList.remove("add-border"))
      : endGame();
  }, 2000);
}

function endGame() {
  console.log("clear - end game");
  stopTimers();

  showHidePages(saveScorePage);

  gameDuration < 0
    ? (finalScoreInfo.textContent = `Your final score is 0.`)
    : (finalScoreInfo.textContent = `Your final score is ${gameDuration}.`);
}

function savePlayerInitialsAndScore(event) {
  event.preventDefault();
  console.log(
    playerInitials.value,
    "value",
    saveButton.value,
    "textcontent",
    saveButton.textContent
  );
  localStorage.setItem(playerInitials.value, "22");
  showHidePages(highScoresPage);
  // displayHighScoresPage();
}

function showHidePages(showPage) {
  let allPages = [
    homePageMainContainer,
    questionPage,
    saveScorePage,
    highScoresPage,
  ];

  for (let i = 0; i < allPages.length; i++) {
    allPages[i] === showPage
      ? showPage.classList.remove("hide")
      : allPages[i].classList.add("hide");
  }

  showPage === highScoresPage
    ? header.classList.add("cloak")
    : header.classList.remove("cloak");
}

function backToHomePage() {
  showHidePages(homePageMainContainer);
  resetQuestionContainer();
  resetGameStatsAndTimers();
}

function resetQuestionContainer() {
  questionInput.textContent = null;
  answerContainer.textContent = null;
  answerStatus.textContent = null;
  answerContainer.addEventListener("click", isAnswerCorrect);
  answerContainer.classList.remove("add-border");
  questionPage.classList.add("hide");
}

function resetGameStatsAndTimers() {
  gameDuration = 60;
  questionNumber = 0;
  stopTimers();
  gameTimeDisplay.textContent = `Time Remaining: ${gameDuration} second(s)`;
}

function stopTimers() {
  clearInterval(gameTimer);
  clearTimeout(questionTimer);
  gameTimer = null;
  questionTimer = null;
}

function clearLocalStorage() {
  console.log(localStorage);
  localStorage.clear();
  console.log(localStorage);
}