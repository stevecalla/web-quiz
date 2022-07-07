//section:query selector variables go here 👇
let startGameButton = document.getElementById('start-button');
// let answerContainer = document.getElementById('answer-container');
let startPage = document.getElementById('start-page');
let questionPage = document.getElementById('question-page');
let answerStatus = document.getElementById('answer-status');
let playerInitials = document.getElementById('player-initials');
let saveButton = document.getElementById('save-button');

//section:global variables go here 👇

//section:event listeners go here 👇
startGameButton.addEventListener('click', displayQuestion);
// answerContainer.addEventListener('click', targetElement);
questionPage.addEventListener('click', targetElement);
saveButton.addEventListener('click', saveInitialsAndScore)

//section:functions and event handlers go here 👇
function displayQuestion() {
  questionPage.classList.remove('hide'); //todo:add back to play game; also add hide class to question page
  startPage.classList.add('hide'); //todo:add back to play game
  questionPage.innerHTML = `
    <h1>${questionList[0].question}</h1>
    <ol id="answer-container">
      <li>${questionList[0].answerList[0]}</li>
      <li>${questionList[0].answerList[1]}</li>
      <li>${questionList[0].answerList[2]}</li>
      <li>${questionList[0].answerList[3]}</li>
    </ol>
  `
}

function targetElement(event) {
  console.log(event.target.innerText);
  let selectedAnswer = event.target.innerText;

  questionPage.removeEventListener('click', targetElement);
  
  // Creates an H3 element for the answer status
  var tag = document.createElement('h3');
  tag.setAttribute('id', 'answer-status');
  tag.style.borderTop = "3px solid grey";
   // Appends tag as child of question page
   questionPage.appendChild(tag);


  if (selectedAnswer === questionList[0].correctAnswer) {
    console.log('correct');
    tag.textContent = "Correct!"; // Adds text content to created tag
  } else {
    console.log('not correct');
    tag.textContent = "Wrong!"; // Adds text content to created tag
    //reduce score by 10 points
    //reduce remaining time by 10 seconds
  }
}

function saveInitialsAndScore(event) {
  // event.preventDefault();
  console.log(playerInitials.value, saveButton.value, saveButton.innerText);
  localStorage.setItem(playerInitials.value, '22');
}