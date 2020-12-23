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

	var str = "";

	if (negative) str += "-";

	if (includeHours) str += hours + ":" + minutes + ":" + rest;
	else str += minutes + ":" + rest;

	return str;
}