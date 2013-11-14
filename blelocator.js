
var RssiHolderPrototype = {
	capacity: 50,
	add: function(rssi){
		// keep rssis length
		if(this.capacity <= this.rssis.length){
			this.rssis.shift();
		}
		this.rssis.push(Number(rssi));
		this.updateCount++;
	},
	average: function(range){
		if(this.rssis.length == 0){
			return 0;
		}
		var sum = 0;
		if(range > this.rssis.length){
			range = this.rssis.length;
		}
		for(var i=0; i<range; i++){
			sum += this.rssis[i];
		}
		return sum / this.rssis.length;
	},
	variance: function(){
	    var ave = this.average(this.capacity);

	    var varia = 0;
	    for (var i=0; i<this.rssis.length; i++) {
	        varia = varia + Math.pow(this.rssis[i] - ave, 2);
	    }
	    return (varia / this.rssis.length);
	},
	standardDeviation: function(){
	    var varia = this.variance();
	    return Math.sqrt(varia);
	},
	is: function(otherUuid){
		return this.uuid == otherUuid;
	},
	dump: function(){
		var log = '{localName: ' + this.localName + ', uuid: ' + this.uuid;
		log = log + ', average: ' + this.round(this.average(this.capacity), 0.01) + ', sd: ' + this.round(this.standardDeviation(), 0.01);
		log = log + ', rssi histories: [' + this.rssis + ']';
		var deltaSec = (new Date() - this.updateResetTime) / 1000;
		log = log + ', ' + this.round((this.updateCount / deltaSec), 0.1) + ' times/sec';
		this.updateResetTime = new Date();
		this.updateCount = 0;
		log = log + '}';
		console.log(log);
	},
	round: function(n, unit){
		var k = 1 / unit;
		return Math.round(n * k) / k;
	}
}
function RssiHolder(localName, uuid){
	this.localName = localName,
	this.uuid = uuid;
	this.rssis = [];
	this.updateCount = 0;
	this.updateResetTime = new Date();
}
RssiHolder.prototype = RssiHolderPrototype;

function BleLocator(){
	this.holders = [];
}
BleLocator.prototype.update = function(peripheral){
	var found = false;
	for(var i=0; i<this.holders.length; i++){
		if(this.holders[i].is(peripheral.uuid)){
			// update
			this.holders[i].add(peripheral.rssi);
			found = true;
			break;
		}
	}
	if(false == found){
		// add new object
		var r = new RssiHolder(peripheral.advertisement.localName, peripheral.uuid);
		r.add(peripheral.rssi);
		this.holders.push(r);
	}
};
BleLocator.prototype.dump = function(){
	for(var i=0; i<this.holders.length; i++){
		this.holders[i].dump();
	}
};


module.exports = new BleLocator();