//containers
var intro = document.getElementById('intro');
var exercise = document.getElementById('exercise');
var results = document.getElementById('results');
var tracker = document.getElementById('tracker');
var progressBar = document.getElementById('progressBar');
var resultInfo = document.getElementById('resultInfo');

//elements
var introTitle = document.getElementById('introTitle');
var exerciseList = document.getElementById('exerciseList');
var optionsPlan = document.getElementById('optionsPlan');
var start = document.getElementById('start');
var movementName = document.getElementById('movementName');
var movementDetails = document.getElementById('movementDetails');
var timedExerciseTimer = document.getElementById('timedExerciseTimer');
var movementNotes = document.getElementById('movementNotes');
var movementClock = document.getElementById('movementClock');
var pausedClock = document.getElementById('pausedClock');
var totalClock = document.getElementById('totalClock');
var pauseTimer = document.getElementById('pauseTimer');
var nextMovement = document.getElementById('nextMovement');
var progressNumbers = document.getElementById('progressNumbers');
var progressFraction = document.getElementById('progressFraction');
var progressPercentage = document.getElementById('progressPercentage');
var progressFill = document.getElementById('progressFill');
var resultText = document.getElementById('resultText');
var resultFinal = document.getElementById('resultFinal');

var shortTone = document.getElementById('shortTone');
var longTone = document.getElementById('longTone');

//flags
var animating = false;
var paused = false;
var finished = false;

//load data and start program
var fulldata;

fetch('https://exp.v-os.ca/full_body/assets/data.json')
.then(response => response.json())
.then(data => {
	fulldata = data;
	appStart();
});

//settings
var circuit = false;
var breakFrequency = 0;
var breakDuration = 0;
var stretches = false;
var infoType = 0;
var muscleGroupsWarning = false;

//holds active workout data
var movements = [];
var currentMovement = 0;

//timers
var activeSeconds = 0;
var pausedSeconds = 0;
var timeInterval;

//persistent flavor text data
var warningFlavorIndex = 0;