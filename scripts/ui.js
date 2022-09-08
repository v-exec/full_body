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

//close dropdown on click
window.addEventListener('click', function(e) {
	if (!e.target.matches('.fluidDropdown')) {
		var dropdowns = document.getElementsByClassName('fluidDropdownList');
		for (var i = 0; i < dropdowns.length; i++) {
			if (dropdowns[i].style.display != 'none') dropdowns[i].style.display = 'none';
		}
	}
});

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

		(function(i) {
			remove.addEventListener('click', function() {
				movements.splice(i, 1);
				i--;
				encodeProfile();
				refreshExerciseList();
			});
		}(i));

		exercise.appendChild(remove);

		//NAME
		var name = document.createElement('span');
		name.className = 'fluidDropdown';
		name.innerText = movements[i].name;
		name.setAttribute('value', movements[i].id);

		var list = document.createElement('div');
		list.className = 'fluidDropdownList';

		var options = [];
		var chest = [];
		var back = [];
		var arms = [];
		var shoulders = [];
		var legs = [];
		var calves = [];
		var core = [];

		for (var j = 0; j < fulldata['movements'].length; j++) {
			if (j == 0 || j == 1 || j == 2) continue; //skip stretches and breaks
			var option = document.createElement('span');
			option.className = 'fluidDropdownItem';
			option.setAttribute('value', j);
			option.innerText = fulldata['movements'][j]['name'];
			if (fulldata['movements'][j]['id'] == movements[i].id) option.classList.add('fluidDropdownItemSelected'); //select current movement

			(function(i,option) {
				option.addEventListener('click', function() {
					movements[i].id = option.getAttribute('value');
					encodeProfile();
					decodeProfile();
				});
			}(i,option));

			switch (fulldata['movements'][j]['target']) {
				case 'chest':
					chest.push(option);
					break;

				case 'back':
					back.push(option);
					break;

				case 'arms':
					arms.push(option);
					break;

				case 'shoulders':
					shoulders.push(option);
					break;

				case 'legs':
					legs.push(option);
					break;

				case 'calves':
					calves.push(option);
					break;

				case 'core':
					core.push(option);
					break;
			}
		}

		chest = chest.sort(sortOptions);
		back = back.sort(sortOptions);
		arms = arms.sort(sortOptions);
		shoulders = shoulders.sort(sortOptions);
		legs = legs.sort(sortOptions);
		calves = calves.sort(sortOptions);
		core = core.sort(sortOptions);

		var divs = [];
		for (var j = 0; j < 6; j++) {
			var div = document.createElement('div');
			div.className = 'fluidDropdownDivider';
			divs.push([div]);
		}

		options = chest.concat(divs[0], back, divs[1], arms, divs[2], shoulders, divs[3], legs, divs[4], calves, divs[5], core);

		for (var j = 0; j < options.length; j++) {
			list.appendChild(options[j]);
		}

		var dropdownArrow = document.createElement('span');
		dropdownArrow.className = 'fluidDropdownArrow';
		dropdownArrow.innerText = '>';
		
		name.appendChild(dropdownArrow);
		name.appendChild(list);

		(function(name,list) {
			name.addEventListener('click', function() {
				list.style.display = 'block';
			});
		}(name,list));

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
		var repType = document.createElement('span');
		repType.className = 'fluidDropdown';
		repType.innerText = fulldata['rep types'][movements[i].repType];
		repType.setAttribute('value', movements[i].repType);

		var list = document.createElement('div');
		list.className = 'fluidDropdownList';

		var keepPreviousRepType = false;

		for (var j = 0; j < fulldata['rep types'].length; j++) {
			//avoid symmetry options on non-asymmetric movements
			if (!fulldata['movements'][movements[i].id]['possibly asymmetric'] && j % 2 != 0) continue;

			//avoid rep options on non-reppable movements
			if (!fulldata['movements'][movements[i].id]['possibly repped'] && j < 2) continue;

			//check previous rep type
			if (repType.getAttribute('value') == j) keepPreviousRepType = true;

			var option = document.createElement('span');
			option.className = 'fluidDropdownItem';
			option.setAttribute('value', j);
			if (Math.abs(repCount.value) != 1) option.innerText = fulldata['rep types'][j];
			else option.innerText = fulldata['rep types singular'][j];

			if (j == movements[i].repType) option.classList.add('fluidDropdownItemSelected'); //select current movement's rep type

			(function(i,option) {
				option.addEventListener('click', function() {
					movements[i].repType = option.getAttribute('value');
					encodeProfile();
					refreshExerciseList();
				});
			}(i,option));

			list.appendChild(option);
		}
		//if previous repType is no longer in list, reset repType to first in list
		if (!keepPreviousRepType) {
			movements[i].repType = list.children[0].getAttribute('value');
			list.children[0].classList.add('fluidDropdownItemSelected');
			repType.innerText = fulldata['rep types'][movements[i].repType];
			repType.setAttribute('value', movements[i].repType);
			encodeProfile();
		} //do all other appending after this to avoid overwriting it

		var dropdownArrow = document.createElement('span');
		dropdownArrow.className = 'fluidDropdownArrow';
		dropdownArrow.innerText = '>';

		repType.appendChild(dropdownArrow);
		repType.appendChild(list);

		(function(repType,list) {
			repType.addEventListener('click', function() {
				list.style.display = 'block';
			});
		}(repType,list));

		exercise.appendChild(repType);
		exerciseList.insertBefore(exercise, exerciseAdd);
	}

	//muscles warning
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