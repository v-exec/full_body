function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toggleAppearance(element, appearance, milliseconds, erase=false) {
	animating = true;

	if (appearance) {
		if (erase) {
			element.style.display = 'inline-block';
			setTimeout(function(){
				element.style.visibility = 'visible';
				element.style.opacity = 1;
			}, milliseconds);
		} else {
			element.style.visibility = 'visible';
			element.style.opacity = 1;
		}
	} else {
		element.style.opacity = 0;
		setTimeout(function(){
			element.style.visibility = 'hidden';
			if (erase) element.style.display = 'none';
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

function saveProfileInCookie(workout, circuit, breakFrequency, breakDuration, stretches, infoType, muscleGroupsWarning) {
	var date = new Date();
	date.setTime(date.getTime() + 100000 * 36000);
	var suffix = ';expires='+date.toUTCString()+';path=/;SameSite=Strict';
	document.cookie = 'workout='+workout+suffix;
	document.cookie = 'circuit='+circuit+suffix;
	document.cookie = 'breakFrequency='+breakFrequency+suffix;
	document.cookie = 'breakDuration='+breakDuration+suffix;
	document.cookie = 'stretches='+stretches+suffix;
	document.cookie = 'infoType='+infoType+suffix;
	document.cookie = 'muscleGroupsWarning='+muscleGroupsWarning+suffix;
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

/*
	workout encoding format:
	movementId_setCount_repCount_repType,...

	IDs are found in json.data
*/

//read elements and save workout
function encodeProfile() {
	var workout = '';

	for (var i = 0; i < movements.length; i++) {
		workout += movements[i].id + '_';
		workout += movements[i].sets + '_';
		workout += movements[i].reps + '_';
		workout += movements[i].repType;
		if (i+1 != movements.length) workout += ',';
	}

	saveProfileInCookie(workout, circuit, breakFrequency, breakDuration, stretches, infoType, muscleGroupsWarning);
}

//decodes cookie and applies its settings
function decodeProfile() {
	if (loadCookie('workout') == null) return null;

	movements = [];

	//settings
	circuit = (loadCookie('circuit') === 'true');
	breakFrequency = loadCookie('breakFrequency');
	breakDuration = loadCookie('breakDuration');
	stretches = (loadCookie('stretches') === 'true');
	infoType = loadCookie('infoType');
	muscleGroupsWarning = (loadCookie('muscleGroupsWarning') === 'true');

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

	refreshExerciseList();
}