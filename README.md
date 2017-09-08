# homebridge-file-contactsensor
[Homebridge](https://github.com/nfarina/homebridge) plugin that exposes file values as a contact sensor.

## What it does

This plugin will be exposed in HomeKit as a contact sensor of your choice. At the moment, you may expose it as Window, Garage, Contact Sensor, Door or as a Blind. The state of the accessory is determined by the response of the file that is called (which is defined in config.json)

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `sudo npm install -g https://github.com/GatoPharaoh/homebridge-file-contactsensor`
3. Update your configuration file. See `config.json` in this repository for a sample.

## Configuration

Configuration sample:

```json
"accessories": [
  {
    "accessory": "FileCoSensor",
    "name": "Window",
    "state": "./check_state.sh"
  }
]

```
## Explanation:

Field                   | Description
------------------------|------------
**accessory**           | Must be "FileCoSensor".
**name**                | Name of the Contact Sensor
**state**               | state command.  Example: ./check_state.sh

The state command should return the following terms: `CONTACT_NOT_DETECTED` (sensor is opened), `CONTACT_DETECTED` (sensor is closed)


## Thanks

This plugin is based on [@apexad](https://github.com/apexad/)'s plugin [homebridge-garagedoor-command](https://github.com/apexad/homebridge-garagedoor-command)
