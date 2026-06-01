function Snapshot(target, fValues, iValues, bValues){
	this.target = target;
	
	this.f = fValues;
	this.b = bValues;
	this.i = iValues;
}

Snapshot.prototype.update = function(f, i, b){
	var o,lo;
	var relevant = false;
	
	for(o=0, lo=f.length; o < lo; o++){
		if(f[o] != this.f[o]) relevant = true;
		this.f[o] = f[o];
	}
	
	for(o=0, lo=b.length; o < lo; o++){
		if(b[o] != this.b[o]) relevant = true;
		this.b[o] = b[o];
	}
	
	for(o=0, lo=i.length; o < lo; o++){
		if(i[o] != this.i[o]) relevant = true;
		this.i[o] = i[o];
	}
	
	if(!relevant) return false;
	
	return { 	't'  : this.target,
				'f' : f,
				'i' : i,
				'b' : b };
	
}