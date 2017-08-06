var Service;
var Characteristic;
var exec = require('child_process').exec;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-file-contactsensor', 'FileCoSensor', GarageCmdAccessory);
};

function GarageCmdAccessory(log, config) {
  this.log = log;
  this.name = config.name;
  this.openCommand = config.open;
  this.closeCommand = config.close;
  this.stateCommand = config.state;
  this.statusUpdateDelay = config.status_update_delay || 15;
}

GarageCmdAccessory.prototype.setState = function(isClosed, callback) {
  var accessory = this;
  var state = isClosed ? '0' : '1';
  var prop = state + 'Command';
  var command = accessory[prop];
  accessory.log('Commnand to run: ' + command);

  exec(
    command,
    {
      encoding: 'utf8',
      timeout: 10000,
      maxBuffer: 200*1024,
      killSignal: 'SIGTERM',
      cwd: null,
      env: null
    },
    function (err, stdout, stderr) {
      if (err) {
        accessory.log('Error: ' + err);
        callback(err || new Error('Error setting ' + accessory.name + ' to ' + state));
      } else {
        accessory.log('Set ' + accessory.name + ' to ' + state);
        accessory.timer = setTimeout(function() {
          if (stdout.indexOf('OPENING') > -1) {
            accessory.garageDoorService.setCharacteristic(Characteristic.ContactSensorState, Characteristic.ContactSensorState.CONTACT_NOT_DETECTED = 1);
          } else if (stdout.indexOf('CLOSING') > -1) {
            accessory.garageDoorService.setCharacteristic(Characteristic.ContactSensorState, Characteristic.ContactSensorState.CONTACT_DETECTED = 0);
          }
       }, accessory.statusUpdateDelay * 1000);
       callback(null);
     }
  });
};

GarageCmdAccessory.prototype.getState = function(callback) {
  var accessory = this;
  var command = accessory.stateCommand;

  exec(command, function (err, stdout, stderr) {
    if (err) {
      accessory.log('Error: ' + err);
      callback(err || new Error('Error getting state of ' + accessory.name));
    } else {
      var state = stdout.toString('utf-8').trim();
      accessory.log('State of ' + accessory.name + ' is: ' + state);
      callback(null, Characteristic.ContactSensorState[state]);
    }
  });
};

GarageCmdAccessory.prototype.getServices = function() {
  this.informationService = new Service.AccessoryInformation();
  this.garageDoorService = new Service.ContactSensor(this.name);

  this.informationService
  .setCharacteristic(Characteristic.Manufacturer, 'Garage Command')
  .setCharacteristic(Characteristic.Model, 'Homebridge Plugin')
  .setCharacteristic(Characteristic.SerialNumber, '001');

  this.garageDoorService.getCharacteristic(Characteristic.ContactSensorState)
  .on('set', this.setState.bind(this));

  if (this.stateCommand) {
    this.garageDoorService.getCharacteristic(Characteristic.ContactSensorState)
  .on('get', this.getState.bind(this));
    
    this.garageDoorService.getCharacteristic(Characteristic.ContactSensorState)
.on('set', this.setState.bind(this));
    
  }

  return [this.informationService, this.garageDoorService];
};
