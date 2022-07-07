//section:query selector variables go here 👇
let answerContainer = document.getElementById('answer-container');
console.log(answerContainer)

//section:global variables go here 👇

//section:event listeners go here 👇
answerContainer.addEventListener('click', targetElement);

//section:functions and event handlers go here 👇
function targetElement(event) {
  console.log(event.target.innerText);
}