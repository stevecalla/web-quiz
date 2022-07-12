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
saveButton.addEventListener("click", processSavingGame);
homePageButton.addEventListener("click", backToHomePage);
clearScoresButton.addEventListener("click", clearLocalStorage);
highScoresLink.addEventListener("click", highScoresLinkRouter);

//section:functions and event handlers go here 👇
window.onload = function () {
  let gameHistory = getLocalStorage(); //retreives local storage
  displayNoScoresOrScoreList(gameHistory); //determines whether to list scores or indicate no scores exist
};

// ==== START GAME FUNCTIONS ====
function startGame() {
  setGameDuration();
  startGameTimer();
  displayQuestions(questionNumber);
}

function setGameDuration() {
  gameDuration = 75;
}

// ==== TIMER FUNCTIONS ====
function startGameTimer() {
  gameTimer = setInterval(() => {
    // gameDuration--;
    gameDuration > 0
    ? (gameDuration--, gameTimeDisplay.textContent = `Time: ${gameDuration} second(s)`)
    : (document.getElementById('all-done-message').textContent = `Game Over. Out of Time.`, endGame());
  }, 1000);
}

function startQuestionTimer() { //after selection of an answer wait 2 second before going to next question or ending game if no more questions
  questionTimer = setTimeout(() => {
    questionNumber++;
    questionNumber <= questionList.length - 1
    ? displayQuestions(questionNumber)
    : (document.getElementById('all-done-message').textContent = `Game Over. No More Questions.`, endGame());
  }, 2000);
}

// ==== DISPLAY GAME QUESTIONS ====
function displayQuestions(number) {
  routeToPage(questionPage);
  insertQuestionContent(number);
}

function insertQuestionContent(number) {
  let question = questionList[number].question;
  let answerList = questionList[number].answerList;
  //insert content
  answerStatus.textContent = "";
  questionInput.textContent = question; //insert question
  answerContainer.textContent = ""; //clear prior answers
  answerList.forEach((answer) => { //populate answers in list
    let choiceList = answerContainer.appendChild(document.createElement("li"));
    choiceList.textContent = answer;
  });
  displayQuestionNumber.textContent = `Question: ${number + 1} of ${
    questionList.length
  }`;
  //apply stying
  applyAnswerStylesAndListener("add", "remove"); //parameters add hover, remove border, add listener
  //add event listener
  answerContainer.addEventListener("click", isAnswerCorrect); //add event listener inside function so it apples each time the line elements are created
}

function applyAnswerStylesAndListener(hover, border, addListner) {
  console.log(hover, border, addListner);
  let answers = document.querySelectorAll(".answer-container li");
  console.log(answers);
  answers.forEach((answer) => {
    answer.classList.add("answer-box"); //apply styling to each answer
    answer.classList[hover]("answer-box-hover"); //apply hover styling
  });
  answerContainer.classList[border]("add-border"); //add or remove border based on paramter
}

// ==== VALIDATE ANSWER ====
function isAnswerCorrect(event) {
  let selectedAnswer = event.target;
  let correctAnswer = questionList[questionNumber].correctAnswer;
  if (selectedAnswer.matches('li')) {
    selectedAnswer.textContent === correctAnswer //evaluate if answer is correct
      ? (answerStatus.textContent = "Correct")
      : ((answerStatus.textContent = `Wrong! Correct answer is "${correctAnswer}" (time reduced by 10 seconds)`),
        (gameDuration -= 10), gameTimeDisplay.textContent = `Time: ${gameDuration} second(s)`);
  
    startQuestionTimer(); //starts timer to move to the next question after 2 seconds
    applyAnswerStylesAndListener("remove", "add", "removeListener", selectedAnswer); //parameter remove hover, add border, 
    event.target.classList.add("answer-box-selected"); //applies selected answer styling
    //remove event listener
    answerContainer.removeEventListener("click", isAnswerCorrect);
  }
  if (questionNumber === questionList.length - 1) { //clears invterval timer after selecting answer on final question
    clearInterval(gameTimer);
  }
}

// ==== SAVE SCORE PAGE ==== //
function displayScore() {
  gameDuration < 0
    // ? (finalScoreInfo.textContent = `Your final score is 0.`)
    ? (finalScoreInfo.textContent = `Your final score is ${gameDuration}.`)
    : (finalScoreInfo.textContent = `Your final score is ${gameDuration}.`);
}

function processSavingGame(event) {
  event.preventDefault();
  let allGames = [];
  if (validateInitialsInput() === "invalid input") {
    //validate input
    return;
  }
  allGames = getLocalStorage(); //get local storage
  allGames = addCurrentGameAndSortAllGames(allGames); //sort allGames as prep to create high score games list
  let highScoreGames = createHighScoreList(allGames);
  displayHighScores(highScoreGames);
  setLocalStorage(allGames, highScoreGames);
  routeToPage(highScoresPage); //show high scores page
}

function validateInitialsInput() {
  if (playerInitials.value === "") {
    playerInitials.focus();
    errorMessage.textContent = "";
    errorMessage.classList.remove("hide");
    errorMessage.textContent = "Player initials can not be blank";
    return "invalid input";
  }
}

function addCurrentGameAndSortAllGames(allGames) {
  let gameStats = {};
  gameStats = {
    id: allGames ? allGames.length + 1 : 1,
    player: playerInitials.value.toUpperCase(),
    score: gameDuration,
  };
  allGames.push(gameStats);
  allGames = sortByScore(allGames);
  allGames = sortByPlayer(allGames); //sort by player
  playerInitials.value = ""; //clear playerInitials
  return allGames;
}

function createHighScoreList(allGames) {
  if (allGames) {
    let highScoreGames = [];
    for (let i = 0; i < allGames.length; i++) {
      // console.log(i, i + 1, allGames.length);
      if (allGames.length === 1) {
        highScoreGames.push(allGames[i]);
      } else if (i + 1 === allGames.length) {
        highScoreGames.push(allGames[i]);
      } else if (allGames[i].player !== allGames[i + 1].player) {
        highScoreGames.push(allGames[i]);
      }
    }
    highScoreGames = sortByScore(highScoreGames, "desc");
    return highScoreGames;
  }
}

function displayHighScores(highScoreGames) {
  // console.log(highScoreGames);
  if (!highScoreGames) {
    return;
  }
  highScoreGames.forEach((game) => {
    let gamePlayed = scoreList.appendChild(document.createElement("li"));
    gamePlayed.textContent = `${game.player} - ${game.score}`;
  });
}

// ==== HIGH SCORE PAGE ==== //
function displayNoScoresOrScoreList(gameHistory, status) {
  scoreList.textContent = "";
  let noGamesPlayedText = "";

  if (status === "storageCleared") {
    noGamesPlayedText = scoreList.appendChild(document.createElement("p"));
    noGamesPlayedText.textContent = `History Cleared`;
  } else if (gameHistory.length === 0) {
    noGamesPlayedText = scoreList.appendChild(document.createElement("p"));
    noGamesPlayedText.textContent = `No Games Played Yet`;
  } else {
    displayHighScores(createHighScoreList(gameHistory));
  }
}

function backToHomePage() {
  routeToPage(homePageMainContainer);
  resetQuestionContainer();
  setGameDuration();
  resetAllTimers();
  resetGameStats();
}

// ==== HIGH SCORES LINK ROUTER ====
function highScoresLinkRouter() {
  let wantToSave = confirmDontSave();
  if (wantToSave === true) {
    routeToPage(saveScorePage);
  } else {
    routeToPage(highScoresPage);
    // setGameDuration();
    resetAllTimers();
    resetGameStats();
  }
}

function confirmDontSave() {
  let wantToSave = false;
  if (document.getElementById("save-score-page").offsetTop > 0) {
    //determines if user is on save score page
    wantToSave = window.confirm(
      `Opps. You DIDN'T save the score.\n\nDo you want to save the score?`
    );
  }
  return wantToSave;
}

// ==== UTILITY FUNCTIONS ====
function routeToPage(showPage) {
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

  if (showPage === highScoresPage) {
    let gameHistory = getLocalStorage();
    displayNoScoresOrScoreList(gameHistory);
  }
}

function sortByScore(games, order) {
  let scoreSortedGames =
    order === "desc"
      ? games.sort((first, second) => second.score - first.score)
      : games.sort((first, second) => first.score - second.score);
  return scoreSortedGames;
}

function sortByPlayer(allGames) {
  let playerSortedGames = allGames.sort(function (a, b) {
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
  return playerSortedGames;
}

function endGame() {
  displayScore();
  resetAllTimers();
  resetGameStats();
  routeToPage(saveScorePage);
}

// ==== RESET FUNCTIONS ====
function resetQuestionContainer() {
  questionInput.textContent = null;
  answerContainer.textContent = null;
  answerStatus.textContent = null;
  answerContainer.addEventListener("click", isAnswerCorrect);
  answerContainer.classList.remove("add-border");
  questionPage.classList.add("hide");
}

function resetAllTimers() {
  clearInterval(gameTimer);
  clearTimeout(questionTimer);
  gameTimer = null;
  questionTimer = null;
}

function resetGameStats() {
  questionNumber = 0;
  gameTimeDisplay.textContent = `Time: ${gameDuration} second(s)`;
}

// LOCAL STORAGE FUNCTIONS
function getLocalStorage() {
  let gameHistory = [];
  if (JSON.parse(localStorage.getItem("allGames")) !== null) {
    gameHistory = JSON.parse(localStorage.getItem("allGames"));
  }
  return gameHistory;
}

function setLocalStorage(allGames, highScoreGames) {
  localStorage.setItem("allGames", JSON.stringify(allGames));
  localStorage.setItem("highScoreGames", JSON.stringify(highScoreGames));
}

function clearLocalStorage() {
  localStorage.clear();
  scoreList.textContent = "";
  displayNoScoresOrScoreList("[]", "storageCleared"); //passes empty array to represent cleared local storage
}
