function Movement(name) {
	this.name = name;
	this.reps = null;
	this.sets = 1;
	this.id;
	
	this.reference = [];
	this.type = [];
	this.primary = [];
	this.secondary = [];
	this.target = [];

	//if movement has multiple options, make an array for each
	//populate primary, secondary, and target muscle groups
	//format reps
	this.populateMovement = function(self) {
		self.name = self.name.split('/');
		if (self.reps != null) self.reps = self.reps.split('/');

		for (var i = 0; i < self.name.length; i++) {
			self.name[i] = self.name[i].trim();
		}

		//find referenced exercises
		for (var i = 0; i < self.name.length; i++) {
			for (var j = 0; j < supportedMovements.length; j++) {
				if (self.name[i].toLowerCase() == supportedMovements[j].name.toLowerCase()) {
					self.reference.push(j);
					self.type.push(supportedMovements[j].type);
					self.primary.push(supportedMovements[j].primary);
					self.secondary.push(supportedMovements[j].secondary);
					self.target.push(supportedMovements[j].target);
				}
			}
		}

		if (self.reps != null) {
			for (var i = 0; i < self.reps.length; i++) {
				if (self.reps[i] == 0) self.reps[i] = null;
			}
		}
	}
}

//picks one of multiple movement options' index (if has multiple options)
function pickMovementIndex(movement) {
	if (movement.name[1]) return getRandomIntInclusive(0, movement.name.length - 1);
	else return 0;
}