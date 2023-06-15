//modules & containers
const intro = document.getElementById('intro');
const exercise = document.getElementById('exercise');
const results = document.getElementById('results');
const tracker = document.getElementById('tracker');
const resultInfo = document.getElementById('resultInfo');
const exerciseList = document.getElementById('exerciseList');
const infoBox = document.getElementById('infoBox');
const introButtons = document.getElementById('introButtons');

//buttons, checkboxes, & inputs
const info = document.getElementById('info');
const exerciseStart= document.getElementById('exerciseStart');
const optionsPlan = document.getElementById('optionsPlan');
const start = document.getElementById('start');

const pauseTimer = document.getElementById('pauseTimer');
const nextMovement = document.getElementById('nextMovement');

const circuitSetting = document.getElementById('circuitSetting');
const stretchesSetting = document.getElementById('stretchesSetting');
const muscleGroupsWarningSetting = document.getElementById('muscleGroupsWarningSetting');
const breakFrequencySetting = document.getElementById('breakFrequencySetting');
const breakDurationSetting = document.getElementById('breakDurationSetting');
const hardModeSetting = document.getElementById('hardModeSetting');
const hardModeTimeSetting = document.getElementById('hardModeTimeSetting');

//text fields
const introTitle = document.getElementById('introTitle');
const introDescription = document.getElementById('introDescription');

const movementName = document.getElementById('movementName');
const movementDetails = document.getElementById('movementDetails');
const movementNotes = document.getElementById('movementNotes');
const movementNotesMobile = document.getElementById('movementNotesMobile');

const movementClock = document.getElementById('movementClock');
const pausedClock = document.getElementById('pausedClock');
const totalClock = document.getElementById('totalClock');

const resultTitle = document.getElementById('resultTitle');
const resultDescription = document.getElementById('resultDescription');

const progressFraction = document.getElementById('progressFraction');
const progressPercentage = document.getElementById('progressPercentage');

const breakFrequencyText = document.getElementById('breakFrequencyText');
const breakDurationText = document.getElementById('breakDurationText');
const hardModeTimeText = document.getElementById('hardModeTimeText');

//graphics
const progressBar = document.getElementById('progressBar');
const progressNumbers = document.getElementById('progressNumbers');
const progressFill = document.getElementById('progressFill');

//audio
const shortTone = document.getElementById('shortTone');
const longTone = document.getElementById('longTone');

//constants
const standardTransitionTime = 1000;
const courtesyTime = 10;

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
var stretches = false;
var muscleGroupsWarning = false;
var breakFrequency = 0;
var breakDuration = 0;
var hardMode = false;
var hardModeTime = 0;

//active workout data
var movements = [];
var currentMovement = 0;

//timers
var activeSeconds = 0;
var pausedSeconds = 0;
var timeInterval;

//ui state data
var warningFlavorIndex = 0;
var optionsOpen = false;
var infoOpen = false;