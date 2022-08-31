function appStart() {
	//load profile - if no profile, create default profile
	if (loadCookie('workout') == null) {
		saveProfileInCookie('3_3_20_2',false,1,60,true,1,true);
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
		console.log(circuit);
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
	if (stretches) {
		var firstStretch = new Movement(0,0,0,0,fulldata['movements'][0].name,fulldata['movements'][0].type);
		var lastStretch = new Movement(1,0,0,0,fulldata['movements'][1].name,fulldata['movements'][1].type);
		newMovements.unshift(firstStretch);
		newMovements.push(lastStretch);
	}

	movements = newMovements;

	loadMovements();
}

function loadMovements() {
	toggleAppearance(intro, false, 1000, true);

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

		movementName.innerText = move.name;
		//dynamically size text so it's not too big if it's too long
		movementName.style.fontSize = 200 - (move.name.length * 3) + 'px';

		console.log(movements);

		//format movement details
		//ignore details if stretch
		if (move.type != 'stretch') {
			var details = '';
			var reps = move.reps;
			var repType = move.repType;
			var sets = move.sets;

			if (sets > 1) details = sets + ' sets of '; 

			//take into account singulars and plurals
			if (reps == 0 && sets <= 1) details += 'Until failure.';
			else if (reps == 0) details = details.substring(0, details.length - 3) + ' until failure.'; //remove 'of'
			else if (repType == 3 && reps == 1) details += reps + ' second on each side.';
			else if (repType == 3) details += reps + ' seconds on each side.';
			else if (repType == 2 && reps == 1) details += reps + ' second.';
			else if (repType == 2) details += reps + ' seconds.';
			else if (repType == 1 && reps == 1) details += reps + ' rep on each side.';
			else if (repType == 1) details += reps + ' reps on each side.';
			else if (reps == 1) details += reps + ' rep.';
			else details += reps + ' reps.';

			movementDetails.innerText = details;
		}

		//add notes
		var notes;
		var type = move.type;
		var target = move.target;
		var primary = move.primary;
		var secondary = move.secondary;
		
		switch(type.toLowerCase()) {
			case 'stretch':
				if (move.name == 'Static Stretches') notes = fulldata['static stretch flavors'][getRandomIntInclusive(0, fulldata['static stretch flavors'].length - 1)];
				else notes = fulldata['dynamic stretch flavors'][getRandomIntInclusive(0, fulldata['dynamic stretch flavors'].length - 1)];
				break;

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

		movementNotes.innerText = notes;

		//offset exercise clock
		var startSeconds = activeSeconds;

		movementClock.style.color = 'var(--ultraBright)';

		//style when used as timer for timed movement
		var isTimed = false;
		var isSymmetric = false;
		var playedStartSound = false;
		var playedSwitchSound = false;
		var playedEndSound = false;
		var amountOfTime = 0;
		var checkpointTime = 0;
		var previousSecond = 0;

		if (move.type == 'static') isTimed = true;
		if (move.type != 'stretch' && move.reps != null) {
			if (move.repType % 2 != 0) isSymmetric = true;
		}

		if (isTimed) {
			startSeconds += 10;

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
					shortTone.play();

				//play start sound
				} else if (time == 0 && !playedStartSound) {
					longTone.play();
					playedStartSound = true;

				//play checkpoint sound
				} else if (time % checkpointTime == 0 && !playedSwitchSound && time != amountOfTime && time > 0 && !playedEndSound) {
					longTone.play();
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
		}, 10);

		//load screen
		if (currentMovement == 0) toggleAppearance(exercise, true, 1000, true);
		else toggleAppearance(exercise, true, 1000);
		
		currentMovement++;

		updateTracker();

	}, 1000);
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
	resultText.innerText = fulldata['result title flavors'][getRandomIntInclusive(0, fulldata['result title flavors'].length - 1)];
	resultFinal.innerText = fulldata['result start flavors'][getRandomIntInclusive(0, fulldata['result start flavors'].length - 1)] + ' ' + fulldata['result end flavors'][getRandomIntInclusive(0, fulldata['result end flavors'].length - 1)];

	toggleAppearance(results, true, 1000, true);
	finished = true;

	setTimeout(function() {
		toggleAppearance(resultFinal, true, 1000);
	}, 2000);
}