//section:query selector variables go here 👇
let startGameButton = document.getElementById("start-button");
let gameTimeDisplay = document.getElementById("game-timer");
let answerContainer = document.getElementById("answer-container");
let homePage = document.getElementById("home-page");
let questionPage = document.getElementById("question-page");
let questionText = document.getElementById("question-input");
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
let renderQuestionNumber = document.getElementById("question-number");
let scoreList = document.querySelector("#high-scores-container ol");
let errorMessage = document.getElementById("error-message");
let gameOverMessage = document.getElementById("all-done-message");

//section:global variables go here 👇
let questionNumber = 0;
let gameDuration = 0;
let gameTimer;
let questionTimer;

//section:event listeners go here 👇
startGameButton.addEventListener("click", startGame);
saveButton.addEventListener("click", saveCurrentGame);
homePageButton.addEventListener("click", backToHomePage);
clearScoresButton.addEventListener("click", clearLocalStorage);
highScoresLink.addEventListener("click", highScoresLinkRouter);

//section:functions and event handlers go here 👇
//==== START GAME FUNCTIONS ====
function startGame() {
  setGameDuration();
  startGameTimer();
  renderQuestions(questionNumber);
}

function setGameDuration() {
  gameDuration = 100;
  renderTime();
}

//==== TIMER FUNCTIONS ====
function startGameTimer() {
  gameTimer = setInterval(() => {
    gameDuration > 0
      ? (gameDuration--, renderTime())
      : ((gameOverMessage.textContent = `Game Over. Out of Time.`), endGame());
  }, 1000);
}

function startQuestionTimer() {
  //after selection of an answer wait 2 second before going to next question or ending game if no more questions
  questionTimer = setTimeout(() => {
    questionNumber++;
    questionNumber <= questionList.length - 1
      ? renderQuestions(questionNumber)
      : ((gameOverMessage.textContent = `Game Over. No More Questions.`),
        endGame());
  }, 2000);
}

//==== DISPLAY GAME QUESTIONS ====
function renderQuestions(number) {
  pageRouter(questionPage);
  insertQuestionContent(number);
}

function pageRouter(showPage) {
  let allPages = [homePage, questionPage, saveScorePage, highScoresPage];

  allPages.forEach((page) => {
    //render requested page
    page === showPage
      ? showPage.classList.remove("hide")
      : page.classList.add("hide");
  });

  showPage === highScoresPage //if high scores page make header information invisable
    ? header.classList.add("cloak")
    : header.classList.remove("cloak");

  showPage === saveScorePage //if saveScorePage then focus the cursor in the player initials box
    ? (playerInitials.focus(), errorMessage.classList.add("hide"))
    : playerInitials.blur();
}

function insertQuestionContent(number) {
  let question = questionList[number].question; //get question
  let answerList = questionList[number].answerList; //get answers
  const alphabetString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //used to label answers

  //reset content
  answerStatus.textContent = "";
  answerContainer.textContent = ""; //clear prior answers

  //insert question content
  questionText.textContent = question; //insert question
  answerList.forEach((answer, index) => {
    //populate answers in list
    let choiceList = answerContainer.appendChild(document.createElement("li"));
    choiceList.textContent = `${alphabetString
      .charAt(index)
      .toLowerCase()}. ${answer}`;
    choiceList.setAttribute("data-text", answer); //set data attribute; use in isAnswerCorrect function
  });
  renderQuestionNumber.textContent = `Question: ${number + 1} of ${
    questionList.length
  }`;

  //render styling
  renderAnswersStyling("add", "remove"); //apply styling passing add hover, remove border, add listener

  //add event listener
  answerContainer.addEventListener("click", isAnswerCorrect); //add event listener inside function so it apples each time the line
}

function renderAnswersStyling(hover, border) {
  let answers = document.querySelectorAll(".answer-container li");
  answers.forEach((answer) => {
    answer.classList.add("answer-box"); //apply styling to each answer
    answer.classList[hover]("answer-box-hover"); //apply hover styling
  });
  answerContainer.classList[border]("add-border"); //add or remove border based on paramter
}

//==== VALIDATE ANSWER ====
function isAnswerCorrect(event) {
  let selectedAnswer = event.target;
  let correctAnswer = questionList[questionNumber].correctAnswer;
  let isCorrect = false;

  if (selectedAnswer.matches("li")) {
    selectedAnswer.dataset.text.includes(correctAnswer)
      ? (isCorrect = true)
      : isCorrect;
  }

  startQuestionTimer(); //starts timer to move to the next question after 2 seconds

  renderAnswersStyling("remove", "add"); //remove hover, add border
  renderDurationAdjustment(isCorrect); //decrement time by 10 seconds and render
  renderSelectedAnswerMessage(isCorrect, correctAnswer);
  renderSelectedAnswerStyleSound(isCorrect, selectedAnswer);

  answerContainer.removeEventListener("click", isAnswerCorrect); //remove event listener
  isLastQuestion(); //clear interval time if last question
}

function renderDurationAdjustment(isCorrect) {
  if (!isCorrect) {
    gameDuration -= 10;
    renderTime();
  }
}

function renderSelectedAnswerMessage(isCorrect, correctAnswer) {
  isCorrect
    ? (answerStatus.textContent = "Correct")
    : (answerStatus.textContent = `Wrong! Correct answer is "${correctAnswer}" (time reduced by 10 seconds)`);
}

function renderSelectedAnswerStyleSound(isCorrect, selectedAnswer) {
  selectedAnswer.classList.add("answer-box-selected"); //applies common styling
  isCorrect
    ? (selectedAnswer.classList.add("answer-box-selected-correct"),
      document.getElementById("correct-answer-sound-effect").play())
    : (selectedAnswer.classList.add("answer-box-selected-wrong"),
      document.getElementById("wrong-answer-sound-effect").play());
}

function isLastQuestion() {
  //clear interval timer on last question
  if (questionNumber === questionList.length - 1) {
    clearInterval(gameTimer);
  }
}

//==== SAVE SCORE PAGE ==== //
function renderScore() {
  finalScoreInfo.textContent = `Your final score is ${gameDuration}.`;
}

function saveCurrentGame(event) {
  event.preventDefault();
  if (validateInitialsInput() === "invalid input") {
    //validate input
    return;
  }
  saveAndRenderGameHistory();
}

function validateInitialsInput() {
  const alphabetString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //used to validate input
  let isValid = true;

  //validation rules
  playerInitials.value.length < 2 ? (isValid = false) : isValid;
  for (let i = 0; i < playerInitials.value.length; i++) {
    if (
      !alphabetString.includes(playerInitials.value.charAt(i).toUpperCase())
    ) {
      console.log("validate 3");
      isValid = false;
    }
  }

  //validation message
  if (isValid === false) {
    errorMessage.textContent = "";
    playerInitials.focus();
    errorMessage.classList.remove("hide");
    errorMessage.textContent = `Player initials a) can not be blank, b) must be at least 2 letters, c) no special characters, d) no numbers. Try again!`;
    return "invalid input";
  }
}

function saveAndRenderGameHistory() {
  let gameHistory = getLocalStorage(); //get local storage
  addCurrentGame(gameHistory); //sort allGames as prep to create high score games list);
}

function addCurrentGame(updateAllGames) {
  let gameStats = {};

  gameStats = {
    id: updateAllGames ? updateAllGames.length + 1 : 1,
    player: playerInitials.value.toUpperCase(),
    score: gameDuration,
  };

  if (gameStats.player) {
    updateAllGames.push(gameStats);
  }

  sortGames(updateAllGames); //go to next chained function
}

function sortGames(updateAllGames) {
  let allSortedGames = sortByScore(updateAllGames);
  allSortedGames = sortByPlayer(updateAllGames); //sort by player
  createHighScoreList(allSortedGames); //go to next chained function
}

function createHighScoreList(allSortedGames) {
  if (allSortedGames) {
    let highScoreGames = [];
    for (let i = 0; i < allSortedGames.length; i++) {
      if (allSortedGames.length === 1) {
        //if only one element exits push it
        highScoreGames.push(allSortedGames[i]);
      } else if (i + 1 === allSortedGames.length) {
        //if at the last element push it
        highScoreGames.push(allSortedGames[i]);
      } else if (allSortedGames[i].player !== allSortedGames[i + 1].player) {
        //else push high score
        highScoreGames.push(allSortedGames[i]);
      }
    }
    highScoreGames = sortByScore(highScoreGames, "desc"); //sort by score descending
    renderHighScores(highScoreGames, allSortedGames);
  }
}

//==== HIGH SCORE PAGE ==== //
function renderHighScores(highScoreGames, allSortedGames, status) {
  scoreList.textContent = "";
  let noGamesSavedText = "";

  if (status === "storageCleared") {
    noGamesSavedText = scoreList.appendChild(document.createElement("p"));
    noGamesSavedText.textContent = `History cleared`;
  } else if (highScoreGames.length > 0) {
    highScoreGames.forEach((game, index) => {
      let renderScores = scoreList.appendChild(document.createElement("li"));
      renderScores.textContent = `${index + 1}. ${game.player}: ${game.score}`;
    });
  } else {
    noGamesSavedText = scoreList.appendChild(document.createElement("p"));
    noGamesSavedText.textContent = `No scores saved yet`;
    status = ""; //clears out status so history cleared messages doesn't display
  }
  setLocalStorage(allSortedGames, highScoreGames);
  pageRouter(highScoresPage); //show high scores page
}

function backToHomePage() {
  let resetDuration = 0;
  pageRouter(homePage);
  resetQuestionContainer();
  resetAllTimers();
  resetGameStats(resetDuration);
}

//==== HIGH SCORES LINK ROUTER ====
function highScoresLinkRouter() {
  let wantToExitPage = confirmExitPage(); //popup alert to validate exit page

  //validation to ensure player wants to exit current page (when playing game or hasn't saved score)
  if (
    wantToExitPage.page === "savePage" &&
    wantToExitPage.isExitPage === false
  ) {
    pageRouter(saveScorePage);
    return;
  } else if (
    (wantToExitPage.page === "savePage" &&
      wantToExitPage.isExitPage === true) ||
    (wantToExitPage.page === "questionPage" &&
      wantToExitPage.isExitPage === true) ||
    wantToExitPage.page === "homePage"
  ) {
    if (wantToExitPage.page === "savePage") {
      playerInitials.value = "";
    } //clear initials if didn't click save button
    pageRouter(highScoresPage);
    saveAndRenderGameHistory();
    resetAllTimers();
    resetGameStats(gameDuration);
    return;
  }
}

function confirmExitPage() {
  let isExitPage = false;
  let page = "";

  //confirm exit page or not
  saveScorePage.offsetTop > 0
    ? ((isExitPage = window.confirm(
        `Opps. You DIDN'T save the score.\n\nDo you want to exit without saving?`
      )),
      (page = "savePage"))
    : questionPage.offsetTop > 0
    ? ((isExitPage = window.confirm(
        `Opps. You are playing.\n\nDo you want to exit this game?`
      )),
      (page = "questionPage"))
    : homePage.offsetTop > 0
    ? (page = "homePage")
    : isExitPage;

  return { isExitPage, page };
}

//==== UTILITY FUNCTIONS ====
function renderTime() {
  gameTimeDisplay.textContent = `Time: ${gameDuration} second(s)`;
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
    const nameA = a.player.toUpperCase(); //ignore upper and lowercase
    const nameB = b.player.toUpperCase(); //ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    //names must be equal
    return 0;
  });
  return playerSortedGames;
}

function endGame() {
  renderScore();
  resetAllTimers();
  resetGameStats(gameDuration);
  pageRouter(saveScorePage);
}

//==== RESET FUNCTIONS ====
function resetQuestionContainer() {
  questionText.textContent = null;
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

function resetGameStats(duration) {
  gameDuration = duration;
  questionNumber = 0;
  renderTime();
  playerInitials.value = ""; //clear playerInitials
}

//LOCAL STORAGE FUNCTIONS
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
  renderHighScores(null, null, "storageCleared"); //passes empty array to represent cleared local storage
}
