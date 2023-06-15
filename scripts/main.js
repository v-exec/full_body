function appStart() {
	//load profile - if no profile, create default profile
	if (loadCookie('workout') == null) {
		saveProfileInCookie('Pushup_3_20_2',true,true,2,60,1,false,60);
	}
	generateIntro();
	decodeProfile()
}

function generateIntro() {
	var i = getRandomIntInclusive(0, fulldata['intro flavors'].length - 1);
	introTitle.innerText = fulldata['intro flavors'][i];
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

	//add breaks
	if (breakFrequency > 0) {
		var x = 0;
		for (var i = 0; i < newMovements.length; i++) {
			if (x == breakFrequency) {
				newMovements.splice(i, 0, new Movement("Break",1,breakDuration,2));
				i++;
				x = 0;
			}
			x++;
		}
	}

	//add stretches
	if (stretches) {
		var firstStretch = new Movement("Dynamic Stretches",1,120,2);
		var lastStretch = new Movement("Static Stretches",1,120,2);
		newMovements.unshift(firstStretch);
		newMovements.push(lastStretch);
	}

	//remove buttons if hard mode
	if (hardMode) {
		pauseTimer.style.display = 'none';
		nextMovement.style.display = 'none';
		pausedClock.style.display = 'none';
	}

	movements = newMovements;

	loadMovements();
}

function loadMovements() {
	toggleAppearance(intro, false, standardTransitionTime);

	loadNextMovement();

	//master timer
	setInterval(function() {
		if (!finished) {
			if (paused) pausedSeconds += 1;
			else activeSeconds += 1;
		}
	}, 1000);

	//start clocks
	setInterval(function() {
		var str = formatTime(activeSeconds, true);
		totalClock.innerText = str;
		str = formatTime(pausedSeconds, false);
		pausedClock.innerText = str;
	}, 100);
}

function loadNextMovement() {
	//don't unload screen on first load
	if (currentMovement != 0) {
		toggleAppearance(exercise, false, standardTransitionTime);
	} else {
		setTimeout(function() {
			toggleAppearance(tracker, true, standardTransitionTime);
		}, standardTransitionTime * 2);
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

		movementName.innerText = move.name;

		//format movement details
		var details = '';
		var reps = move.reps;
		var repType = move.repType;
		var sets = move.sets;

		movementDetails.innerText = createDetails(move);

		//add up next in notes
		var notes;
		
		if (currentMovement+1 == movements.length) notes = 'Up next: Workout finished!';
		else notes = 'Up next: ' + createUpNext(movements[currentMovement+1]);

		movementNotes.innerText = notes;
		movementNotesMobile.innerText = notes;

		//offset exercise clock
		var startSeconds = activeSeconds;

		//style when used as timer for timed movement
		movementClock.style.color = 'var(--ultraBright)';

		var isTimed = false;
		var isSymmetric = false;
		var silentStart = false;
		var playedStartSound = false;
		var playedSwitchSound = false;
		var playedEndSound = false;
		var amountOfTime = 0;
		var checkpointTime = 0;
		var previousSecond = 0;

		if (move.repType > 1 || move.name == 'Static Stretches' || move.name == 'Static Stretches') isTimed = true;
		if (move.name == 'Static Stretches' || move.name == 'Dynamic Stretches' || move.name == 'Break') silentStart = true;
		if (move.repType % 2 != 0) isSymmetric = true;

		if (isTimed) {
			if (!silentStart) startSeconds += 5;

			if (isSymmetric) {
				amountOfTime = reps * 2;
				checkpointTime = reps;
			} else {
				amountOfTime = reps;
				checkpointTime = reps;
			}

			amountOfTime *= sets;
		}

		if (hardMode) {
			isTimed = true;
			amountOfTime = hardModeTime;
		}
		
		timeInterval = setInterval(function() {
			var time = activeSeconds - startSeconds;

			if (isTimed) {
				if (time < 0) movementClock.style.color = 'var(--timerRed)';
				else if (time < amountOfTime) movementClock.style.color = 'var(--timerYellow)';
				else movementClock.style.color = 'var(--timerGreen)';

				//play countdown tones
				if (time < 0 && previousSecond != time && time != -10) {
					shortTone.pause();
					shortTone.currentTime = 0;
					previousSecond = time;
					if (!silentStart) shortTone.play();

				//play start sound
				} else if (time == 0 && !playedStartSound) {
					if (!silentStart) longTone.play();
					playedStartSound = true;

				//play checkpoint sound
				} else if (time % checkpointTime == 0 && !playedSwitchSound && time != amountOfTime && time > 0 && !playedEndSound) {
					if (!silentStart) longTone.play();
					playedSwitchSound = true;

				//reset checkpoint sound
				} else if (time % checkpointTime != 0 && playedSwitchSound) {
					playedSwitchSound = false;

				//play end sound
				} else if (time == amountOfTime && !playedEndSound) {
					longTone.play();
					playedEndSound = true;

					if (hardMode) loadNextMovement();
				}
			}

			var str = formatTime(time, false);
			movementClock.innerText = str;
		}, courtesyTime);

		//load screen
		if (currentMovement == 0) toggleAppearance(exercise, true, standardTransitionTime);
		else toggleAppearance(exercise, true, standardTransitionTime);
		
		currentMovement++;

		updateTracker();

	}, standardTransitionTime);
}

function updateTracker() {
	var fraction = (currentMovement - 1) + '/' + movements.length;
	var percentage = (parseFloat(currentMovement - 1) / parseFloat(movements.length)) * 100;
	percentage = (Math.round(percentage * 10) / 10) + '%';

	progressFraction.innerText = fraction;
	progressPercentage.innerText = percentage;

	progressFill.style.width = percentage;
	progressNumbers.style.left = percentage;
}

function loadResults() {
	resultTitle.innerText = fulldata['result title flavors'][getRandomIntInclusive(0, fulldata['result title flavors'].length - 1)];
	resultDescription.innerText = fulldata['result start flavors'][getRandomIntInclusive(0, fulldata['result start flavors'].length - 1)] + ' ' + fulldata['result end flavors'][getRandomIntInclusive(0, fulldata['result end flavors'].length - 1)];

	toggleAppearance(results, true, standardTransitionTime);
	finished = true;

	setTimeout(function() {
		toggleAppearance(resultDescription, true, standardTransitionTime);
	}, standardTransitionTime * 2);
}