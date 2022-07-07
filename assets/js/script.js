//section:query selector variables go here 👇
let startGameButton = document.getElementById('start-button');
let answerContainer = document.getElementById('answer-container'); //used to add answer list to the page
let startPage = document.getElementById('start-page');
let questionPage = document.querySelector('#question-page h1'); //used to add question to the page
let answerStatus = document.getElementById('answer-status');
let playerInitials = document.getElementById('player-initials');
let saveButton = document.getElementById('save-button');

//section:global variables go here 👇
let questionNumber = 0;

//section:event listeners go here 👇
startGameButton.addEventListener('click', displayQuestion);
answerContainer.addEventListener('click', targetElement);
// questionPage.addEventListener('click', targetElement);
saveButton.addEventListener('click', saveInitialsAndScore)

//section:functions and event handlers go here 👇
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
  // questionPage.innerHTML = `
  //   <h1>${questionList[0].question}</h1>
  //   <ol id="answer-container">
  //     <li>${questionList[0].answerList[0]}</li>
  //     <li>${questionList[0].answerList[1]}</li>
  //     <li>${questionList[0].answerList[2]}</li>
  //     <li>${questionList[0].answerList[3]}</li>
  //   </ol>
  // `
  console.log(answerContainer);
}

function targetElement(event) {
  // event.stopPropagation();
  // console.log('hello')
  console.log(event.target)
  console.log(event.target.innerText);
  let selectedAnswer = event.target.innerText;
  answerContainer.removeEventListener('click', targetElement);
  
  // Creates an H3 element for the answer status
  // var tag = document.createElement('h3');
  // tag.setAttribute('id', 'answer-status');
  // tag.style.borderTop = "3px solid grey";
   // Appends tag as child of question page
  //  document.getElementById('question-page').appendChild(tag);

   if (selectedAnswer === questionList[questionNumber].correctAnswer) {
     console.log('correct');
    //  tag.textContent = "Correct!"; // Adds text content to created tag
     answerStatus.innerText = "Correct";
     answerContainer.style.borderBottom = "3px solid grey";
   } else {
     console.log('not correct');
    //  tag.textContent = "Wrong!"; // Adds text content to created tag
     answerStatus.innerText = "Wrong!";
     answerContainer.style.borderBottom = "3px solid grey";
     //reduce score by 10 points
     //reduce remaining time by 10 seconds
   }

  let questionTimer = setTimeout(() => {
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
    }
  }, 3000);

}

function saveInitialsAndScore(event) {
  // event.preventDefault();
  console.log(playerInitials.value, saveButton.value, saveButton.innerText);
  localStorage.setItem(playerInitials.value, '22');
}