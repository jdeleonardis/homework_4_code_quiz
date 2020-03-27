var mainForm = document.getElementById("mainForm");
var startScreen = document.getElementById("startScreen");
var viewHighScoreEl = document.getElementById("viewHighScore")
var startBtnEl = document.getElementById("startBtn");
var timerEl = document.getElementById("timerP");
var timerDisplayEl = document.getElementById("timerDisplay");
var ulHolderEl = document.createElement("ul");
var currentScoreEl = document.getElementById("currentScore");
var currentResultEl = document.getElementById("questionFeedBack");

var countDownTimer = 30;
var questionIndex = 0;
var quizScore = 0;

//start button listener
startBtnEl.addEventListener("click", function(event) {
  event.preventDefault();
  startTheTimer();
});

//Countdown timer
function startTheTimer() {
    showQuestion(questionIndex);
    var timerInterval = setInterval(function() {
      countDownTimer--;
      timerDisplayEl.textContent =countDownTimer + " seconds left";    
      if(countDownTimer <= 0) {
        endGame()
        clearInterval(timerInterval);
      }   

    }, 1000);
}

//code to show the questions
function showQuestion(questionIndex){
  startScreen.textContent = "";
  ulHolderEl.textContent = "";

  //get the question and array of answers at the question index
  var userQuestion = question[questionIndex].questionTitle;
  var possibleAnswers = question[questionIndex].answerChoices;
  //add the question to the start screen div
  startScreen.textContent = userQuestion;

  //Add the possible answers to the screen for each question
  possibleAnswers.forEach(function (newListItem) {
    var showAnswers = document.createElement("li");
    showAnswers.innerHTML = ' <button id="answerBtn" class="btn btn-primary">' + newListItem + '</button>';
    startScreen.appendChild(ulHolderEl);
    ulHolderEl.appendChild(showAnswers);
    showAnswers.addEventListener("click", (answerChecker));
  })
}

function answerChecker(event){
  var choice = event.target;

  //event delegate - if user has clicked on a button, process answer
  if (choice.matches("button")) {

    //answer is correct.  bump the score up by one, return a correct message
    if (choice.textContent === question[questionIndex].correctAnswer){
      quizScore++;
      currentResultEl.textContent = "Correct!";
    }
    //answer is incorrect - deduct 10 seconds from teh timer, display incorrect message.
    else {
      countDownTimer = countDownTimer - 10;
      if (countDownTimer < 0) {
        countDownTimer = 0;
      }
      currentResultEl.textContent = "Incorrect!  10 seconds deducted!";
    }

    questionIndex++;
    currentScoreEl.textContent = quizScore;

    if (questionIndex == question.length){
      //call ending function here        
      endGame();
    }
    else
    {
      //or, if havent reached the end of questions, ask the next one
      showQuestion(questionIndex);      
    }
  }
}

function endGame(){
  startScreen.textContent = "";
  currentResultEl.textContent = "";
  timerEl.style.display = "none";

  //new h1
  var endGameH1El = document.createElement("h1");
  endGameH1El.setAttribute("id", "endGameH1El");
  endGameH1El.textContent = "Game over man!"
  startScreen.appendChild(endGameH1El);

  //p tag that shows your final score 
  var endGamePEl = document.createElement("p");
  endGamePEl.setAttribute("id", "endGameP");
  endGamePEl.textContent = "Your final score is: " + quizScore;
  startScreen.appendChild(endGamePEl);
  
  //label for the name input
  var newLabelEl = document.createElement("label");
  newLabelEl.setAttribute("id", "inputLabelEl");
  newLabelEl.setAttribute("for", "inputEl");
  newLabelEl.textContent = "Enter your name or initials: ";
  startScreen.appendChild(newLabelEl);

  //Input element to enter name
  var newInputEl = document.createElement("input");
  newInputEl.setAttribute("type", "text");
  newInputEl.setAttribute("id", "inputEl");
  newInputEl.textContent = "";
  startScreen.appendChild(newInputEl);

  //Submit button, which will record high scores.
  var newSubmitEl = document.createElement("button");
  newSubmitEl.setAttribute("id", "startBtn");
  newSubmitEl.setAttribute("class", "btn btn-primary");
  newSubmitEl.textContent = "Submit";
  startScreen.appendChild(newSubmitEl);
}
