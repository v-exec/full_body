function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toggleAppearance(element, appearance, milliseconds) {
	animating = true;

	if (appearance) {
		element.style.display = 'inline-block';
		setTimeout(function(){
			element.style.opacity = 1;
		}, courtesyTime);
	} else {
		element.style.opacity = 0;
		setTimeout(function(){
			element.style.display = 'none';
		}, milliseconds);
	}

	setTimeout(function(){
		animating = false;
	}, milliseconds);
}

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function formatTime(s, includeHours) {
	//save negative
	var negative = false;
	if (s < 0) {
		negative = true;
		s = Math.abs(s);
	}

	var hours = Math.floor(s / 3600);
	var minutes = Math.floor((s - (hours * 3600)) / 60);
	var rest = s - ((hours * 3600) + (minutes * 60));

	hours = hours.toLocaleString(undefined, {minimumIntegerDigits: 2});
	minutes = minutes.toLocaleString(undefined, {minimumIntegerDigits: 2});
	rest = rest.toLocaleString(undefined, {minimumIntegerDigits: 2});

	var str = '';

	if (negative) str += '-';

	if (includeHours) str += hours + ':' + minutes + ':' + rest;
	else str += minutes + ':' + rest;

	return str;
}

function createDetails(mov) {
	var details = '';
	var reps = mov.reps;
	var repType = mov.repType;
	var sets = mov.sets;

	if (sets > 1) details = sets + ' sets of ';

	//take into account singulars and plurals
	if (reps == 0) details += 'Until failure.';
	else if (reps == 0) details = details.substring(0, details.length - 3) + ' until failure.'; //remove 'of'
	else if (repType == 3 && reps == 1) details += reps + ' second on each side.';
	else if (repType == 3) details += reps + ' seconds on each side.';
	else if (repType == 2 && reps == 1) details += reps + ' second.';
	else if (repType == 2) details += reps + ' seconds.';
	else if (repType == 1 && reps == 1) details += reps + ' rep on each side.';
	else if (repType == 1) details += reps + ' reps on each side.';
	else if (reps == 1) details += reps + ' rep.';
	else details += reps + ' reps.';

	return details;
}

function createUpNext(mov) {
	var details = '';
	var name = mov.name;
	var reps = mov.reps;
	var repType = mov.repType;
	var sets = mov.sets;

	if (sets > 1) {
		details = sets + ' sets of ' + name + 's, ';
		
		if (reps == 0) details + ' until failure';
		else if (repType == 3 && reps == 1)		details += reps + ' second on each side.';
		else if (repType == 3)					details += reps + ' seconds on each side.';
		else if (repType == 2 && reps == 1) 	details += reps + ' second each.';
		else if (repType == 2)					details += reps + ' seconds each.';
		else if (repType == 1 && reps == 1)		details += reps + ' rep on each side.';
		else if (repType == 1)					details += reps + ' reps on each side.';
		else if (reps == 1)						details += reps + ' rep each.';
		else 									details += reps + ' reps each.';
	} else {
		details = reps;

		if (reps == 0) details += ' until failure';
		else if ((repType == 3 || repType == 2) && reps == 1)	details += ' second of ' + name + 's';
		else if ((repType == 3 || repType == 2))				details += ' seconds of ' + name + 's';
		else if ((repType == 1 || repType == 0) && reps == 1)	details += ' rep of ' + name + 's';
		else if ((repType == 1 || repType == 0))				details += ' reps of ' + name + 's';

		//remove 's' on timed exercises with a single rep to sound more natural
		if (sets == 1 && (repType == 3 || repType == 2)) details = details.substring(0, details.length - 1);

		if (repType == 3 || repType == 1) details += 'on each side.';
		else details += '.';
	}

	return details;
}

function saveProfileInCookie(workout, circuit, stretches, muscleGroupsWarning, breakFrequency, breakDuration, infoType) {
	var date = new Date();
	date.setTime(date.getTime() + 100000 * 36000);
	var suffix = ';expires='+date.toUTCString()+';path=/;SameSite=Strict';
	document.cookie = 'workout='+workout+suffix;
	document.cookie = 'circuit='+circuit+suffix;
	document.cookie = 'stretches='+stretches+suffix;
	document.cookie = 'muscleGroupsWarning='+muscleGroupsWarning+suffix;
	document.cookie = 'breakFrequency='+breakFrequency+suffix;
	document.cookie = 'breakDuration='+breakDuration+suffix;
	document.cookie = 'infoType='+infoType+suffix;
}

function loadCookie(target) {
	var cookies = document.cookie;
	var splitCookies = cookies.split(';');
	target += '=';

	for (var i = 0; i < splitCookies.length; i++) {
		var cookie = splitCookies[i].trim();
		if (cookie.indexOf(target) == 0) {
			return cookie.substring(target.length, cookie.length);
		}
	}

	//workout not found
	return null;
}

//read elements and save workout
function encodeProfile() {
	var workout = '';

	//movementId_setCount_repCount_repType,...
	for (var i = 0; i < movements.length; i++) {
		workout += movements[i].id + '_';
		workout += movements[i].sets + '_';
		workout += movements[i].reps + '_';
		workout += movements[i].repType;
		if (i+1 != movements.length) workout += ',';
	}

	saveProfileInCookie(workout, circuit, stretches, muscleGroupsWarning, breakFrequency, breakDuration, infoType);
}

//decodes cookie and applies its settings
function decodeProfile() {
	if (loadCookie('workout') == null) return null;

	movements = [];

	//settings
	circuit = (loadCookie('circuit') === 'true');
	if (circuit) circuitSetting.innerText = 'x';

	stretches = (loadCookie('stretches') === 'true');
	if (stretches) stretchesSetting.innerText = 'x';

	muscleGroupsWarning = (loadCookie('muscleGroupsWarning') === 'true');
	if (muscleGroupsWarning) muscleGroupsWarningSetting.innerText = 'x';

	breakFrequency = loadCookie('breakFrequency');
	breakFrequencySetting.value = breakFrequency;

	breakDuration = loadCookie('breakDuration');
	breakDurationSetting.value = breakDuration;

	infoType = loadCookie('infoType');
	infoTypeSetting.value = infoType;

	//movements
	var m = loadCookie('workout');
	m = m.split(',');
	
	for (var i = 0; i < m.length; i++) {
		var mData = m[i].split('_');

		var id = mData[0];
		var sets = mData[1];
		var reps = mData[2];
		var repType = mData[3];

		var name = fulldata['movements'][id]['name'];
		var type = fulldata['movements'][id]['type'];
		var primary = fulldata['movements'][id]['primary'];
		var secondary = fulldata['movements'][id]['secondary'];
		var target = fulldata['movements'][id]['target'];

		movements.push(new Movement(id, sets, reps, repType, name, type, primary, secondary, target));
	}

	//fire fake event to update elements' surrounding flavor text
	var e = new Event('change');
	breakFrequencySetting.dispatchEvent(e);
	breakDurationSetting.dispatchEvent(e);
	infoTypeSetting.dispatchEvent(e);

	refreshExerciseList();
}