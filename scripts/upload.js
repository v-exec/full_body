drop.addEventListener('dragenter', handleDragEnter, false);
drop.addEventListener('dragover', handleDragOver, false);
drop.addEventListener('drop', handleFileDrop, false);
drop.addEventListener('dragleave', handleDragLeave, false);

//drop handler
function handleFileDrop(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var file = evt.dataTransfer.files[0];
	var reader = new FileReader();

	reader.onload = function(progressEvent){
		var lines = this.result.split('\n');

		for(var line = 0; line < lines.length; line++){
			movementStrings.push(lines[line]);
		}
		createMovements(movementStrings);
	};
	reader.readAsText(file);
}

//on drag enter
function handleDragEnter(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	if (!animating) {
		toggleAppearance(dropFeedback, true, 500);
		toggleAppearance(dropText, false, 500);
	}
	drop.style.backgroundColor = "var(--prettyBright)";
}

//on drag over, remove default behaviour
function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
}

//on drag leave
function handleDragLeave(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	if (!animating) {
		toggleAppearance(dropFeedback, false, 500);
		toggleAppearance(dropText, true, 500);
	}
	drop.style.backgroundColor = "var(--ultraBright)";
}