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
// ==== START GAME FUNCTIONS ====
function startGame() {
  setGameDuration();
  startGameTimer();
  renderQuestions(questionNumber);
}

function setGameDuration() {
  gameDuration = 5;
  renderTime();
}

// ==== TIMER FUNCTIONS ====
function startGameTimer() {
  gameTimer = setInterval(() => {
    gameDuration > 0
      ? (gameDuration--,
        renderTime())
      : ((document.getElementById(
          "all-done-message"
        ).textContent = `Game Over. Out of Time.`),
        endGame());
  }, 1000);
}

function startQuestionTimer() {
  //after selection of an answer wait 2 second before going to next question or ending game if no more questions
  questionTimer = setTimeout(() => {
    questionNumber++;
    questionNumber <= questionList.length - 1
      ? renderQuestions(questionNumber)
      : ((document.getElementById(
          "all-done-message"
        ).textContent = `Game Over. No More Questions.`),
        endGame());
  }, 2000);
}

// ==== DISPLAY GAME QUESTIONS ====
function renderQuestions(number) {
  routeToPage(questionPage);
  insertQuestionContent(number);
}

function routeToPage(showPage) {
  let allPages = [
    homePage,
    questionPage,
    saveScorePage,
    highScoresPage,
  ];

  allPages.forEach((page) => {
    //render requested page
    page === showPage
      ? showPage.classList.remove("hide")
      : page.classList.add("hide");
  });

  showPage === highScoresPage //if high scores page make header information invisable
    ? header.classList.add("cloak")
    : // scoreList.textContent = 'No Games Played Yet.')
      header.classList.remove("cloak");

  showPage === saveScorePage //if saveScorePaage then focus the cursor in the player initials box
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
  answerList.forEach((answer, index) => { //populate answers in list
    let choiceList = answerContainer.appendChild(document.createElement("li"));
    choiceList.textContent = `${alphabetString.charAt(index).toLowerCase()}. ${answer}`;
    choiceList.setAttribute('data-text', answer); //set data attribute; use in isAnswerCorrect function
  });
  renderQuestionNumber.textContent = `Question: ${number + 1} of ${questionList.length}`;

  // render styling
  renderAnswersStyling("add", "remove"); //apply styling passing add hover, remove border, add listener
  
  // add event listener
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

// ==== VALIDATE ANSWER ====
function isAnswerCorrect(event) {
  let selectedAnswer = event.target;
  let correctAnswer = questionList[questionNumber].correctAnswer;
  let isCorrect = false;

  if (selectedAnswer.matches("li")) {selectedAnswer.dataset.text.includes(correctAnswer) ? isCorrect = true : isCorrect};  

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
  isCorrect ? answerStatus.textContent = "Correct" : answerStatus.textContent = `Wrong! Correct answer is "${correctAnswer}" (time reduced by 10 seconds)`;
}

function renderSelectedAnswerStyleSound(isCorrect, selectedAnswer) {
  selectedAnswer.classList.add("answer-box-selected"); //applies common styling
  isCorrect ? (selectedAnswer.classList.add("answer-box-selected-correct"),
              document.getElementById("correct-answer-sound-effect").play()) : 
              (selectedAnswer.classList.add("answer-box-selected-wrong"),
              document.getElementById("wrong-answer-sound-effect").play());
}

function isLastQuestion() { //clear interval timer on last question
  if (questionNumber === questionList.length - 1) {clearInterval(gameTimer)};
}

// ==== SAVE SCORE PAGE ==== //
function renderScore() {
  finalScoreInfo.textContent = `Your final score is ${gameDuration}.`;
}

function saveCurrentGame(event) {
  event.preventDefault();
  // let gameHistory = [];
  if (validateInitialsInput() === "invalid input") { // validate input
    return;
  }
  // gameHistory = getLocalStorage(); //get local storage
  // addCurrentGame(gameHistory); //sort allGames as prep to create high score games list);
  saveAndRenderGameHistory();
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
  sortGames(updateAllGames);
}

function sortGames(updateAllGames) {
  let allSortedGames = sortByScore(updateAllGames);
  allSortedGames = sortByPlayer(updateAllGames); //sort by player
  createHighScoreList(allSortedGames);
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
        highScoreGames.push(allSortedGames[i]);
      }
    }
    highScoreGames = sortByScore(highScoreGames, "desc");
    renderHighScores(highScoreGames, allSortedGames);
  }
}

// ==== HIGH SCORE PAGE ==== //
function renderHighScores(highScoreGames, allSortedGames, status) {
  scoreList.textContent = "";
  let noGamesPlayedText = "";

  // console.log(scoreList.textContent, scoreList.textContent === "")
  // console.log(highScoreGames, highScoreGames.length, highScoreGames.length === 0)

  if (status === "storageCleared") {
    noGamesPlayedText = scoreList.appendChild(document.createElement("p"));
    noGamesPlayedText.textContent = `History Cleared`;
  } else if (highScoreGames.length > 0) {
    highScoreGames.forEach((game, index) => {
      let renderHighScore = scoreList.appendChild(
        document.createElement("li")
      );
      renderHighScore.textContent = `${index + 1}. ${game.player}: ${
        game.score
      }`;
    });
  } else {
    noGamesPlayedText = scoreList.appendChild(document.createElement("p"));
    noGamesPlayedText.textContent = `No Games Played Yet`;
  }

  if (status === "storageCleared") {
    status = "No Games";
  }
  // console.log(status);
  setLocalStorage(allSortedGames, highScoreGames);
  routeToPage(highScoresPage); //show high scores page
}

function backToHomePage() {
  routeToPage(homePage);
  // playerInitials.value = ""; //clear playerInitials
  resetQuestionContainer();
  resetAllTimers();
  let resetDuration = 0;
  resetGameStats(resetDuration);
}

// ==== HIGH SCORES LINK ROUTER ====
function highScoresLinkRouter() {
  let wantToExitPage = confirmExitPage();
  if (wantToExitPage.page === "questionPage" && wantToExitPage.isExitPage === true) {
    routeToPage(highScoresPage);
    saveAndRenderGameHistory();
  } else if (wantToExitPage.page === "savePage" && wantToExitPage.isExitPage === true) {
    routeToPage(saveScorePage);
  } else if ((wantToExitPage.page === "savePage" && wantToExitPage.isExitPage === false)) {
    routeToPage(highScoresPage);
    resetAllTimers();
    resetGameStats(gameDuration);
    saveAndRenderGameHistory();
  } else {
    routeToPage(highScoresPage);
    saveAndRenderGameHistory();
  }
}

function confirmExitPage() {
  let isExitPage = false;
  let page = "";
  if (saveScorePage.offsetTop > 0) {
    //determines if user is on save score page
    isExitPage = window.confirm(
      `Opps. You DIDN'T save the score.\n\nDo you want to save the score?`
    );
    page = "savePage";
  }
  if (questionPage.offsetTop > 0) {
    isExitPage = window.confirm(
      `Opps. You are playing.\n\nDo you want to exit this game?`
    );
    page = "questionPage";
  }
  return {isExitPage, page};
}

// ==== UTILITY FUNCTIONS ====
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
  renderScore();
  resetAllTimers();
  resetGameStats(gameDuration);
  routeToPage(saveScorePage);
}

// ==== RESET FUNCTIONS ====
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

// LOCAL STORAGE FUNCTIONS
function getLocalStorage() {
  let gameHistory = [];
  if (JSON.parse(localStorage.getItem("allGames")) !== null) {
    gameHistory = JSON.parse(localStorage.getItem("allGames"));
  }
  // console.log('1', gameHistory);
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
