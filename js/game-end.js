// display score
let saveScore = localStorage.getItem('saveScore') || 0;
const finalScore = document.querySelector('#finalScore');
finalScore.innerText = saveScore;

// display text
const displayText = document.querySelector('#displayText');


// display wrong answers
let storedAnswers = localStorage.getItem("wrongAnswers");
let wrongAnswers = storedAnswers ? JSON.parse(storedAnswers) : [];

let table = document.querySelector("#wrongAnswersTable");
let tableBody = table.querySelector("tbody");

if (wrongAnswers.length === 0) {
  table.style.display = "none";
} else {
  displayText.innerText = "Wrong answers"
  wrongAnswers.forEach(answer => {
      let row = document.createElement("tr");
      
      let questionCell = document.createElement("td");
      questionCell.textContent = answer.question;

      let correctAnswerCell = document.createElement("td");
      correctAnswerCell.textContent = answer.correctAnswer;

      row.appendChild(questionCell);
      row.appendChild(correctAnswerCell);

      tableBody.appendChild(row);
  });
}