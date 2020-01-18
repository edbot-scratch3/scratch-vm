/*
 * Edbot EV3 Scratch 3.0 extension.
 */
 
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const edbot = require("edbot");

const blockIconURI =  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUwLjIgKDU1MDQ3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5ldjMtYmxvY2staWNvbjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJldjMtYmxvY2staWNvbiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9ImV2MyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS41MDAwMDAsIDMuNTAwMDAwKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS1wYXRoIiBzdHJva2U9IiM3Qzg3QTUiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgeD0iMC41IiB5PSIzLjU5IiB3aWR0aD0iMjgiIGhlaWdodD0iMjUuODEiIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtcGF0aCIgc3Ryb2tlPSIjN0M4N0E1IiBmaWxsPSIjRTZFN0U4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHg9IjIuNSIgeT0iMC41IiB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtcGF0aCIgc3Ryb2tlPSIjN0M4N0E1IiBmaWxsPSIjRkZGRkZGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHg9IjIuNSIgeT0iMTQuNSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjEzIj48L3JlY3Q+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNC41LDEwLjUgTDE0LjUsMTQuNSIgaWQ9IlNoYXBlIiBzdHJva2U9IiM3Qzg3QTUiIGZpbGw9IiNFNkU3RTgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PC9wYXRoPgogICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLXBhdGgiIGZpbGw9IiM0MTQ3NTciIHg9IjQuNSIgeT0iMi41IiB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtcGF0aCIgZmlsbD0iIzdDODdBNSIgb3BhY2l0eT0iMC41IiB4PSIxMy41IiB5PSIyMC4xMyIgd2lkdGg9IjIiIGhlaWdodD0iMiIgcng9IjAuNSI+PC9yZWN0PgogICAgICAgICAgICA8cGF0aCBkPSJNOS4wNiwyMC4xMyBMMTAuNTYsMjAuMTMgQzEwLjgzNjE0MjQsMjAuMTMgMTEuMDYsMjAuMzUzODU3NiAxMS4wNiwyMC42MyBMMTEuMDYsMjEuNjMgQzExLjA2LDIxLjkwNjE0MjQgMTAuODM2MTQyNCwyMi4xMyAxMC41NiwyMi4xMyBMOS4wNiwyMi4xMyBDOC41MDc3MTUyNSwyMi4xMyA4LjA2LDIxLjY4MjI4NDcgOC4wNiwyMS4xMyBDOC4wNiwyMC41Nzc3MTUzIDguNTA3NzE1MjUsMjAuMTMgOS4wNiwyMC4xMyBaIiBpZD0iU2hhcGUiIGZpbGw9IiM3Qzg3QTUiIG9wYWNpdHk9IjAuNSI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNMTguOTEsMjAuMTMgTDIwLjQyLDIwLjEzIEMyMC42OTYxNDI0LDIwLjEzIDIwLjkyLDIwLjM1Mzg1NzYgMjAuOTIsMjAuNjMgTDIwLjkyLDIxLjYzIEMyMC45MiwyMS45MDYxNDI0IDIwLjY5NjE0MjQsMjIuMTMgMjAuNDIsMjIuMTMgTDE4LjkyLDIyLjEzIEMxOC4zNjc3MTUzLDIyLjEzIDE3LjkyLDIxLjY4MjI4NDcgMTcuOTIsMjEuMTMgQzE3LjkxOTk3MjYsMjAuNTgxNTk3IDE4LjM2MTYyNDUsMjAuMTM1NDg0IDE4LjkxLDIwLjEzIFoiIGlkPSJTaGFwZSIgZmlsbD0iIzdDODdBNSIgb3BhY2l0eT0iMC41IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOS40MjAwMDAsIDIxLjEzMDAwMCkgcm90YXRlKC0xODAuMDAwMDAwKSB0cmFuc2xhdGUoLTE5LjQyMDAwMCwgLTIxLjEzMDAwMCkgIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjIzLDE3LjUgTDUsMTcuNSBDNC43MjM4NTc2MywxNy41IDQuNSwxNy4yNzYxNDI0IDQuNSwxNyBMNC41LDE0LjUgTDEwLjUsMTQuNSBMOC42NSwxNy4yOCBDOC41NTQ2Njk2MSwxNy40MTc5MDgyIDguMzk3NjUwMDYsMTcuNTAwMTU2NiA4LjIzLDE3LjUgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjN0M4N0E1IiBvcGFjaXR5PSIwLjUiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTE4LjE1LDE4Ljg1IEwxNy42NSwxOS4zNSBDMTcuNTUyMzQxNiwxOS40NDQwNzU2IDE3LjQ5ODAzMzksMTkuNTc0NDE0MiAxNy41LDE5LjcxIEwxNy41LDIwIEMxNy41LDIwLjI3NjE0MjQgMTcuMjc2MTQyNCwyMC41IDE3LDIwLjUgTDE2LjUsMjAuNSBDMTYuMjIzODU3NiwyMC41IDE2LDIwLjI3NjE0MjQgMTYsMjAgQzE2LDE5LjcyMzg1NzYgMTUuNzc2MTQyNCwxOS41IDE1LjUsMTkuNSBMMTMuNSwxOS41IEMxMy4yMjM4NTc2LDE5LjUgMTMsMTkuNzIzODU3NiAxMywyMCBDMTMsMjAuMjc2MTQyNCAxMi43NzYxNDI0LDIwLjUgMTIuNSwyMC41IEwxMiwyMC41IEMxMS43MjM4NTc2LDIwLjUgMTEuNSwyMC4yNzYxNDI0IDExLjUsMjAgTDExLjUsMTkuNzEgQzExLjUwMTk2NjEsMTkuNTc0NDE0MiAxMS40NDc2NTg0LDE5LjQ0NDA3NTYgMTEuMzUsMTkuMzUgTDEwLjg1LDE4Ljg1IEMxMC42NTgyMTY3LDE4LjY1MjE4NjMgMTAuNjU4MjE2NywxOC4zMzc4MTM3IDEwLjg1LDE4LjE0IEwxMi4zNiwxNi42NSBDMTIuNDUwMjgwMywxNi41NTI4NjE3IDEyLjU3NzM5NjEsMTYuNDk4MzgzNSAxMi43MSwxNi41IEwxNi4yOSwxNi41IEMxNi40MjI2MDM5LDE2LjQ5ODM4MzUgMTYuNTQ5NzE5NywxNi41NTI4NjE3IDE2LjY0LDE2LjY1IEwxOC4xNSwxOC4xNCBDMTguMzQxNzgzMywxOC4zMzc4MTM3IDE4LjM0MTc4MzMsMTguNjUyMTg2MyAxOC4xNSwxOC44NSBaIiBpZD0iU2hhcGUiIGZpbGw9IiM3Qzg3QTUiIG9wYWNpdHk9IjAuNSI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNMTAuODUsMjMuNDUgTDExLjM1LDIyLjk1IEMxMS40NDc2NTg0LDIyLjg1NTkyNDQgMTEuNTAxOTY2MSwyMi43MjU1ODU4IDExLjUsMjIuNTkgTDExLjUsMjIuMyBDMTEuNSwyMi4wMjM4NTc2IDExLjcyMzg1NzYsMjEuOCAxMiwyMS44IEwxMi41LDIxLjggQzEyLjc3NjE0MjQsMjEuOCAxMywyMi4wMjM4NTc2IDEzLDIyLjMgQzEzLDIyLjU3NjE0MjQgMTMuMjIzODU3NiwyMi44IDEzLjUsMjIuOCBMMTUuNSwyMi44IEMxNS43NzYxNDI0LDIyLjggMTYsMjIuNTc2MTQyNCAxNiwyMi4zIEMxNiwyMi4wMjM4NTc2IDE2LjIyMzg1NzYsMjEuOCAxNi41LDIxLjggTDE3LDIxLjggQzE3LjI3NjE0MjQsMjEuOCAxNy41LDIyLjAyMzg1NzYgMTcuNSwyMi4zIEwxNy41LDIyLjU5IEMxNy40OTgwMzM5LDIyLjcyNTU4NTggMTcuNTUyMzQxNiwyMi44NTU5MjQ0IDE3LjY1LDIyLjk1IEwxOC4xNSwyMy40NSBDMTguMzQwNTcxNCwyMy42NDQ0MjE4IDE4LjM0MDU3MTQsMjMuOTU1NTc4MiAxOC4xNSwyNC4xNSBMMTYuNjQsMjUuNjUgQzE2LjU0OTcxOTcsMjUuNzQ3MTM4MyAxNi40MjI2MDM5LDI1LjgwMTYxNjUgMTYuMjksMjUuOCBMMTIuNzEsMjUuOCBDMTIuNTc3Mzk2MSwyNS44MDE2MTY1IDEyLjQ1MDI4MDMsMjUuNzQ3MTM4MyAxMi4zNiwyNS42NSBMMTAuODUsMjQuMTUgQzEwLjY1OTQyODYsMjMuOTU1NTc4MiAxMC42NTk0Mjg2LDIzLjY0NDQyMTggMTAuODUsMjMuNDUgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjN0M4N0E1IiBvcGFjaXR5PSIwLjUiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTIxLjUsMjcuNSBMMjYuNSwyNy41IEwyNi41LDMxLjUgQzI2LjUsMzIuMDUyMjg0NyAyNi4wNTIyODQ3LDMyLjUgMjUuNSwzMi41IEwyMS41LDMyLjUgTDIxLjUsMjcuNSBaIiBpZD0iU2hhcGUiIHN0cm9rZT0iI0NDNEMyMyIgZmlsbD0iI0YxNUEyOSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=';

const CLIENT = "Scratch 3.0";

var USER = "";
var robots = {};	// map robot name to client object
var names = [];		// sorted robot names

class Scratch3EdbotEV3Blocks {
    static get EXTENSION_ID() {
        return "eev3";
    }

	constructor(runtime) {
		console.log("Edbot EV3 extension constructor");
        runtime.on("PROJECT_STOP_ALL", this.stopAll.bind(this));
	}

	test(host, port) {
		//
		// Pass a zero length user to the ES to tell it to use the logged in user -
		// we can't get the user in a browser!
		//
		// Older versions of the ES will close the connection with path info error
		// if passed a zero length user. In that case default to "Scratcher".
		//
		return new edbot.EdbotClient(host, port, {
			onclose: function(event) {
				if(event.code == 4001) {
					USER = "Scratcher";
				}
			}
		})
		.connect()
		.then(function(client) {
			if(client && client.getConnected()) {
				var found = client.getData().user.match(/.+ <(.+)@.+>/);
				if(found && found.length > 1) {
					USER = found[1];
				}
				client.disconnect();
			}
			if(USER.length < 1) {
				// Shouldn't happen..
				USER = "Scratcher";
			}
		});
	}

	init() {
		var instance = this;
		var client = null;
		var host = "127.0.0.1";
		var port = 8080;

		return instance.test(host, port)
		.then(function() {
			return new edbot.EdbotClient(host, port, {
				user: USER,
				client: CLIENT,
				onopen: function(event) {
					console.log("Connected to server " + host + ":" + port);
				},
				onclose: function(event) {
					console.log("Closed connection to server " + host + ":" + port);
					if(event.code != 1000) {
						// Reconnect if required.
						instance.reconnect(host, port);
					}
				}
			})
			.connect()
			.then(function(response) {
				client = response;

				// Server version check!
				var version = "";
				try {
					version = client.getData()["server"]["version"];
				} catch(err) {}
				if(!version.startsWith("5")) {
					throw "Requires Edbot Software version 5+";
				}

				var names = client.getRobotNames("ev3");
				for(var i = 0; i < names.length; i++) {
					robots[names[i]] = client;
				}
				return Promise.resolve(client.getRemoteServers());
			})
			.then(function(response) {
				if(Object.keys(robots).length < 1) {
					// Can now safely disconnect from local server.
					client.disconnect();
				}
				if(response.status.success) {
					var promises = [];
					var servers = response.data;
					for(var i = 0; i < servers.length; i++) {
						var host = servers[i].host;
						var port = servers[i].port;
						promises.push(new Promise(
							function(resolve, reject) {
								return new edbot.EdbotClient(host, port, {
									user: USER,
									client: CLIENT,
									onopen: function(event) {
										console.log("Connected to server " + host + ":" + port);
									},
									onclose: function(event) {
										console.log("Closed connection to server " + host + ":" + port);
										if(event.code != 1000) {
											// Reconnect if required.
											instance.reconnect(host, port);
										}
									}
								})
								.connect()
								.then(function(client) {
									var names = client.getRobotNames("ev3");
									for(var i = 0; i < names.length; i++) {
										robots[names[i]] = client;
									}
									if(names.length < 1) {
										client.disconnect();
									}
									return resolve();
								})
							}
						));
					}
					return Promise.all(promises)
					.then(function(promises) {
						if(Object.keys(robots).length == 0) {
							if(!confirm("No Edbot EV3 robots found.\nContinue in Demo mode?")) {
								return Promise.reject();
							}
							instance.demoMode();
						}
						names = Object.keys(robots).sort();
						return Promise.resolve();
					});
				}
			})
			.catch(err => {
				console.log(err);
				if(!confirm("Unable to connect to the Edbot Software.\nContinue in Demo mode?")) {
					return Promise.reject();
				}
				instance.demoMode();
				return Promise.resolve();
			});
		});
	}

	reconnect(host, port) {
		var instance = this;

		console.log("Reconnecting to server " + host + ":" + port);
		return new edbot.EdbotClient(host, port, {
			user: USER,
			client: CLIENT,
			onopen: function(event) {
				console.log("Connected to server " + host + ":" + port);
			},
			onclose: function(event) {
				console.log("Closed connection to server " + host + ":" + port);
				if(event.code != 1000) {
					// Reconnect if required.
					instance.reconnect(host, port);
				}
			}
		})
		.connect()
		.then(function(client) {
			var names = client.getRobotNames("ev3");
			for(var i = 0; i < names.length; i++) {
				robots[names[i]] = client;
			}
		})
		.catch(err => {
			instance.reconnect(host, port);
		});
	}

	getClient(name) {
		if(name in robots) {
			return robots[name];
		}
		return null;
	}

	demoMode() {
		robots["Demo"] = null;
		names = Object.keys(robots).sort();
	}

	getInfo() {
		return {
			id: Scratch3EdbotEV3Blocks.EXTENSION_ID,
			name: "Edbot EV3",
            blockIconURI: blockIconURI,
			blocks: [
				{
					opcode: "setMotor",
					text: "[NAME] set [PORT] motor speed [SPEED] [DIRECTION]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						PORT: {
							type: ArgumentType.STRING,
							menu: "motorPortsMenu",
							defaultValue: "A"
						},
						SPEED: {
							type: ArgumentType.NUMBER,
							defaultValue: 100
						},
						DIRECTION: {
							type: ArgumentType.NUMBER,
							menu: "directionMenu",
							defaultValue: -1
						}
					}
				},
				{
					opcode: "setServoTorque",
					text: "[NAME] set [PORT] motor [TOGGLE]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						PORT: {
							type: ArgumentType.STRING,
							menu: "motorPortsMenu",
							defaultValue: "A"
						},
						TOGGLE: {
							type: ArgumentType.NUMBER,
							menu: "toggleMenu",
							defaultValue: 0
						}
					}
				},
				{
					opcode: "setServoPosition",
					text: "[NAME] set [PORT] motor position [ANGLE] speed [SPEED]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						PORT: {
							type: ArgumentType.STRING,
							menu: "motorPortsMenu",
							defaultValue: "A"
						},
						ANGLE: {
							type: ArgumentType.NUMBER,
							defaultValue: 180
						},
						SPEED: {
							type: ArgumentType.NUMBER,
							defaultValue: 100
						}
					}
				},
				{
					opcode: "setMotors",
					text: "[NAME] set motor speeds [PATH]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						PATH: {
							type: ArgumentType.STRING,
							defaultValue: "A/50/B/50"
						}
					}
				},
				{
					opcode: "setTorque",
					text: "[NAME] set motors [PATH]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						PATH: {
							type: ArgumentType.STRING,
							defaultValue: "A/0/B/0"
						}
					}
				},
				{
					opcode: "setPosition",
					text: "[NAME] set motor positions [PATH]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						PATH: {
							type: ArgumentType.STRING,
							defaultValue: "A/100/180/B/-100/180"
						}
					}
				},
				"---",
				{
					opcode: "playTone",
					text: "[NAME] play tone [PITCH] duration [DURATION] volume [VOLUME]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						PITCH: {
							type: ArgumentType.NUMBER,
							defaultValue: 500
						},
						DURATION: {
							type: ArgumentType.NUMBER,
							defaultValue: 1.0
						},
						VOLUME: {
							type: ArgumentType.NUMBER,
							defaultValue: 50
						}
					}
				},
				{
					opcode: "playSoundFile",
					text: "[NAME] play sound file [FILE] volume [VOLUME]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						FILE: {
							type: ArgumentType.STRING,
							defaultValue: "./ui/DownloadSucces"
						},
						VOLUME: {
							type: ArgumentType.NUMBER,
							defaultValue: 100
						}
					}
				},
				{
					opcode: "stopSound",
					text: "[NAME] stop sound",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						}
					}
				},
				"---",
				{
					opcode: "getSensor",
					text: "[NAME] [PORT] sensor [TYPE]",
					blockType: BlockType.REPORTER,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						PORT: {
							type: ArgumentType.STRING,
							menu: "sensorPortsMenu",
							defaultValue: "1"
						},
						TYPE: {
							type: ArgumentType.STRING,
							menu: "sensorTypeMenu",
							defaultValue: "US"
						}
					}
				},
				{
					opcode: "getMotor",
					text: "[NAME] [PORT] motor [TYPE]",
					blockType: BlockType.REPORTER,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						PORT: {
							type: ArgumentType.STRING,
							menu: "motorPortsMenu",
							defaultValue: "A"
						},
						TYPE: {
							type: ArgumentType.STRING,
							menu: "motorTypeMenu",
							defaultValue: "RP"
						}
					}
				},
				"---",
				{
					opcode: "say",
					text: "[NAME] say [TEXT]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						TEXT: {
							type: ArgumentType.STRING,
							defaultValue: "Hello!"
						}
					}
				},
				{
					opcode: "sayWait",
					text: "[NAME] say [TEXT] until done",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						TEXT: {
							type: ArgumentType.STRING,
							defaultValue: "Hello!"
						}
					}
				},
				{
					opcode: "getCurrentWord",
					text: "[NAME] current word",
					blockType: BlockType.REPORTER,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						}
					}
				},
				"---",
				{
					opcode: "reset",
					text: "[NAME] reset",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						}
					}
				},
				{
					opcode: "getStatus",
					text: "[NAME] [STATUS]",
					blockType: BlockType.BOOLEAN,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						STATUS: {
							type: ArgumentType.NUMBER,
							menu: "statusMenu",
							defaultValue: 0
						}
					}
				}
			],
			menus: {
				nameMenu: names.map(name => ({ text: name, value: name })),
				directionMenu: [
					{ text: "clockwise", value: "-1" },
					{ text: "anti-clockwise", value: "1" }
				],
				toggleMenu: [
					{ text: "off", value: "0" },
					{ text: "on", value: "1" }
				],
				motorPortsMenu: [
					{ text: "port-A", value: "A" },
					{ text: "port-B", value: "B" },
					{ text: "port-C", value: "C" },
					{ text: "port-D", value: "D" }
				],
				motorTypeMenu: [
					{ text: "relative-position", value: "RP" }
				],
				sensorPortsMenu: [
					{ text: "port-1", value: "1" },
					{ text: "port-2", value: "2" },
					{ text: "port-3", value: "3" },
					{ text: "port-4", value: "4" }
				],
				sensorTypeMenu: [
					{ text: "ultrasonic-cm", value: "US" },
					{ text: "raw-value", value: "RAW" }
				],
				statusMenu: [
					{ text: "connected", value: "0" },
					{ text: "enabled", value: "1" }
				]
			}
		};
	}

	setMotor(args) {
		const { NAME, PORT, SPEED, DIRECTION } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.setServoSpeed(NAME, PORT + "/" + (SPEED * DIRECTION))
				.then(function(status) {
					console.log(status);
				});
	}

	setServoTorque(args) {
		const { NAME, PORT, TOGGLE } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.setServoTorque(NAME, PORT + "/" + TOGGLE)
				.then(function(status) {
					console.log(status);
				});
	}

	setServoPosition(args) {
		const { NAME, PORT, ANGLE, SPEED } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.setServoPosition(NAME, PORT + "/" + SPEED + "/" + ANGLE)
				.then(function(status) {
					console.log(status);
				});
	}

	setMotors(args) {
		const { NAME, PATH } = args;
		var parts = PATH.split("/");
		if((parts.length % 2) != 0) {
			console.log("Invalid number of parameters");
			return;
		}
		var path = "";
		for(i = 0; i < parts.length; i += 2) {
			if(i > 0) {
				path += "/";
			}
			path += parts[i] + "/" + parts[i + 1];
		}
		var client = this.getClient(NAME);
		if(client != null)
			return client.setServoSpeed(NAME, path)
				.then(function(status) {
					console.log(status);
				});
	}

	setTorque(args) {
		const { NAME, PATH } = args;
		var parts = PATH.split("/");
		if((parts.length % 2) != 0) {
			console.log("Invalid number of parameters");
			return;
		}
		var path = "";
		for(i = 0; i < parts.length; i += 2) {
			if(i > 0) {
				path += "/";
			}
			path += parts[i] + "/" + parts[i + 1];
		}
		var client = this.getClient(NAME);
		if(client != null)
			return client.setServoTorque(NAME, path)
				.then(function(status) {
					console.log(status);
				});
	}

	setPosition(args) {
		const { NAME, PATH } = args;
		var parts = PATH.split("/");
		if((parts.length % 3) != 0) {
			console.log("Invalid number of parameters");
			return;
		}
		var path = "";
		for(i = 0; i < parts.length; i += 3) {
			if(i > 0) {
				path += "/";
			}
			path += parts[i] + "/" + parts[i + 1] + "/" + parts[i + 2];
		}
		var client = this.getClient(NAME);
		if(client != null)
			return client.setServoPosition(NAME, path)
				.then(function(status) {
					console.log(status);
				});
	}

	playTone(args) {
		const { NAME, VOLUME, PITCH, DURATION } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.setBuzzer(NAME, VOLUME + "/" + PITCH + "/" + (DURATION * 1000))
				.then(function(status) {
					console.log(status);
				});
	}

	playSoundFile(args) {
		const { NAME, VOLUME, FILE } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.setBuzzer(NAME, VOLUME + "/" + FILE.replace(/\//g, "%2F"))
				.then(function(status) {
					console.log(status);
				});
	}

	stopSound(args) {
		const { NAME } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.setBuzzer(NAME, "off")
				.then(function(status) {
					console.log(status);
				});
	}

	getSensor(args) {
		const { NAME, PORT, TYPE } = args;
		try {
			var type = TYPE;
			if(type == "RAW") {
				type = "US";
			}
			var client = this.getClient(NAME);
			var port = "port" + PORT + type;
			var arr = client.getData().robots[NAME].reporters;
			if(typeof arr[port] === 'undefined') {
				return 0;
			} else {
				return client.getData().robots[NAME].reporters[port];
			}
		} catch(e) {
			return 0;
		}
	}

	getMotor(args) {
		const { NAME, PORT, TYPE } = args;
		try {
			var client = this.getClient(NAME);
			var port = "port" + PORT + TYPE;
			var arr = client.getData().robots[NAME].reporters;
			if(typeof arr[port] === 'undefined') {
				return 0;
			} else {
				return client.getData().robots[NAME].reporters[port];
			}
		} catch(e) {
			return 0;
		}
	}

	say(args) {
		const { NAME, TEXT } = args;
		var client = this.getClient(NAME);
		if(client != null) {
			client.say(NAME, TEXT)
				.then(function(status) {
					console.log(status);
				});
			return Promise.resolve();
		}
	}

	sayWait(args) {
		const { NAME, TEXT } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.say(NAME, TEXT)
				.then(function(status) {
					console.log(status);
				});
	}

	getCurrentWord(args) {
		const { NAME } = args;
		try {
			var client = this.getClient(NAME);
			var word = client.getData().robots[NAME].reporters["speechCurrentWord"];
			if(word != null) {
				return word;
			}
			return "";
		} catch(e) {
			return "";
		}
	}

	reset(args) {
		const { NAME } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.reset(NAME)
				.then(function(status) {
					console.log(status);
				});
	}

	getStatus(args) {
		const { NAME, STATUS } = args;
		try {
			var client = this.getClient(NAME);
			if(STATUS == 0) {
				return client.getData().robots[NAME].connected;
			} else if(STATUS == 1) {
				return client.getData().robots[NAME].enabled;
			} else {
				return false;
			}
		} catch(e) {
			return false;
		}
	}

	stopAll() {
		for(var i = 0; i < names.length; i++) {
			this.reset( { NAME: names[i] });
		}
    }
}

module.exports = Scratch3EdbotEV3Blocks;