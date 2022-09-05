nextMovement.addEventListener('click', function() {
	if (animating) return;
	loadNextMovement();
});

pauseTimer.addEventListener('click', function() {
	if (animating) return;
	paused = !paused;
	if (paused) {
		pauseTimer.innerText = 'Resume Timer';
		pauseTimer.style.color = 'var(--dark)';
	}
	else {
		pauseTimer.innerText = 'Pause Timer';
		pauseTimer.removeAttribute('style');
	}
});

optionsPlan.addEventListener('click', function() {
	if (animating) return;
	if (!optionsOpen) {
		toggleAppearance(exerciseList, false, standardTransitionTime);
		setTimeout(function() {
			toggleAppearance(optionsList, true, standardTransitionTime);
		}, standardTransitionTime);
		optionsPlan.innerText = 'Plan';
	} else {
		toggleAppearance(optionsList, false, standardTransitionTime);
		setTimeout(function() {
			toggleAppearance(exerciseList, true, standardTransitionTime);
		}, standardTransitionTime);
		optionsPlan.innerText = 'Options';
		refreshExerciseList();
	}
	optionsOpen = !optionsOpen;
});

start.addEventListener('click', function() {
	if (animating) return;
	sequenceMovements();
});

info.addEventListener('click', function() {
	if (animating) return;
	if (!infoOpen) toggleAppearance(infoBox, true, standardTransitionTime, true);
	else toggleAppearance(infoBox, false, standardTransitionTime);
	infoOpen = !infoOpen;
});

circuitSetting.addEventListener('click', function() {
	circuit = !circuit;
	if (circuit) circuitSetting.innerText = 'x';
	else circuitSetting.innerText = '';
	encodeProfile();
});

stretchesSetting.addEventListener('click', function() {
	stretches = !stretches
	if (stretches) stretchesSetting.innerText = 'x';
	else stretchesSetting.innerText = '';
	encodeProfile();
});

muscleGroupsWarningSetting.addEventListener('click', function() {
	muscleGroupsWarning = !muscleGroupsWarning
	if (muscleGroupsWarning) muscleGroupsWarningSetting.innerText = 'x';
	else muscleGroupsWarningSetting.innerText = '';
	encodeProfile();
});

breakFrequencySetting.addEventListener('change', function() {
	breakFrequency = Math.abs(breakFrequencySetting.value.toString().replace(/\D/g,''));
	breakFrequencySetting.value = breakFrequency;
	if (Math.abs(breakFrequency) != 1) breakFrequencyText.innerText = 'exercises.';
	else breakFrequencyText.innerText = 'exercise.';
	encodeProfile();
});

breakDurationSetting.addEventListener('change', function() {
	breakDuration = Math.abs(breakDurationSetting.value.toString().replace(/\D/g,''));
	breakDurationSetting.value = breakDuration;
	if (Math.abs(breakDuration) != 1) breakDurationText.innerText = 'seconds.';
	else breakDurationText.innerText = 'second.';
	encodeProfile();
});

infoTypeUpNext.addEventListener('click', function() {
	infoType = 0;
	infoTypeUpNext.className = 'activeFluidButton';
	infoTypeFlavorText.className = '';
	infoTypeNone.className = '';
	encodeProfile();
});

infoTypeFlavorText.addEventListener('click', function() {
	infoType = 1;
	infoTypeUpNext.className = '';
	infoTypeFlavorText.className = 'activeFluidButton';
	infoTypeNone.className = '';
	encodeProfile();
});

infoTypeNone.addEventListener('click', function() {
	infoType = 2;
	infoTypeUpNext.className = '';
	infoTypeFlavorText.className = '';
	infoTypeNone.className = 'activeFluidButton';
	encodeProfile();
});

hardModeSetting.addEventListener('click', function() {
	hardMode = !hardMode;
	if (hardMode) hardModeSetting.innerText = 'x';
	else hardModeSetting.innerText = '';
	encodeProfile();
});

hardModeTimeSetting.addEventListener('change', function() {
	hardModeTime = Math.abs(hardModeTimeSetting.value.toString().replace(/\D/g,''));
	hardModeTimeSetting.value = hardModeTime;
	if (Math.abs(hardModeTime) != 1) hardModeTimeText.innerText = 'seconds per movement.';
	else hardModeTimeText.innerText = 'second per movement.';
	encodeProfile();
});

exerciseAdd.addEventListener('click', function() {
	movements.push(new Movement());
	encodeProfile();
	refreshExerciseList();
});

window.addEventListener('resize', function() {
	resizeText();
});

function resizeText() {
	//resizes elements on home page
	var tHeight = parseInt(introTitle.clientHeight) + parseInt(window.getComputedStyle(introTitle).getPropertyValue('margin-bottom'));
	var dHeight = parseInt(introDescription.clientHeight) + parseInt(window.getComputedStyle(introDescription).getPropertyValue('margin-bottom'));
	var bHeight = parseInt(introButtons.clientHeight);
	var eMargin = parseInt(window.getComputedStyle(exerciseList).getPropertyValue('margin-bottom'));
	var t = tHeight + dHeight + bHeight + eMargin;

	exerciseList.style.height = 'calc(100% - ' + t + 'px)';
	optionsList.style.height = 'calc(100% - ' + t + 'px)';
}

function refreshExerciseList() {
	//clear list of elements
	for (var i = 0; i < exerciseList.children.length; i++) {
		if (exerciseList.children[i].className == 'listElement') {
			exerciseList.removeChild(exerciseList.children[i]);
			i--;
		}
	}

	//populate list
	for (var i = 0; i < movements.length; i++) {
		var exercise = document.createElement('div');
		exercise.className = 'listElement';

		var remove = document.createElement('span');
		remove.className = 'fluidLeftButton';
		remove.innerText = '-';

		(function(i,name) {
			remove.addEventListener('click', function() {
				movements.splice(i, 1);
				i--;
				encodeProfile();
				refreshExerciseList();
			});
		}(i,name));

		exercise.appendChild(remove);

		//NAME
		var name = document.createElement('select');
		name.className = 'fluidDropdown';

		for (var j = 0; j < fulldata['movements'].length; j++) {
			if (j == 0 || j == 1 || j == 2) continue; //skip stretches and breaks
			var option = document.createElement('option');
			option.value = j;
			option.text = fulldata['movements'][j]['name'];
			if (fulldata['movements'][j]['id'] == movements[i].id) option.setAttribute('selected', 'selected'); //select current movement
			name.appendChild(option);
		}

		//reload all movement data, not just name
		(function(i,name) {
			name.addEventListener('change', function() {
				movements[i].id = name.value;
				encodeProfile();
				decodeProfile();
			});
		}(i,name));

		name.style.width = 40 + name.selectedOptions[0].text.length * 8 + 'px'; //scale to size of text

		exercise.appendChild(name);

		//COMMA
		var comma = document.createElement('span');
		comma.className = 'fluidComma';
		comma.innerText = ',';
		exercise.appendChild(comma);

		//SET COUNT
		var setCount = document.createElement('input');
		setCount.className = 'fluidField';
		setCount.setAttribute('inputmode', 'numeric');
		setCount.setAttribute('maxlength', 2);
		setCount.value = movements[i].sets;

		(function(i,setCount) {
			setCount.addEventListener('change', function() {
				var s = Math.abs(setCount.value.toString().replace(/\D/g,''));
				if (s == 0) s = 1;
				movements[i].sets = s;
				encodeProfile();
				refreshExerciseList();
			});
		}(i,setCount));

		exercise.appendChild(setCount);

		//SET TEXT
		var setText = document.createElement('span');
		setText.className = 'fluidText';
		if (Math.abs(setCount.value) != 1) setText.innerText = 'sets of';
		else setText.innerText = 'set of';
		exercise.appendChild(setText);

		//REP COUNT
		var repCount = document.createElement('input');
		repCount.className = 'fluidField';
		repCount.setAttribute('inputmode', 'numeric');
		repCount.setAttribute('maxlength', 2);
		repCount.value = movements[i].reps;

		(function(i,repCount) {
			repCount.addEventListener('change', function() {
				movements[i].reps = Math.abs(repCount.value.toString().replace(/\D/g,''));
				encodeProfile();
				refreshExerciseList();
			});
		}(i,repCount));

		exercise.appendChild(repCount);

		//REP TYPE
		var repType = document.createElement('select');
		repType.className = 'fluidDropdown';

		for (var j = 0; j < fulldata['rep types'].length; j++) {
			//avoid symmetry options on non-asymmetric movements
			if (!fulldata['movements'][movements[i].id]['possibly asymmetric'] && j % 2 != 0) continue;

			//avoid rep options on non-reppable movements
			if (!fulldata['movements'][movements[i].id]['possibly repped'] && j < 2) continue;

			var option = document.createElement('option');
			option.value = j;
			if (Math.abs(repCount.value) != 1) option.text = fulldata['rep types'][j];
			else option.text = fulldata['rep types singular'][j];

			if (j == movements[i].repType) option.setAttribute('selected', 'selected'); //select current movement's rep type
			repType.appendChild(option);
		}

		(function(i,repType) {
			repType.addEventListener('change', function() {
				movements[i].repType = repType.value;
				encodeProfile();
				refreshExerciseList();
			});
		}(i,repType));

		repType.style.width = 40 + repType.selectedOptions[0].text.length * 8 + 'px'; //scale to size of text

		exercise.appendChild(repType);

		exerciseList.insertBefore(exercise, exerciseAdd);
	}

	if (muscleGroupsWarning) {
		var muscleGroupsCheck = [];

		for (var i = 0; i < fulldata['muscle groups'].length; i++) {
			muscleGroupsCheck.push(false);
		}

		for (var i = 0; i < movements.length; i++) {
			for (var j = 0; j < muscleGroupsCheck.length; j++) {
				if (movements[i].primary == fulldata['muscle groups'][j]) muscleGroupsCheck[j] = true;
				if (movements[i].secondary == fulldata['muscle groups'][j]) muscleGroupsCheck[j] = true;
			}
		}

		var muscles = '';
		for (var i = 0; i < muscleGroupsCheck.length; i++) {
			if (!muscleGroupsCheck[i]) muscles += fulldata['muscle groups'][i] + ', ';
		}
		muscles = muscles.slice(0, -2) + '.';

		musclesWarning.innerText = fulldata['group warning flavors'][warningFlavorIndex] + muscles;
	}
}