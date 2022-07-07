//section:query selector variables go here 👇
let startGameButton = document.getElementById('start-button');
let answerContainer = document.getElementById('answer-container');
let startPage = document.getElementById('start-page');
let questionPage = document.getElementById('question-page');
let answerStatus = document.getElementById('answer-status');
let playerInitials = document.getElementById('player-initials');
let saveButton = document.getElementById('save-button');

//section:global variables go here 👇

//section:event listeners go here 👇
startGameButton.addEventListener('click', displayQuestion);
answerContainer.addEventListener('click', targetElement);
saveButton.addEventListener('click', saveInitialsAndScore)

//section:functions and event handlers go here 👇
function displayQuestion() {
  // questionPage.classList.remove('hide'); //todo:add back to play game; also add hide class to question page
  // startPage.classList.add('hide'); //todo:add back to play game
}

function targetElement(event) {
  console.log(event.target.innerText);
  let selectedAnswer = event.target.innerText;

  answerContainer.style.borderBottom = "3px solid grey";
  answerContainer.removeEventListener('click', targetElement);

  if (selectedAnswer === 'Alerts') {
    console.log('correct');
    //log correct below answer list
    answerStatus.innerText = "Correct!!"
  } else {
    console.log('not correct');
    //reduce score by 10 points
    //reduce remaining time by 10 seconds
    //log wrong! below answer list\
    answerStatus.innerText = "Wrong!"
  }
}

function saveInitialsAndScore(event) {
  // event.preventDefault();
  console.log(playerInitials.value, saveButton.value, saveButton.innerText);
  localStorage.setItem(playerInitials.value, '22');
}