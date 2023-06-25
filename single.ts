import inquirer from 'inquirer';
import Peer from 'simple-peer';
import wrtc from 'wrtc';

(async function() {
  const peer1 = new Peer({ wrtc, initiator: true });
  const peer2 = new Peer({ wrtc, initiator: false });

  peer1.on("signal", data => {
    console.log("SIGNAL 1:", data);
    peer2.signal(data);
  });
  peer2.on("signal", data => {
    console.log("SIGNAL 2:", data);
    peer1.signal(data)
  });

  async function sendEmitter(){
    const send = await inquirer.prompt([
      {
        name: "emitter",
        message: "Emit by:",
        type: "list",
        choices: ["initiator", "receiver"]
      },
      {
        name: "data",
        message: "Send data:",
        type: "input"
      }
    ]);

    if(send["emitter"] == "initiator") peer1.send(send["data"]);
    else peer2.send(send["data"]);
  };

  peer1.on("connect", () => sendEmitter());

  peer1.on("data", data => {
    console.log("Data on Peer1:", data.toString());
    sendEmitter();
  });

  peer2.on("data", data => {
    console.log("Data on Peer2:", data.toString());
    sendEmitter();
  });

})();