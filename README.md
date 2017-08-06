# homebridge-file-contactsensor
[Homebridge](https://github.com/nfarina/homebridge) plugin that exposes file values as a contact sensor.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-file-contactsensor`
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
**accessory**           | Must be "FileCoSensor". (required)
**name**                | Name of the Contact Sensor
**state**               | state command.  Example: ./check_state.sh

The state command should return the following terms: `CONTACT_NOT_DETECTED` (sensor is opened), `CONTACT_DETECTED` (sensor is closed)


## Thanks

This plugin is based on @apexad plugin [homebridge-garagedoor-command](https://github.com/apexad/homebridge-garagedoor-command)
