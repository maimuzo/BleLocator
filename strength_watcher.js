var noble = require('noble');
var BleLocator = require('./blelocator');

console.log('noble');

noble.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    noble.startScanning([], true); // everybody come on
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', function() {
  console.log('on -> scanStart');
});

noble.on('scanStop', function() {
  console.log('on -> scanStop');
});

noble.on('discover', function(peripheral) {
//  console.log('on -> discover: ' + peripheral);
	BleLocator.update(peripheral);
});

setInterval(function() {
	BleLocator.dump();
}, 5000);
