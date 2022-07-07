//section:query selector variables go here 👇
let startGameButton = document.getElementById('start-button');
let answerContainer = document.getElementById('answer-container');
let startPage = document.getElementById('start-page');
let questionPage = document.getElementById('question-page');

//section:global variables go here 👇

//section:event listeners go here 👇
startGameButton.addEventListener('click', displayQuestion);
answerContainer.addEventListener('click', targetElement);

//section:functions and event handlers go here 👇
function displayQuestion() {
  questionPage.classList.remove('hide');
  startPage.classList.add('hide');
}

function targetElement(event) {
  console.log(event.target.innerText);
  let selectedAnswer = event.target.innerText;
  if (selectedAnswer === 'Alerts') {
    console.log('correct');
    //log correct below answer list
  } else {
    console.log('not correct');
    //reduce score by 10 points
    //reduce remaining time by 10 seconds
    //log wrong! below answer list
  }
}