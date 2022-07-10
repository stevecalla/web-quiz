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
let scoreList = document.querySelector("#high-scores-container ol");
let errorMessage = document.getElementById("error-message");

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
  resetGameStatsAndTimers();
});

//section:functions and event handlers go here 👇
function setGameDuration() {
  gameDuration = 60;
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
  //todo:DONE - filter for high scores DONE
  //todo:fix score less than 0... global game duration less than 0 === 0
  //todo:DONE - when clear local storage also clear game board
  //todo:DONE - touppercase for input box and game stats
  //todo:DONE - clear initials input
  //todo:DONE - focus initials input box
  //todo:DONE - high scores click not clearing question timer?
  //todo:DONE - validation on input box?
  event.preventDefault();
  let gameStats = {};
  let allGames = [];
  let highScoreGames = [];
  // let scoreList = document.querySelector('#high-scores-container ol');

  if (playerInitials.value === "") {
    // displayMessage("error", "Email cannot be blank");
    console.log("aaaaa");
    playerInitials.focus();

    errorMessage.textContent = "";
    errorMessage.classList.remove("hide");
    errorMessage.textContent = "Player initials can not be blank";
    return;
  }

  scoreList.textContent = "";

  if (JSON.parse(localStorage.getItem("allGames")) !== null) {
    allGames = JSON.parse(localStorage.getItem("allGames"));
  }

  gameStats = {
    id: allGames.length + 1,
    player: playerInitials.value.toUpperCase(),
    score: gameDuration,
  };

  allGames.push(gameStats);
  allGames.sort((first, second) => first.score - second.score);
  allGames = sortAllGamesbyPlayer(allGames);

  console.log(allGames);

  for (let i = 0; i < allGames.length; i++) {
    console.log(i, i + 1, allGames.length);
    if (allGames.length === 1) {
      highScoreGames.push(allGames[i]);
    } else if (i + 1 === allGames.length) {
      highScoreGames.push(allGames[i]);
    } else if (allGames[i].player !== allGames[i + 1].player) {
      highScoreGames.push(allGames[i]);
    }
  }

  console.log(highScoreGames);

  localStorage.setItem("allGames", JSON.stringify(allGames));
  localStorage.setItem("highScoreGames", JSON.stringify(highScoreGames));

  highScoreGames.forEach((game) => {
    let gamePlayed = scoreList.appendChild(document.createElement("li"));
    gamePlayed.textContent = `${game.player} - ${game.score}`;
  });

  playerInitials.value = "";
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

  showPage === saveScorePage
    ? (playerInitials.focus(), errorMessage.classList.add("hide"))
    : playerInitials.blur();

  if (scoreList.textContent === "History Cleared") {
    scoreList.textContent = "";
    let noGamesPlayedText = scoreList.appendChild(document.createElement("p"));
    noGamesPlayedText.textContent = `No Games Played Yet`;
  }
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
  localStorage.clear();
  scoreList.textContent = "";
  let clearHistoryMessageText = scoreList.appendChild(
    document.createElement("p")
  );
  clearHistoryMessageText.textContent = `History Cleared`;
}

function sortAllGamesbyPlayer(allGames) {
  allGames.sort(function (a, b) {
    const nameA = a.player.toUpperCase(); // ignore upper and lowercase
    const nameB = b.player.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
  return allGames;
}
