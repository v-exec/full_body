//functionality for next exercise button
nextMovement.addEventListener('click', function() {
	if (!animating) loadNextMovement();
}, false);

//functionality for pause button
pauseTimer.addEventListener('click', function() {
	paused = !paused;
	if (paused) {
		pauseTimer.innerText = "Resume Timer";
		pauseTimer.style.backgroundColor = "var(--prettyBright)";
	}
	else {
		pauseTimer.innerText = "Pause Timer";
		pauseTimer.removeAttribute("style");
	}
}, false);

//master timer
setInterval(function() {
	if (!paused) totalSeconds += 1;
}, 1000);

generateTitle();

function generateTitle() {
	var i = getRandomIntInclusive(0, possibleIntros.length - 1);
	introTitle.innerText = possibleIntros[i];
}

function sequenceMovements() {
	//if circuit, deconstruct movements into multiple sets
	var newMovements = [];

	if (circuit) {		
		for (var i = 0; i < movements.length; i++) {
			for (var j = 0; j < movements[i].sets; j++) {
				newMovements.push(movements[i]);
			}
		}

		for (var i = 0; i < newMovements.length; i++) {
			newMovements[i].sets = 1;
		}
	} else newMovements = movements;

	//shuffle for randomness
	shuffle(newMovements);

	//add stretches
	var firstStretch = new Movement("Dynamic Stretches");
	firstStretch.populateMovement(firstStretch);
	var lastStretch = new Movement("Static Stretches");
	lastStretch.populateMovement(lastStretch);
	newMovements.unshift(firstStretch);
	newMovements.push(lastStretch);

	movements = newMovements;

	//check if missing major muscle group
	for (var i = 0; i < movements.length; i++) {
		for (var j = 0; j < muscleGroups.length; j++) {
			if (movements[i].primary[0] == muscleGroups[j]) muscleGroupsCheck[j] = true;
			if (movements[i].secondary[0] == muscleGroups[j]) muscleGroupsCheck[j] = true;
		}
	}

	//get indexes of exercises for each movement
	for (var i = 0; i < movements.length; i++) {
		movementIndexes.push(pickMovementIndex(movements[i]));
	}

	loadMovements();
}

function loadMovements() {
	toggleAppearance(intro, false, 1000, true);

	//check for errors
	var error = false;
	var errorExercise;
	for (var i = 0; i < movements.length; i++) {
		for (var j = 0; j < movements[i].reference.length; j++) {
			if (movements[i].reference[j] == null) {
				error = true;
				errorExercise = movements[i].name[j];
			}
		}
	}

	//display error and stop app
	if (error) {
		preparationTitle.innerText = "There seems to be a problem.";
		preparationNote.innerHTML = "We believe there's an issue with your sequence file. In particular, with the exercise: <b>" + errorExercise + "</b>.<br>Please correct this mistake and try again.";
		toggleAppearance(preparation, true, 1000, true);
		setTimeout(function(){
			toggleAppearance(preparationNote, true, 500);
		}, 2000);
		return;
	}

	preparationTitle.innerText = possibleLoaders[getRandomIntInclusive(0, possibleLoaders.length - 1)];
	var missingGroups = [];
	for (var i = 0; i < muscleGroupsCheck.length; i++) {
		if (!muscleGroupsCheck[i]) missingGroups.push(muscleGroups[i]);
	}

	if (missingGroups.length > 0) {
		var warningNote = possibleGroupWarnings[getRandomIntInclusive(0, possibleGroupWarnings.length - 1)];
		for (var i = 0; i < missingGroups.length; i++) {
			if (i + 1 == missingGroups.length) warningNote += missingGroups[i] + ".";
			else warningNote += missingGroups[i] + ", ";
		}
		preparationNote.innerText = warningNote;
	}

	toggleAppearance(preparation, true, 1000, true);

	setTimeout(function(){
		toggleAppearance(preparationNote, true, 500);
	}, 2000);

	setTimeout(function(){
		toggleAppearance(preparation, false, 1000, true);
		loadNextMovement();

		//start clock
		var startSeconds = totalSeconds;
		setInterval(function() {
			seconds = totalSeconds - startSeconds;
			var str = formatTime(seconds, true);
			totalClock.innerText = str;
		}, 100);
	}, 5000);
}

function loadNextMovement() {
	//don't unload screen on first load
	if (currentMovement != 0) {
		toggleAppearance(exercise, false, 1000);
	} else {
		setTimeout(function() {
			toggleAppearance(tracker, true, 1000, true);
		}, 2000);
	}

	setTimeout(function() {
		//results screen
		if (currentMovement == movements.length) {
			currentMovement++;
			updateTracker();
			loadResults();
			return;
		}

		//unload content (on everything but the first load)
		if (currentMovement != 0) {
			movementName.innerText = '';
			movementDetails.innerText = '';
			movementNotes.innerText = '';
			clearInterval(timeInterval);
		}

		//populate exercise screen
		var move = movements[currentMovement];

		movementName.innerText = move.name[movementIndexes[currentMovement]];
		//dynamically size text so it's not too big if it's too long
		movementName.style.fontSize = 200 - (move.name[movementIndexes[currentMovement]].length * 3) + "px";

		//format movement details
		//ignore details if stretch
		if (move.type[movementIndexes[currentMovement]] != "Stretch") {
			var details = "";
			var reps = move.reps[movementIndexes[currentMovement]];
			var sets = move.sets;
			if (reps != null) reps = reps.trim();

			if (sets > 1) details = sets + " sets of "; 

			//take into account singulars and plurals
			if (reps == null && sets == 1) details += "Until failure.";
			else if (reps == null) details = details.substring(0, details.length - 3) + " until failure."; //remove "of"
			else if (move.type[movementIndexes[currentMovement]] == "Static" && reps.includes("e") && reps.substring(0, reps.length -1) == 1) details += reps.substring(0, reps.length -1) + " second on each side.";
			else if (move.type[movementIndexes[currentMovement]] == "Static" && reps.includes("e")) details += reps.substring(0, reps.length -1) + " seconds on each side.";
			else if (move.type[movementIndexes[currentMovement]] == "Static" && reps == 1) details += reps + " second.";
			else if (move.type[movementIndexes[currentMovement]] == "Static") details += reps + " seconds.";
			else if (reps.includes("e") &&  reps.substring(0, reps.length -1) == 1) details += reps.substring(0, reps.length -1) + " rep on each side.";
			else if (reps.includes("e")) details += reps.substring(0, reps.length -1) + " reps on each side.";
			else if (reps == 1) details += reps + " rep.";
			else details += reps + " reps.";

			movementDetails.innerText = details;
		}

		//add notes
		var notes;
		var type = move.type[movementIndexes[currentMovement]];
		var target = move.target[movementIndexes[currentMovement]];
		var primary = move.primary[movementIndexes[currentMovement]];
		var secondary = move.secondary[movementIndexes[currentMovement]];
		
		switch(type.toLowerCase()) {
			case "stretch":
				if (move.name[0] == "Static Stretches") notes = possibleStaticStretch[getRandomIntInclusive(0, possibleStaticStretch.length - 1)];
				else notes = possibleDynamicStretch[getRandomIntInclusive(0, possibleDynamicStretch.length - 1)];
				break;

			case "push":
				notes = possiblePush[getRandomIntInclusive(0, possiblePush.length - 1)];
				break;

			case "pull":
				notes = possiblePull[getRandomIntInclusive(0, possiblePull.length - 1)];
				break;

			case "squat":
				notes = possibleSquat[getRandomIntInclusive(0, possibleSquat.length - 1)];
				break;

			case "lunge":
				notes = possibleLunge[getRandomIntInclusive(0, possibleLunge.length - 1)];
				break;

			case "static":
				notes = possibleStatic[getRandomIntInclusive(0, possibleStatic.length - 1)];
				break;
		}

		if (target) notes += " " + possibleTarget[getRandomIntInclusive(0, possibleTarget.length - 1)] + " " + target.toLowerCase() + ", ";
		if (primary) notes += possiblePrimaryGroups[getRandomIntInclusive(0, possiblePrimaryGroups.length - 1)] + " " + primary.toLowerCase() + ". ";
		if (secondary) notes += possibleSecondaryGroups[getRandomIntInclusive(0, possibleSecondaryGroups.length - 1)] + " " + secondary.toLowerCase() + ".";

		movementNotes.innerText = notes;

		//offset exercise clock
		var startSeconds = seconds;

		movementClock.style.color = "var(--bright)";

		//style when used as timer for timed movement
		var isTimed = false;
		var isSymmetric = false;
		var playedStartSound = false;
		var playedSwitchSound = false;
		var playedEndSound = false;
		var amountOfTime = 0;
		var previousSecond = 0;

		if (move.type[movementIndexes[currentMovement]] == "Static") isTimed = true;
		if (move.type[movementIndexes[currentMovement]] != "Stretch" && move.reps[movementIndexes[currentMovement]] != null) {
			if (move.reps[movementIndexes[currentMovement]].includes("e")) isSymmetric = true;
		}

		if (isTimed) {
			startSeconds += 10;
			if (isSymmetric) amountOfTime = reps.substring(0, reps.length -1) * 2;
			else amountOfTime = reps;
		}
		
		timeInterval = setInterval(function() {
			var time = seconds - startSeconds;

			if (isTimed) {
				if (time < 0) movementClock.style.color = "var(--timerRed)";
				else if (time < amountOfTime) movementClock.style.color = "var(--timerYellow)";
				else movementClock.style.color = "var(--timerGreen)";

				if (time < 0 && previousSecond != time && time != -10) {
					shortTone.pause();
					shortTone.currentTime = 0;
					previousSecond = time;
					shortTone.play();
				} else if (time == 0 && !playedStartSound) {
					longTone.play();
					playedStartSound = true;
				} else if (time == (amountOfTime / 2) && isSymmetric && !playedSwitchSound) {
					longTone.play();
					playedSwitchSound = true;
				} else if (time == amountOfTime && !playedEndSound) {
					longTone.play();
					playedEndSound = true;
				}
			}

			var str = formatTime(time, false);
			movementClock.innerText = str;
		}, 10);

		//load screen
		if (currentMovement == 0) toggleAppearance(exercise, true, 1000, true);
		else toggleAppearance(exercise, true, 1000);
		
		currentMovement++;

		updateTracker();

	}, 1000);
}

function updateTracker() {
	var fraction = (currentMovement - 1) + "/" + movements.length;
	var percentage = (parseFloat(currentMovement - 1) / parseFloat(movements.length)) * 100;
	percentage = (Math.round(percentage * 10) / 10) + "%";

	progressFraction.innerText = fraction;
	progressPercentage.innerText = percentage;

	progressFill.style.width = percentage;
	progressNumbers.style.left = percentage;
}

function loadResults() {
	resultText.innerText = possibleResultTitles[getRandomIntInclusive(0, possibleResultTitles.length - 1)];
	resultFinal.innerText = possibleResultStarts[getRandomIntInclusive(0, possibleResultStarts.length - 1)] + " " + possibleResultFinals[getRandomIntInclusive(0, possibleResultFinals.length - 1)];

	toggleAppearance(results, true, 1000, true);
	paused = true;

	setTimeout(function() {
		toggleAppearance(resultFinal, true, 1000);
	}, 2000);
}