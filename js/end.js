document.addEventListener('DOMContentLoaded', () => {
    const wrongAnswersContainer = document.querySelector('#wrongAnswer');
    const wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers')) || [];
    const saveScore = localStorage.getItem('saveScore') || 0;
  
    // Display the score
    const finalScore = document.querySelector('#finalScore');
    finalScore.innerText = saveScore;
  
    // Display wrong answers
    if (wrongAnswers.length === 0) {
        wrongAnswersContainer.innerText = "Your dog loves you.";
      return;
    }
  
    wrongAnswers.forEach((item, index) => {
      const answerBlock = document.createElement('div');
      answerBlock.classList.add('wrong-answer');
      answerBlock.innerHTML = `<p>${item.question}: ${item.correctAnswer}</p>`;
      wrongAnswersContainer.appendChild(answerBlock);
    });
  });
