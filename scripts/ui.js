//functionality for next exercise button
nextMovement.addEventListener('click', function() {
	if (!animating) loadNextMovement();
}, false);

//functionality for pause button
pauseTimer.addEventListener('click', function() {
	paused = !paused;
	if (paused) {
		pauseTimer.innerText = 'Resume Timer';
		pauseTimer.style.backgroundColor = 'var(--bright)';
	}
	else {
		pauseTimer.innerText = 'Pause Timer';
		pauseTimer.removeAttribute('style');
	}
}, false);

//functionality for options / plan button

//functionality for start button
start.addEventListener('click', function() {
	sequenceMovements();
}, false);

//functionality for info button

//functionality for all checkmarks

function refreshExerciseList() {
	//clear list
	while (exerciseList.firstChild) {
		exerciseList.removeChild(exerciseList.firstChild);
	}

	//populate list
	for (var i = 0; i < movements.length; i++) {
		var exercise = document.createElement('div');
		exercise.className = 'listElement';

		var drag = document.createElement('span');
		drag.className = 'exerciseDrag';
		exercise.appendChild(drag);

		//NAME
		var name = document.createElement('select');
		name.className = 'fluidDropdown';

		for (var j = 0; j < fulldata['movements'].length; j++) {
			if (j == 0 || j == 1) continue; //skip stretches
			var option = document.createElement('option');
			option.value = j;
			option.text = fulldata['movements'][j]['name'];
			if (fulldata['movements'][j]['id'] == movements[i].id) option.setAttribute('selected', 'selected'); //select current movement
			name.appendChild(option);
		}

		//save and full reload on change - because we want to reload all movement data, not just the name
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
		comma.className = 'exerciseComma';
		comma.innerText = ',';
		exercise.appendChild(comma);

		//SET COUNT
		var setCount = document.createElement('input');
		setCount.className = 'fluidField';
		setCount.setAttribute('inputmode', 'numeric');
		setCount.setAttribute('maxlength', 2);
		setCount.value = movements[i].sets;

		//save and refresh on change
		(function(i,setCount) {
			setCount.addEventListener('change', function() {
				movements[i].sets = Math.abs(setCount.value.toString().replace(/\D/g,''));
				encodeProfile();
				refreshExerciseList();
			});
		}(i,setCount));

		exercise.appendChild(setCount);

		//SET TEXT
		var setText = document.createElement('span');
		setText.className = 'exerciseText';
		if (Math.abs(setCount.value) != 1) setText.innerText = 'sets of';
		else setText.innerText = 'set of';
		exercise.appendChild(setText);

		//REP COUNT
		var repCount = document.createElement('input');
		repCount.className = 'fluidField';
		repCount.setAttribute('inputmode', 'numeric');
		repCount.setAttribute('maxlength', 2);
		repCount.value = movements[i].reps;

		//save on change
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

		//save and refresh on change
		(function(i,repType) {
			repType.addEventListener('change', function() {
				movements[i].repType = repType.value;
				encodeProfile();
				refreshExerciseList();
			});
		}(i,repType));

		repType.style.width = 40 + repType.selectedOptions[0].text.length * 8 + 'px'; //scale to size of text

		exercise.appendChild(repType);

		exerciseList.appendChild(exercise);
	}

	var plus = document.createElement('span');
	plus.id = 'exerciseAdd';
	plus.innerText = 'more...';

	//add new default movement on click
	plus.addEventListener('click', function() {
		movements.push(new Movement());
		refreshExerciseList();
	}, false);

	exerciseList.appendChild(plus);

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

		var musclesWarning = document.createElement('span');
		musclesWarning.className = 'musclesWarning';
		musclesWarning.innerText = fulldata['group warning flavors'][warningFlavorIndex] + muscles;

		exerciseList.appendChild(musclesWarning);
	}
}