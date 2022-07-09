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
// answerContainer.addEventListener("click", isAnswerCorrect);
saveButton.addEventListener("click", savePlayerInitialsAndScore);
homePageButton.addEventListener("click", backToHomePage);
clearScoresButton.addEventListener("click", clearLocalStorage);
// highScoresLink.addEventListener("click", displayHighScoresPage);
highScoresLink.addEventListener("click", function() {
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
    if (questionNumber <= questionList.length - 1) {
      displayQuestion(questionNumber);
      answerContainer.classList.remove("add-border");
      answerStatus.textContent = "";
    } else {
      endGame();
    }
  }, 2000);
}

function endGame() {
  console.log("clear - end game");
  stopTimers();

  showHidePages(saveScorePage)
  // questionPage.classList.add("hide");
  // saveScorePage.classList.remove("hide");

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

// function displayHighScoresPage() {
//   highScoresPage.classList.remove("hide"); //display high scores pge
//   saveScorePage.classList.add("hide"); //hide save score page
//   header.classList.add("cloak"); //visibility hidden for header so it still takes up space
//   homePageMainContainer.classList.add("hide"); //hide header, home page main element
//   questionPage.classList.add("hide"); //hide questions container
//   resetGameStatsAndTimers(); //clear timers
// }

function showHidePages(showPage) {
  console.log(showPage);
  let allPages = [homePageMainContainer, questionPage, saveScorePage, highScoresPage];
  // console.log(!allPages.includes(showPage));
  // allPages.includes(showPage) ? highS coresPage : showPage;
  // console.log(showPage);
  let hidePages= allPages.filter(element => element !== showPage);
  //page to show
  showPage.classList.remove('hide');
  //pages to hide
  for (let i = 0; i < hidePages.length; i++) {
    hidePages[i].classList.add('hide');
    console.log(hidePages[i])
  };
  //cloak header
  if (showPage === highScoresPage) {
    header.classList.add("cloak"); //visibility hidden for header so it still takes up space
  } 
}

function backToHomePage() {
  highScoresPage.classList.add("hide");
  header.classList.remove("cloak");
  homePageMainContainer.classList.remove("hide");
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

// Creates an H3 element for the answer status
// var tag = document.createElement('h3');
// tag.setAttribute('id', 'answer-status');
// tag.style.borderTop = "3px solid grey";
// Appends tag as child of question page
//  document.getElementById('question-page').appendChild(tag);
//  tag.textContent = "Correct!"; // Adds text content to created tag
//  tag.textContent = "Wrong!"; // Adds text content to created tag
