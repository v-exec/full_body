function Movement(id=3, sets=1, reps=1, repType=0, name=fulldata['movements'][3].name, type=fulldata['movements'][2].type, primary=fulldata['movements'][2].primary, secondary=fulldata['movements'][2].secondary, target=fulldata['movements'][2].target) {
	this.id = id;
	
	this.sets = sets;
	this.reps = reps;
	this.repType = repType;
	
	this.name = name;
	this.type = type;
	this.primary = primary;
	this.secondary = secondary;
	this.target = target;
}