nextMovement.addEventListener('click', function() {
	if (!animating) loadNextMovement();
}, false);

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

		//unload content
		movementName.innerText = '';
		movementDetails.innerText = '';
		movementNotes.innerText = '';
		if (timer) {
			timePerMovement.push(time);
			time = 0;
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

		//add clock
		if (timer) {
			var start = Date.now();
			timeInterval = setInterval(function() {
				var delta = Date.now() - start;
				time = Math.floor(delta / 1000);
				var t = new Date(0);
				t.setSeconds(time);
				var tString = t.toISOString().substr(14, 5);
				clock.innerText = tString;
			}, 100);
		}

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

	if (timer) {
		resultFinal.innerText = possibleResultFinalsTimer[getRandomIntInclusive(0, possibleResultFinalsTimer.length - 1)];

		//time spent per exercise
		for (var i = 0; i < movements.length; i++) {
			var t = document.createElement("SPAN");
			t.textContent = movements[i].name[movementIndexes[i]];
			t.className = "resultData";
			t.style.width = "calc(" + (100.0 / movements.length) + "% - 20px)";
			resultInfo.append(t);
		}

		for (var i = 0; i < movements.length; i++) {
			var t = document.createElement("SPAN");
			var d = new Date(0);
			d.setSeconds(timePerMovement[i]);
			var tString = d.toISOString().substr(14, 5);
			t.textContent = tString;
			t.className = "resultData";
			t.style.width = "calc(" + (100.0 / movements.length) + "% - 20px)";
			resultInfo.append(t);
		}

		//time spent per muscle
		for (var i = 0; i < muscleGroups.length; i++) {
			var t = document.createElement("SPAN");
			t.textContent = muscleGroups[i];
			t.className = "resultData";
			t.style.width = "calc(" + (100.0 / muscleGroups.length) + "% - 20px)";
			resultInfo.append(t);
		}

		for (var i = 0; i < muscleGroups.length; i++) {
			var amount = 0;

			for (var j = 0; j < movements.length; j++) {
				if (movements[j].primary[movementIndexes[j]] == muscleGroups[i]) amount += timePerMovement[j];	
			}

			var t = document.createElement("SPAN");
			var d = new Date(0);
			d.setSeconds(amount);
			var tString = d.toISOString().substr(14, 5);
			t.textContent = tString;
			t.className = "resultData";
			t.style.width = "calc(" + (100.0 / muscleGroups.length) + "% - 20px)";
			resultInfo.append(t);
		}

		//time spent per target area
		for (var i = 0; i < targetAreas.length; i++) {
			var t = document.createElement("SPAN");
			t.textContent = targetAreas[i];
			t.className = "resultData";
			t.style.width = "calc(" + (100.0 / targetAreas.length) + "% - 20px)";
			resultInfo.append(t);
		}

		for (var i = 0; i < targetAreas.length; i++) {
			var amount = 0;

			for (var j = 0; j < movements.length; j++) {
				if (movements[j].target[movementIndexes[j]] == targetAreas[i]) amount += timePerMovement[j];	
			}

			var t = document.createElement("SPAN");
			var d = new Date(0);
			d.setSeconds(amount);
			var tString = d.toISOString().substr(14, 5);
			t.textContent = tString;
			t.className = "resultData";
			t.style.width = "calc(" + (100.0 / targetAreas.length) + "% - 20px)";
			resultInfo.append(t);
		}
	} else {
		resultFinal.innerText = possibleResultFinalsNoTimer[getRandomIntInclusive(0, possibleResultFinalsNoTimer.length - 1)];
	}

	toggleAppearance(results, true, 1000, true);

	setTimeout(function() {
		toggleAppearance(resultFinal, true, 1000);
	}, 2000);

	setTimeout(function() {
		toggleAppearance(resultInfo, true, 1000);
	}, 3000);
}