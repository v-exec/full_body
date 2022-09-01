function appStart() {
	//load profile - if no profile, create default profile
	if (loadCookie('workout') == null) {
		saveProfileInCookie('4_3_20_2',true,true,true,2,60,1);
	}
	generateIntro();
	decodeProfile()
}

function generateIntro() {
	var i = getRandomIntInclusive(0, fulldata['intro flavors'].length - 1);
	introTitle.innerText = fulldata['intro flavors'][i];
	warningFlavorIndex = getRandomIntInclusive(0, fulldata['group warning flavors'].length - 1);
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
				newMovements.splice(i, 0, new Movement(2,1,breakDuration,2,fulldata['movements'][2].name,fulldata['movements'][2].type));
				i++;
				x = 0;
			}
			x++;
		}
	}

	//add stretches
	if (stretches) {
		var firstStretch = new Movement(0,1,120,2,fulldata['movements'][0].name,fulldata['movements'][0].type);
		var lastStretch = new Movement(1,1,120,2,fulldata['movements'][1].name,fulldata['movements'][1].type);
		newMovements.unshift(firstStretch);
		newMovements.push(lastStretch);
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
	}, standardTransitionTime);

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

		//add notes
		var notes;
		var type = move.type;
		var target = move.target;
		var primary = move.primary;
		var secondary = move.secondary;
		
		if (infoType == 1) {
			switch(type.toLowerCase()) {
				case 'stretch':
					if (move.name == 'Static Stretches') notes = fulldata['static stretch flavors'][getRandomIntInclusive(0, fulldata['static stretch flavors'].length - 1)];
					else notes = fulldata['dynamic stretch flavors'][getRandomIntInclusive(0, fulldata['dynamic stretch flavors'].length - 1)];
					break;

				case 'break':
					notes = fulldata['break flavors'][getRandomIntInclusive(0, fulldata['break flavors'].length - 1)];

				case 'push':
					notes = fulldata['push flavors'][getRandomIntInclusive(0, fulldata['push flavors'].length - 1)];
					break;

				case 'pull':
					notes = fulldata['pull flavors'][getRandomIntInclusive(0, fulldata['pull flavors'].length - 1)];
					break;

				case 'squat':
					notes = fulldata['squat flavors'][getRandomIntInclusive(0, fulldata['squat flavors'].length - 1)];
					break;

				case 'lunge':
					notes = fulldata['lunge flavors'][getRandomIntInclusive(0, fulldata['lunge flavors'].length - 1)];
					break;

				case 'static':
					notes = fulldata['static flavors'][getRandomIntInclusive(0, fulldata['static flavors'].length - 1)];
					break;
			}

			if (target) notes += ' ' + fulldata['target flavors'][getRandomIntInclusive(0, fulldata['target flavors'].length - 1)] + ' ' + target.toLowerCase() + ', ';
			if (primary) notes += fulldata['primary flavors'][getRandomIntInclusive(0, fulldata['primary flavors'].length - 1)] + ' ' + primary.toLowerCase() + '. ';
			if (secondary) notes += fulldata['secondary flavors'][getRandomIntInclusive(0, fulldata['secondary flavors'].length - 1)] + ' ' + secondary.toLowerCase() + '.';

		} else if (infoType == 2) {
			if (currentMovement+1 == movements.length) notes = 'Up next: Workout finished!';
			else notes = 'Up next: ' + createUpNext(movements[currentMovement+1]);
		}

		movementNotes.innerText = notes;
		movementNotesMobile.innerText = notes;

		//offset exercise clock
		var startSeconds = activeSeconds;

		movementClock.style.color = 'var(--ultraBright)';

		//style when used as timer for timed movement
		var isTimed = false;
		var isSymmetric = false;
		var silentStart = false;
		var playedStartSound = false;
		var playedSwitchSound = false;
		var playedEndSound = false;
		var amountOfTime = 0;
		var checkpointTime = 0;
		var previousSecond = 0;

		if (move.type == 'static' || move.type == 'stretch' || move.type == 'break') {
			isTimed = true;
			silentStart = true;
		}

		if (move.repType % 2 != 0) isSymmetric = true;

		if (isTimed) {
			if (move.type == 'static') startSeconds += 5;

			if (isSymmetric) {
				amountOfTime = reps * 2;
				checkpointTime = reps;
			} else {
				amountOfTime = reps;
				checkpointTime = reps;
			}

			amountOfTime *= sets;
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