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
let gameDuration;
let gameTimer;
let questionTimer;

//section:event listeners go here 👇
startGameButton.addEventListener("click", startGame);
saveButton.addEventListener("click", locallyStoreGameStats);
homePageButton.addEventListener("click", backToHomePage);
clearScoresButton.addEventListener("click", clearLocalStorage);
highScoresLink.addEventListener("click", function () {
  showHidePages(highScoresPage);
});

//section:functions and event handlers go here 👇
function setGameDuration() {
  gameDuration = 2;
}

function startGame() {
  setGameDuration();
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

function locallyStoreGameStats(event) {
  //todo:find high scores
  //todo:fix score less than 0... global game duration less than 0 === 0
  //todo:when clear local storage also clear game board
  //todo:clear initials input
  event.preventDefault();
  let allGames = [];
  let gameStats = {};
  let scoreList = document.querySelector('#high-scores-container ol');

  scoreList.textContent = '';

  if (JSON.parse(localStorage.getItem('webQuizStats')) !== null) {
    allGames = JSON.parse(localStorage.getItem('webQuizStats'));
  }

  gameStats = {
    "player": playerInitials.value,
    "score": gameDuration,
  };

  //keep high scores for each player

  // for (let i = 0; i < allGames.length; i++) {
  //   // console.log(allGames[i].player === gameStats.player);
  //   // if (allGames[i].player === gameStats.player && allGames[i].score <= gameStats.score) {
  //   //   allGames.slice(i, i + 1);
  //   //   allGames.push(gameStats);
  //   // }
  //   // if (allGames[i].player === gameStats.player) {
  //   //   // allGames.slice(i, i + 1);
  //   //   // allGames.push(gameStats);
  //   // }   
  // }

  // for (let i = 0; i < allGames.length; i++) {
  //   if (allGames[i].player === gameStats.player) {
  //     return;
  //   }
  // }

  allGames.push(gameStats);
  console.log('1 = ', allGames);

  // allGames.sort(function(a, b) {
  //   const nameA = a.player.toUpperCase(); // ignore upper and lowercase
  //   const nameB = b.player.toUpperCase(); // ignore upper and lowercase
  //   if (nameA < nameB) {
  //     return -1;
  //   }
  //   if (nameA > nameB) {
  //     return 1;
  //   }
  
  //   // names must be equal
  //   return 0;
  // });

  // // allGames.sort((first, second) => first.score - second.score);
  // console.log('2 = ', allGames);

  localStorage.setItem('webQuizStats', JSON.stringify(allGames));
  console.log(JSON.parse(localStorage.getItem('webQuizStats')));

  allGames.forEach(game => {
    let gamePlayed = scoreList.appendChild(document.createElement('li'));
    gamePlayed.textContent = `${game.player} - ${game.score}`;
  })

  showHidePages(highScoresPage);
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
  setGameDuration();
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