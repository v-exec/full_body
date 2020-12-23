//containers
var intro = document.getElementById('intro');
var preparation = document.getElementById('preparation');
var exercise = document.getElementById('exercise');
var results = document.getElementById('results');
var tracker = document.getElementById('tracker');
var progressBar = document.getElementById('progressBar');
var resultInfo = document.getElementById('resultInfo');

//elements
var introTitle = document.getElementById('introTitle');
var preparationTitle = document.getElementById('preparationTitle');
var preparationNote = document.getElementById('preparationNote');
var movementName = document.getElementById('movementName');
var movementDetails = document.getElementById('movementDetails');
var timedExerciseTimer = document.getElementById('timedExerciseTimer');
var movementNotes = document.getElementById('movementNotes');
var movementClock = document.getElementById('movementClock');
var totalClock = document.getElementById('totalClock');
var pauseTimer = document.getElementById('pauseTimer');
var nextMovement = document.getElementById('nextMovement');
var progressNumbers = document.getElementById('progressNumbers');
var progressFraction = document.getElementById('progressFraction');
var progressPercentage = document.getElementById('progressPercentage');
var progressFill = document.getElementById('progressFill');
var resultText = document.getElementById('resultText');
var resultFinal = document.getElementById('resultFinal');

var drop = document.getElementById('drop');
var dropFeedback = document.getElementById('dropFeedback');

var shortTone = document.getElementById('shortTone');
var longTone = document.getElementById('longTone');

//flags
var animating = false;
var paused = false;

//data

//yes I know this is a lazy-ass database but I already have this info in a personal spreadsheet so whateveeeeeer
var supportedMovements = [];

supportedMovements.push(new SupportedMovement("Dynamic Stretches", "Stretch", null, null, null, "No"));
supportedMovements.push(new SupportedMovement("Static Stretches", "Stretch", null, null, null, "No"));

supportedMovements.push(new SupportedMovement("Row", "Pull", "Latissimus", "Trapezius", "Lower Back", "Yes"));
supportedMovements.push(new SupportedMovement("Dead Hang", "Static", "Forearms", "Latissimus", "Arms", "Yes"));
supportedMovements.push(new SupportedMovement("Pullup", "Pull", "Trapezius", "Latissimus", "Upper Back", "Yes"));
supportedMovements.push(new SupportedMovement("Chinup", "Pull", "Biceps", "Latissimus", "Arms", "Yes"));
supportedMovements.push(new SupportedMovement("Narrow Grip Pullup", "Pull", "Pectorals", "Trapezius", "Chest", "Yes"));
supportedMovements.push(new SupportedMovement("Wide Grip Pullup", "Pull", "Latissimus", "Pectorals", "Lower Back", "Yes"));
supportedMovements.push(new SupportedMovement("Leg Raise", "Pull", "Abdominals", "Forearms", "Core", "Yes"));
supportedMovements.push(new SupportedMovement("L-Hang", "Static", "Abdominals", "Forearms", "Core", "Yes"));
supportedMovements.push(new SupportedMovement("Around The World", "Pull", "Abdominals", "Obliques", "Core", "Yes"));
supportedMovements.push(new SupportedMovement("Pushup", "Push", "Triceps", "Deltoids", "Arms", "No"));
supportedMovements.push(new SupportedMovement("Wide Pushup", "Push", "Pectorals", "Deltoids", "Chest", "No"));
supportedMovements.push(new SupportedMovement("Diamond Pushup", "Push", "Triceps", "Deltoids", "Arms", "No"));
supportedMovements.push(new SupportedMovement("Military Pushup", "Push", "Deltoids", "Trapezius", "Arms", "No"));
supportedMovements.push(new SupportedMovement("Curl", "Pull", "Biceps", "Forearms", "Arms", "Yes"));
supportedMovements.push(new SupportedMovement("L-Sit", "Static", "Abdominals", "Obliques", "Core", "No"));
supportedMovements.push(new SupportedMovement("Boat Hold", "Static", "Abdominals", "Obliques", "Core", "No"));
supportedMovements.push(new SupportedMovement("Boat Twirl", "Pull", "Abdominals", "Obliques", "Core", "No"));
supportedMovements.push(new SupportedMovement("Side Plank", "Static", "Obliques", "Abdominals", "Core", "No"));
supportedMovements.push(new SupportedMovement("Plank", "Static", "Abdominals", "Deltoids", "Core", "No"));
supportedMovements.push(new SupportedMovement("Pike", "Push", "Trapezius", "Triceps", "Upper Back", "No"));
supportedMovements.push(new SupportedMovement("Handstand", "Static", "Trapezius", "Deltoids", "Upper Back", "No"));
supportedMovements.push(new SupportedMovement("Handstand Pushup", "Push", "Triceps", "Trapezius", "Arms", "No"));
supportedMovements.push(new SupportedMovement("Dip", "Push", "Triceps", "Deltoids", "Arms", "No"));
supportedMovements.push(new SupportedMovement("Hip Raise", "Lunge", "Hamstrings", "Glutes", "Legs", "No"));
supportedMovements.push(new SupportedMovement("Single Leg Hip Raise", "Lunge", "Hamstrings", "Glutes", "Legs", "No"));
supportedMovements.push(new SupportedMovement("Lunge", "Lunge", "Hamstrings", "Glutes", "Legs", "No"));
supportedMovements.push(new SupportedMovement("Squat", "Squat", "Quadriceps", "Hamstrings", "Legs", "No"));
supportedMovements.push(new SupportedMovement("Pistol Squat", "Squat", "Quadriceps", "Hamstrings", "Legs", "No"));
supportedMovements.push(new SupportedMovement("Jump Squat", "Squat", "Quadriceps", "Hamstrings", "Legs", "No"));
supportedMovements.push(new SupportedMovement("Superman", "Static", "Latissimus", "Glutes", "Lower DBack", "No"));
supportedMovements.push(new SupportedMovement("Calf Raise", "Squat", "Calves", "Quadriceps", "Legs", "No"));
supportedMovements.push(new SupportedMovement("Jump", "Squat", "Calves", "Quadriceps", "Legs", "No"));

var muscleGroups = [
"Trapezius",
"Deltoids",
"Latissimus",
"Pectorals",
"Biceps",
"Triceps",
"Forearms",
"Abdominals",
"Obliques",
"Glutes",
"Quadriceps",
"Hamstrings",
"Calves"
];

var targetAreas = [
"Legs",
"Arms",
"Upper Back",
"Lower Back",
"Core"
];

var muscleGroupsCheck = [];

for (var i = 0; i < muscleGroups.length; i++) {
	muscleGroupsCheck.push(false);
}

//settings
var circuit = false;

//holds user movements
var movementStrings = [];
var movements = [];
var currentMovement = 0;
var movementIndexes = [];

var totalSeconds = 0;
var seconds = 0;

var timeInterval;

//flavor text
var possibleIntros = [
"Welcome to full_body!",
"Time to work out!",
"It's a great day to get sweaty.",
"Ready for a workout?",
"Get your pump on.",
"Let's get sweaty!",
"Get pumped!",
"Initiating workout_process.",
"Fitness time!",
"20% muscle increase!",
"No pain, no gain."
];

var possibleLoaders = [
"Get ready for some burn!",
"Ready to go?",
"Get ready!",
"Prepare for pain!",
"Ready?",
"Prepare yourself!",
"Let's do this!"
];

var possibleGroupWarnings = [
"Seems like you're missing these muscle groups: ",
"It's possible your sequence is missing exercises in these muscle groups: ",
"There's a chance you're not targeting these muslce groups: ",
"None of your exercises seem to target these muscles: "
];

var possibleDynamicStretch = [
"Dynamic stretches are active forms of stretching, where you move in a full ranges of motion back and forth.",
"Dynamic stretches help warm up muscles without relaxing them too much.",
"Dynamic stretches are done quickly, with litte time spent in a particular stretch. About 5 seconds is enough.",
"Dynamic stretches are useful at the start of a workout.",
"Dynamic stretches help keep your muscles strong and warmed up, without being so relaxed as to diminish your performance"
];

var possibleStaticStretch = [
"Static stretches need to be held at least 30 seconds, and usually about 60 seconds at the most.",
"Static stretches help relax muscles. Relaxed muscles are weaker, which is why we do static stretches at the end.",
"Static stretches are useful before going to bed, or after waking up. But your body will naturally be tighter when you wake up!"
];

var possiblePush = [
"This is a push motion, which involves flexing the muscles towards the back of your body to open up the back of your body, and push the front outwards.",
"This exercise is a push motion.",
"This movement is based on pushing.",
"This is a push-based movement."
];

var possiblePull = [
"This is a pull-based movement.",
"This movement is based on pulling, where muscles towards the front of your body are flexing to pull parts of your body inwards.",
"This exercise is a pull motion.",
"This is a pull motion."
];

var possibleSquat = [
"This is a squat-based motion, where your lower body contracts and then opens up in an explosive action.",
"This movement is based on squatting.",
"This is a squat motion.",
"This exercise is a squatting motion."
];

var possibleLunge = [
"This is a lunge motion, where you will be put in an unbalanced position accentuating stress on one side of your lower body.",
"This is a lunge-based exercise.",
"This movement is a lunge motion.",
"This exercise is based on lunges."
];

var possibleStatic = [
"This is a static exercise, where you must hold a pose for a certain period of time.",
"This exercise is static, meaning you should stay as still as possible.",
"This is a static-based exercise, where you need to stay still for a certain period of time."
];

var possibleTarget = [
"This exercise targets the",
"This movement primarily targets the",
"This movement focuses on the",
"This exercise especially targets the",
"This is an exercise which accentuates stress on the",
"This movement mainly stresses the"
];

var possiblePrimaryGroups = [
"with the main muscle group being the",
"with the primary muscle involved in this motion being the",
"with the muscles doing the most work being the",
"where most of the work is being done by the"
];

var possibleSecondaryGroups = [
"A more minor effort is being spent by your",
"A smaller group of muscles involved is this movement are the",
"A secondary group of muscles aids this motion, mainly the",
"A few muscles take an additional role in this movement, notably the"
];

var possibleResultTitles = [
"Congratulations!",
"Great job.",
"Time for a shower!",
"Remember to hydrate!",
"Feels good to be fit.",
"One step closer!",
"Awesome work!"
];

var possibleResultStarts = [
"Fantastic!",
"Another workout finished!",
"Well done!",
"You did great!"
];

var possibleResultFinals = [
"See you next time.",
"Looking forward to the next one.",
"Already excited for the next.",
];