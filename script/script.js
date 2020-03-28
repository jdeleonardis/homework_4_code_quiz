var mainForm = document.getElementById("mainForm");
var screenContainerEl = document.getElementById("screenContainer");
var viewHighScoreEl = document.getElementById("highScoreLink");
var highScoreScreenEl = document.getElementById("highScoreScreen");
var highScoreListEl = document.getElementById("highScoreList");
var startBtnEl = document.getElementById("startBtn");
var returnGameBtnEl = document.getElementById("returnGameBtn");
var clearHighScoresBtnEl = document.getElementById("clearHighScoresBtn");
var timerEl = document.getElementById("timerP");
var timerDisplayEl = document.getElementById("timerDisplay");
var olHolderEl = document.createElement("ol");
var olHighScoreHolderEl = document.createElement("ol");
var currentScoreEl = document.getElementById("currentScore");
var resultEl = document.getElementById("results");
var currentResultEl = document.getElementById("questionFeedBack");
var countDownTimer = 60;
var questionIndex = 0;
var quizScore = 0;

viewHighScoreEl.addEventListener("click",viewHighScores);
startBtnEl.addEventListener("click", startTheTimer);    
olHolderEl.addEventListener("click", answerChecker);
clearHighScoresBtnEl.addEventListener("click",clearHighScores); 

//Countdown timer
function startTheTimer(event) {
  event.preventDefault();
    showQuestion(questionIndex);
    var timerInterval = setInterval(function() {
      countDownTimer--;
      timerDisplayEl.textContent =countDownTimer + " seconds left";    
      if(countDownTimer <= 0) {
        finishGame()
        clearInterval(timerInterval);
      }   
    }, 1000);
}

//View high scores.  Hide the main quiz screen and show the high score 
//screen and scores.
function viewHighScores(event){
  event.preventDefault();
  if (highScoreScreenEl.classList.contains("hide")){
    screenContainerEl.setAttribute("class","hide");
    resultEl.setAttribute("class","results hide");
    highScoreScreenEl.setAttribute("class","show");
    viewHighScoreEl.textContent = "Back to quiz";

    olHighScoreHolderEl.textContent = "";
    var highScores = JSON.parse(window.localStorage.getItem('scores'));    
    highScores.sort(function(a, b){return b.score - a.score});
    for (i = 0; i < highScores.length; i++) {
      var highScoreRow = document.createElement("li");
      highScoreRow.setAttribute("class","highScoreListItem");
      highScoreRow.textContent = highScores[i].score + " - " + highScores[i].name;
      highScoreListEl.appendChild(olHighScoreHolderEl);
      olHighScoreHolderEl.appendChild(highScoreRow);
    }
  }
  else {
    resultEl.setAttribute("class","results show");
    screenContainerEl.setAttribute("class","show");
    highScoreScreenEl.setAttribute("class","hide");
    viewHighScoreEl.textContent = "View High Scores";
  }
}

//save the high scores
function saveHighScores(event){
  event.preventDefault();
    
  var inputEl = document.getElementById("inputEl");
  var playerName = inputEl.value.trim();

  if (playerName === "") {
    return;
  }
  var currentPlayerScore = {
    name: playerName,
    score: quizScore
  };

  var scores = JSON.parse(window.localStorage.getItem('scores'));
  if (scores === null) {
    scores = [];
  } 
  scores.push(currentPlayerScore);
  localStorage.setItem("scores", JSON.stringify(scores));
  viewHighScores(event);
}

//clear the high scores
function clearHighScores(event) {
  event.preventDefault();
  localStorage.removeItem('scores')
  olHighScoreHolderEl.textContent = "";
}

//code to show the questions
function showQuestion(questionIndex){
  screenContainerEl.textContent = "";
  olHolderEl.textContent = "";
  var answerCounter = 0;

  //get the question and array of answers at the question index
  var userQuestion = question[questionIndex].questionTitle;
  var possibleAnswers = question[questionIndex].answerChoices;
  //add the question to the start screen div
  screenContainerEl.textContent = userQuestion;

  //Add the possible answers to the screen for each question
  possibleAnswers.forEach(function (newListItem) {
    var answerRow = document.createElement("li");
    answerRow.setAttribute("data-index", answerCounter)
    answerCounter++;
    answerRow.innerHTML = ' <button id="answerBtn" class="btn btn-primary">' + newListItem + '</button>';
    screenContainerEl.appendChild(olHolderEl);
    olHolderEl.appendChild(answerRow);
  })
}

//code that checks answers and processes
function answerChecker(event){
  var choice = event.target;

  //event delegate - if user has clicked on a button, process answer
  if (choice.matches("button")) {

    //answer is correct.  bump the score up by one, return a correct message
    if (choice.parentElement.getAttribute("data-index") == question[questionIndex].correctAnswer){
      quizScore++;
      currentResultEl.textContent = "Correct!";
      currentResultEl.setAttribute("class", "correct");
    }
    //answer is incorrect - deduct 10 seconds from teh timer, display incorrect message.
    else {
      countDownTimer = countDownTimer - 10;
      if (countDownTimer < 0) {
        countDownTimer = 0;
      }
      currentResultEl.textContent = "Incorrect!  10 seconds deducted!";
      currentResultEl.setAttribute("class", "incorrect");
    }

    questionIndex++;
    currentScoreEl.textContent = quizScore;

    if (questionIndex == question.length){
      //call ending function here        
      finishGame();
    }
    else
    {
      //or, if havent reached the end of questions, ask the next one
      showQuestion(questionIndex);      
    }
  }
}

//finish the game
function finishGame(){
  screenContainerEl.textContent = "";
  currentResultEl.textContent = "";
  timerEl.style.display = "none";

  //new h1
  var endGameH1El = document.createElement("h1");
  endGameH1El.setAttribute("id", "endGameH1El");
  endGameH1El.textContent = "Game over man!"
  screenContainerEl.appendChild(endGameH1El);

  //p tag that shows your final score 
  var endGamePEl = document.createElement("p");
  endGamePEl.setAttribute("id", "endGameP");
  endGamePEl.textContent = "Your final score is: " + quizScore;
  screenContainerEl.appendChild(endGamePEl);
  
  //label for the name input
  var newLabelEl = document.createElement("label");
  newLabelEl.setAttribute("id", "inputLabelEl");
  newLabelEl.setAttribute("for", "inputEl");
  newLabelEl.textContent = "Enter your name or initials: ";
  screenContainerEl.appendChild(newLabelEl);

  //Input element to enter name
  var nameInputEl = document.createElement("input");
  nameInputEl.setAttribute("type", "text");
  nameInputEl.setAttribute("id", "inputEl");
  nameInputEl.textContent = "";
  screenContainerEl.appendChild(nameInputEl);

  //Submit button, which will record high scores.
  var highScoreSaveBtnEl = document.createElement("button");
  highScoreSaveBtnEl.setAttribute("id", "startBtn");
  highScoreSaveBtnEl.setAttribute("class", "btn btn-primary");
  highScoreSaveBtnEl.textContent = "Save";
  var returnToQuizBtnEl = document.createElement("button");
  returnToQuizBtnEl.setAttribute("id", "returnToQuizBtn");
  returnToQuizBtnEl.setAttribute("class", "btn btn-primary");
  returnToQuizBtnEl.textContent = "Return to Quiz";
  
  highScoreSaveBtnEl.addEventListener("click",saveHighScores);
  screenContainerEl.appendChild(highScoreSaveBtnEl);
  screenContainerEl.appendChild(returnToQuizBtnEl);
}