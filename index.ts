import inquirer from 'inquirer';
import Peer from 'simple-peer';
import wrtc from 'wrtc';

(async function() {
  const peer_type: "initiator" | "receiver" = (await inquirer.prompt([{
    name: "0",
    message: "Peer type:",
    type: "list",
    choices: ["initiator", "receiver"],
  }]))["0"];

  const peer = new Peer({ wrtc, initiator: peer_type == "initiator" });

  peer.on("signal", data => console.log("Signal Event", data));
  peer.on("data", data => console.log("Signal Event", data));

  (async function(){
    const send = await inquirer.prompt([
      {
        name: "emit_type",
        message: "Emit type:",
        type: "list",
        choices: ["signal", "data"]
      },
      {
        name: "data",
        message: "data",
        type: "editor"
      }
    ]);
  })();
})();