// query
const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');

// constants
const NUM_QUESTION = 20;
const SWITCH_QUESTION = localStorage.getItem('switchQuestion')

// variables
var typeQuestion = "english";
var typeChoice = "danish";


class QuizGame {
  constructor(questions, maxQuestions) {
    this.questions = questions;
    this.maxQuestions = maxQuestions;
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
      return window.location.assign('game-end.html');
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
        });
    }

    if (isCorrect) {
        this.score ++;
        scoreText.innerText = Math.round((this.score / this.maxQuestions) * 100);
    }

    return isCorrect ? 'correct' : 'incorrect';
  }
}


const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// Generate Quiz
const generateQuiz = (data, numQuestions, switchQuestion) => {

  if (switchQuestion === "switchEnglish") {
    typeQuestion = "english";
    typeChoice = "danish";
  } 
  if (switchQuestion === "switchDanish") {
    typeQuestion = "danish";
    typeChoice = "english";
  }

  if (data.length < numQuestions) {
    throw new Error('Not enough data to generate the quiz');
  }

  const shuffledQuestions = shuffleArray(data).slice(0, numQuestions);
  return shuffledQuestions.map((questionData) => {
    const correctAnswerIndex = getRandomInt(1, 4); // Randomly assign correct answer to 1-4
    const choices = Array(4).fill(null);
    choices[correctAnswerIndex - 1] = questionData[typeChoice];

    const usedChoices = new Set([questionData[typeChoice]]);
    for (let i = 0; i < 4; i++) {
      if (choices[i] === null) {
        let randomChoice;
        do {
          randomChoice = data[getRandomInt(0, data.length - 1)][typeChoice];
        } while (usedChoices.has(randomChoice));
        choices[i] = randomChoice;
        usedChoices.add(randomChoice);
      }
    }

    return {
      question: questionData[typeQuestion],
      choice1: choices[0],
      choice2: choices[1],
      choice3: choices[2],
      choice4: choices[3],
      answer: correctAnswerIndex,
    };
  });
};

// Load JSON 
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


loadJson('docs/da-en.json').then((data) => {
  const questionList = generateQuiz(data, NUM_QUESTION, SWITCH_QUESTION);
  const quizGame = new QuizGame(questionList, NUM_QUESTION);

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