//section:query selector variables go here 👇
let startGameButton = document.getElementById('start-button');
let gameTimeDisplay = document.getElementById('game-timer');
let answerContainer = document.getElementById('answer-container'); //used to add answer list to the page
let startPage = document.getElementById('start-page');
let questionPage = document.querySelector('#question-page h1'); //used to add question to the page
let answerStatus = document.getElementById('answer-status');
let playerInitials = document.getElementById('player-initials');
let saveButton = document.getElementById('save-button');
let saveScorePage = document.getElementById('save-score-page');
let finalScoreInfo = document.querySelector('#save-score-page p');

//section:global variables go here 👇
let questionNumber = 0;
let gameDuration = 50;
let countDownTime;
let questionTimer;

//section:event listeners go here 👇
startGameButton.addEventListener('click', gameTimer);
answerContainer.addEventListener('click', targetElement);
// questionPage.addEventListener('click', targetElement);
saveButton.addEventListener('click', saveInitialsAndScore)

//section:functions and event handlers go here 👇
function gameTimer() {
  console.log('timer');
  displayQuestion();
  countDownTime = setInterval(() => {
    gameDuration--;
    if (gameDuration > 0) {
      console.log(gameDuration);
      gameTimeDisplay.innerText = `Time Remaining: ${gameDuration} second(s)`;
    } else {
      gameTimeDisplay.innerText = `Time Remaining: 0 second(s)`;
      clearInterval(countDownTime);
      clearTimeout(questionTimer);
      console.log('clear');
      // gameDuration = 10;

      //createfunction
      questionPage.classList.add('hide');
      answerContainer.classList.add('hide');
      saveScorePage.classList.remove('hide');
      answerStatus.classList.add('hide');
      gameDuration < 0 ?  finalScoreInfo.innerText = `Your final score is 0.` : finalScoreInfo.innerText = `Your final score is ${gameDuration}.`
    }
  }, 1000);
}

function displayQuestion(event, questionNumber = 0) {
  console.log(questionNumber, 'hello');
  // questionPage.classList.remove('cloak'); //todo:add back to play game; also add hide class to question page
  // questionPage.classList.add('show'); //todo:add back to play game; also add hide class to question page
  startPage.classList.add('hide'); //todo:add back to play game

  questionPage.innerText = `${questionList[questionNumber].question}`;

  answerContainer.innerHTML = ``;
  for (let i = 0; i < questionList[questionNumber].answerList.length; i++) {
    answerContainer.innerHTML += `
       <li>${questionList[questionNumber].answerList[i]}</li>
    `
  }
  answerContainer.addEventListener('click', targetElement);
  console.log(answerContainer);
}

function targetElement(event) {
  console.log(event.target)
  console.log(event.target.innerText);
  let selectedAnswer = event.target.innerText;
  answerContainer.removeEventListener('click', targetElement);


   if (selectedAnswer === questionList[questionNumber].correctAnswer) {
     console.log('correct');
     answerStatus.innerText = "Correct";
     answerContainer.style.borderBottom = "3px solid grey";
   } else {
     console.log('not correct');
     answerStatus.innerText = "Wrong! -- Time remaining reduced by 10 seconds";
     answerContainer.style.borderBottom = "3px solid grey";
     gameDuration = gameDuration - 10;
    //  clearTimeout(questionTimer);
    //  questionNumber++;
    //  displayQuestion(event, questionNumber);
     //reduce score by 10 points
     //reduce remaining time by 10 seconds
   }

  questionTimer = setTimeout(() => {
    console.log(questionTimer);
    questionNumber++;
    if (questionNumber <= questionList.length - 1) {
      console.log(questionList.length, questionNumber, questionNumber < questionList.length);
      displayQuestion(event, questionNumber);
      answerStatus.innerText = '';
      answerStatus.style.border = null;
      answerContainer.style.borderBottom = null;
    } else {
      console.log('clear');
      console.log(questionList.length, questionNumber, questionNumber < questionList.length);
      clearTimeout(questionTimer);

      //create function
      clearInterval(countDownTime);
      questionPage.classList.add('hide');
      answerContainer.classList.add('hide');
      saveScorePage.classList.remove('hide');
      answerStatus.classList.add('hide');
      gameDuration < 0 ?  finalScoreInfo.innerText = `Your final score is 0.` : finalScoreInfo.innerText = `Your final score is ${gameDuration}.`
    }
  }, 3000);

}

function saveInitialsAndScore(event) {
  // event.preventDefault();
  console.log(playerInitials.value, saveButton.value, saveButton.innerText);
  localStorage.setItem(playerInitials.value, '22');
}

  
  // Creates an H3 element for the answer status
  // var tag = document.createElement('h3');
  // tag.setAttribute('id', 'answer-status');
  // tag.style.borderTop = "3px solid grey";
   // Appends tag as child of question page
  //  document.getElementById('question-page').appendChild(tag);
  //  tag.textContent = "Correct!"; // Adds text content to created tag
  //  tag.textContent = "Wrong!"; // Adds text content to created tag