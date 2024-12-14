// query
const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');

// constants
const SCORE_POINT = 1;
const MAX_QUESTION = 10;


class QuizGame {
  constructor(questions, maxQuestions, scorePoint) {
    this.questions = questions;
    this.maxQuestions = maxQuestions;
    this.scorePoint = scorePoint;
    this.questionCounter = 0;
    this.score = 0;
    this.currentQuestion = null;
    this.acceptingAnswer = false;
    this.wrongAnswers = []; 
  }

  startGame() {
    this.questionCounter = 0;
    this.score = 0;
    this.wrongAnswers = []; 
    this.getNewQuestion();
  }

  getNewQuestion() {
    if (this.questionCounter >= this.maxQuestions) {
      localStorage.setItem('saveScore', (this.score / this.maxQuestions) * 100);
      localStorage.setItem('wrongAnswers', JSON.stringify(this.wrongAnswers));
      return window.location.assign('end.html');
    }

    this.currentQuestion = this.questions[this.questionCounter];
    this.questionCounter++;
    this.renderQuestion();
  }

  renderQuestion() {
    progressText.innerText = `${this.questionCounter}/${this.maxQuestions}`;

    question.innerText = this.currentQuestion.question;
    choices.forEach((choice) => {
      const number = choice.dataset['number'];
      choice.innerText = this.currentQuestion[`choice${number}`];
    });

    this.acceptingAnswer = true;
  }

  handleAnswer(selectedAnswer) {
    if (!this.acceptingAnswer) return;

    this.acceptingAnswer = false;
    const isCorrect = selectedAnswer === this.currentQuestion.answer;

    if (!isCorrect) {
        // Store wrong answers
        this.wrongAnswers.push({
            question: this.currentQuestion.question,
            correctAnswer: this.currentQuestion[`choice${this.currentQuestion.answer}`],
            selectedAnswer: this.currentQuestion[`choice${selectedAnswer}`],
        });
    }

    if (isCorrect) {
        this.incrementScore(this.scorePoint);
    }

    return isCorrect ? 'correct' : 'incorrect';
  }

  incrementScore(points) {
    this.score += points;
    scoreText.innerText = ((this.score / this.maxQuestions) * 100);
  }
}


const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// Generate Quiz
const generateQuiz = (data, numQuestions) => {
  if (data.length < numQuestions) {
    throw new Error('Not enough data to generate the quiz');
  }

  const shuffledQuestions = shuffleArray(data).slice(0, numQuestions);
  return shuffledQuestions.map((questionData) => {
    const correctAnswerIndex = getRandomInt(1, 4); // Randomly assign correct answer to 1-4
    const choices = Array(4).fill(null);
    choices[correctAnswerIndex - 1] = questionData['chinese'];

    const usedChoices = new Set([questionData['chinese']]);
    for (let i = 0; i < 4; i++) {
      if (choices[i] === null) {
        let randomChoice;
        do {
          randomChoice = data[getRandomInt(0, data.length - 1)]['chinese'];
        } while (usedChoices.has(randomChoice));
        choices[i] = randomChoice;
        usedChoices.add(randomChoice);
      }
    }

    return {
      question: questionData['english'],
      choice1: choices[0],
      choice2: choices[1],
      choice3: choices[2],
      choice4: choices[3],
      answer: correctAnswerIndex,
    };
  });
};

// Load JSON and Start Game
const loadJson = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching or parsing JSON:', error);
  }
};

loadJson('docs/toefl.json').then((data) => {
  const questionList = generateQuiz(data, MAX_QUESTION);
  const quizGame = new QuizGame(questionList, MAX_QUESTION, SCORE_POINT);

  choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
      const selectedChoice = e.target;
      const selectedAnswer = parseInt(selectedChoice.dataset['number']);
      const classToApply = quizGame.handleAnswer(selectedAnswer);

      selectedChoice.parentElement.classList.add(classToApply);
      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        quizGame.getNewQuestion();
      }, 600);
    });
  });

  quizGame.startGame();
});