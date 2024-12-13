const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');

let currentQuestion = {}
let acceptingAnswer = true
let score = 0
let questionCounter = 0
let availableQuestion = []


const SCORE_POINT = 1
const MAX_QUESTION = 10


function loadJson(callback) {
    fetch('docs/toefl.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        callback(data); // Pass the data to the callback
      })
      .catch(error => {
        console.error('Error fetching or parsing JSON:', error);
      });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuiz(data, numQuestions) {
    if (data.length < numQuestions) {
        throw new Error("Not enough data to generate the quiz");
    }

    const quiz = [];
    const usedIndices = new Set();

    while (quiz.length < numQuestions) {
        // Randomly select a unique question
        let index;
        do {
            index = getRandomInt(0, data.length - 1);
        } while (usedIndices.has(index));
        usedIndices.add(index);

        const questionData = data[index];
        const correctAnswerIndex = getRandomInt(1, 4); // Randomly select the correct answer index (1-4)

        // Prepare choices
        const choices = new Array(4).fill(null);
        choices[correctAnswerIndex - 1] = questionData["chinese"]; // Assign correct answer

        // Fill other choices with random Chinese values, avoiding duplicates
        const usedChoices = new Set([questionData["chinese"]]);
        for (let i = 0; i < 4; i++) {
        if (choices[i] === null) {
            let randomChoice;
            do {
                randomChoice = data[getRandomInt(0, data.length - 1)]["chinese"];
                } while (usedChoices.has(randomChoice));
                choices[i] = randomChoice;
                usedChoices.add(randomChoice);
            }
        }

        // Construct the question object
        quiz.push({
            question: questionData["english"],
            choice1: choices[0],
            choice2: choices[1],
            choice3: choices[2],
            choice4: choices[3],
            answer: correctAnswerIndex,
        });
    }

    return quiz;
}

// TODO: no need to choose random questions again
getNewQuestion = () => {

    if (availableQuestion.length === 0 || questionCounter >= MAX_QUESTION) {
        localStorage.setItem('saveScore', 100*(score/MAX_QUESTION))
        return window.location.assign('end.html')
    }

    questionCounter++
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTION}`

    const questionIndex = Math.floor(Math.random() * availableQuestion.length)
    currentQuestion = availableQuestion[questionIndex]
    question.innerText = currentQuestion.question
    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
    })

    availableQuestion.splice(questionIndex, 1)
    acceptingAnswer = true
}



choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswer) return

        acceptingAnswer = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if(classToApply === 'correct') {
            incrementScore(SCORE_POINT)
        }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()

        }, 600)
    })
})

incrementScore = num => {
    score += num
    scoreText.innerText = 100*(score/MAX_QUESTION)
}


loadJson((data) => {
    const questionList = generateQuiz(data, 10);
    startGame = () => {
        questionCounter = 0
        score = 0
        availableQuestion = [...questionList]
        getNewQuestion()
    }
    startGame()
});