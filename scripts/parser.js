//parses through array of lines (moves) and creates all movements
function createMovements(moves) {
	//list of all possible attributes
	var attributes = [
	'circuit',
	'timer',
	'movements'
	];

	//manage information retrieval
	var currentKey;
	var newKey;
	var value;
	var atMoves = false;
	var id = 0;

	//go through each line
	for (var i = 0; i < moves.length; i++) {

		//skip lines starting with '//' and empty lines
		if (moves[i].substring(0, 2) === '//' || moves[i].trim() === '') continue;

		//when at movement list, stop looking for attributes
		if (!atMoves) {
			//go through each attribute and see if line begins with its declaration
			for (var j = 0; j < attributes.length; j++) {
				if (moves[i].substring(0, attributes[j].length + 1) === attributes[j] + ':') {

					//once key has been found, update currentKey, and get the line's value
					currentKey = attributes[j];
					value = moves[i].substring(currentKey.length + 1, moves[i].length);
					value = value.trim();
				}
			}
		} else {
			var m = moves[i];
			m = m.split(",");
			
			for (var j = 0; j < m.length; j++) {
				m[j] = m[j].trim();
			}

			var mov = new Movement(m[0]);
			if (m[1]) mov.reps = m[1];
			if (m[2]) mov.sets = m[2];
			mov.populateMovement(mov);
			movements.push(mov);
		}

		//assign value to attribute for slide
		switch (currentKey) {
			case 'circuit':
				if (value == "true") circuit = true;
				if (value == "false") circuit = false;
				break;

			case 'timer':
				if (value == "true") timer = true;
				if (value == "false") timer = false;
				break;

			case 'movements':
				atMoves = true;
				break;
		}
	}

	sequenceMovements();
}