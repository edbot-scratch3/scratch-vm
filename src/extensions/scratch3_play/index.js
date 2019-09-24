/*
 * Edbot Play&Code Scratch 3.0 extension.
 */
 
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const edbot = require("edbot");

const blockIconURI =  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTUuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTI4IDEyODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0UxNkI1QTsiIGN4PSI2NCIgY3k9IjY0IiByPSI2NCIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0QxNjM1NDsiIGQ9Ik0xMTUuMDYxLDEwMi41NzhMOTkuNjA1LDY0LjI1M2MtMC4wMjgtMC4xNTktMC4wOC0wLjMxNC0wLjE1OC0wLjQ2OCAgIGMtMC4wNzMtMC41MjItMC4zOTYtMS4wMzItMS4wMDQtMS40MjlMNDUuNDYyLDI3LjY0NGMtMS4zOC0wLjkwNC0yLjUwOS0wLjI5NC0yLjUwOSwxLjM1NnYwLjUxMnYwLjUxMlY5OXYwLjUxMlYxMDBsMTAuNzk2LDI3LjE3MiAgIEM1Ny4wODgsMTI3LjcxLDYwLjUxLDEyOCw2NCwxMjhDODQuODU1LDEyOCwxMDMuMzc2LDExOC4wMiwxMTUuMDYxLDEwMi41Nzh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTQyLjk1MywyOWMwLTEuNjUsMS4xMjktMi4yNiwyLjUwOS0xLjM1Nmw1Mi45ODEsMzQuNzEyYzEuMzgsMC45MDQsMS4zOCwyLjM4NCwwLDMuMjg5ICAgbC01Mi45ODEsMzQuNzExYy0xLjM4LDAuOTA0LTIuNTA5LDAuMjk1LTIuNTA5LTEuMzU1VjI5eiIvPgo8L2c+Cjwvc3ZnPgo=";

const CLIENT = "Scratch 3.0";

var USER = "";
var robots = {};	// map robot name to client object
var names = [];		// sorted robot names

class Scratch3PlayBlocks {
    static get EXTENSION_ID() {
        return "play";
    }

	constructor(runtime) {
		console.log("Edbot Play&Code extension constructor");
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

				var names = client.getRobotNames("play");
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
									var names = client.getRobotNames("play");
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
							if(!confirm("No Edbot Plays found.\nContinue in Demo mode?")) {
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
			var names = client.getRobotNames("play");
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
			id: Scratch3PlayBlocks.EXTENSION_ID,
			name: "Edbot Play&Code",
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
							type: ArgumentType.NUMBER,
							menu: "portsMenu",
							defaultValue: 1
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
							defaultValue: "1/50/2/50"
						}
					}
				},
				"---",
				{
					opcode: "setControllerLED",
					text: "[NAME] controller light [LED]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						LED: {
							type: ArgumentType.NUMBER,
							menu: "ledMenu",
							defaultValue: 0
						},
					}
				},
				"---",
				{
					opcode: "setBuzzerNote",
					text: "[NAME] buzzer pitch [PITCH] duration [DURATION]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						PITCH: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						},
						DURATION: {
							type: ArgumentType.NUMBER,
							defaultValue: 3
						}
					}
				},
				{
					opcode: "setBuzzerMelody",
					text: "[NAME] buzzer melody [MELODY]",
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						MELODY: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						}
					}
				},
				"---",
				{
					opcode: "getLeftIR",
					text: "[NAME] left [UNITS_IR]",
					blockType: BlockType.REPORTER,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						UNITS_IR: {
							type: ArgumentType.NUMBER,
							menu: "unitsIRMenu",
							defaultValue: 0
						}
					}
				},
				{
					opcode: "getRightIR",
					text: "[NAME] right [UNITS_IR]",
					blockType: BlockType.REPORTER,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						UNITS_IR: {
							type: ArgumentType.NUMBER,
							menu: "unitsIRMenu",
							defaultValue: 0
						}
					}
				},
				{
					opcode: "getCentreIR",
					text: "[NAME] centre [UNITS_IR]",
					blockType: BlockType.REPORTER,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						UNITS_IR: {
							type: ArgumentType.NUMBER,
							menu: "unitsIRMenu",
							defaultValue: 0
						}
					}
				},
				{
					opcode: "getClapCount",
					text: "[NAME] clap count [CLAP]",
					blockType: BlockType.REPORTER,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							menu: "nameMenu",
							defaultValue: names[0]
						},
						CLAP: {
							type: ArgumentType.NUMBER,
							menu: "clapMenu",
							defaultValue: 0
						}
					}
				},
				{
					opcode: "clapCountReset",
					text: "[NAME] clap count reset",
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
				ledMenu: [
					{ text: "off", value: "0" },
					{ text: "red", value: "1" },
					{ text: "blue", value: "256" },
					{ text: "both", value: "257" }
				],
				portsMenu: [
					{ text: "port-1", value: "1" },
					{ text: "port-2", value: "2" }
				],
				unitsIRMenu: [
					{ text: "IR-sensor", value: "0" },
					{ text: "IR-raw-value", value: "1" }
				],
				clapMenu: [
					{ text: "live", value: "0" },
					{ text: "last", value: "1" }
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

	setControllerLED(args) {
		const { NAME, LED } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.setCustom(NAME, "79/2/" + LED)
				.then(function(status) {
					console.log(status);
				});
	}

	setBuzzerNote(args) {
		const { NAME, PITCH, DURATION } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.setBuzzer(NAME, PITCH + "/" + DURATION)
				.then(function(status) {
					console.log(status);
				});
	}

	setBuzzerMelody(args) {
		const { NAME, MELODY } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.setBuzzer(NAME, MELODY + "/255")
				.then(function(status) {
					console.log(status);
				});
	}

	getLeftIR(args) {
		const { NAME, UNITS_IR } = args;
		try {
			var client = this.getClient(NAME);
			if(UNITS_IR == 0) {
				var raw = client.getData().robots[NAME].reporters["leftIR"];
				return edbot.util.rawToCM50Dist(raw);
			} else {
				return client.getData().robots[NAME].reporters["leftIR"];
			}
		} catch(e) {
			return 0;
		}
	}

	getRightIR(args) {
		const { NAME, UNITS_IR } = args;
		try {
			var client = this.getClient(NAME);
			if(UNITS_IR == 0) {
				var raw = client.getData().robots[NAME].reporters["rightIR"];
				return edbot.util.rawToCM50Dist(raw);
			} else {
				return client.getData().robots[NAME].reporters["rightIR"];
			}
		} catch(e) {
			return 0;
		}
	}

	getCentreIR(args) {
		const { NAME, UNITS_IR } = args;
		try {
			var client = this.getClient(NAME);
			if(UNITS_IR == 0) {
				var raw = client.getData().robots[NAME].reporters["centreIR"];
				return edbot.util.rawToCM50Dist(raw);
			} else {
				return client.getData().robots[NAME].reporters["centreIR"];
			}
		} catch(e) {
			return 0;
		}
	}

	getClapCount(args) {
		const { NAME, CLAP } = args;
		try {
			var client = this.getClient(NAME);
			if(CLAP == 0) {
				return client.getData().robots[NAME].reporters["clapCountLive"];
			} else {
				return client.getData().robots[NAME].reporters["clapCountLast"];
			}
		} catch(e) {
			return 0;
		}
	}

	clapCountReset(args) {
		const { NAME } = args;
		var client = this.getClient(NAME);
		if(client != null)
			return client.setCustom(NAME, "86/1/0")
				.then(function(status) {
					console.log(status);
				});
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

module.exports = Scratch3PlayBlocks;