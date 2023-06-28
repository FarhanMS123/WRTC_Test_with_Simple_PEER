import inquirer from 'inquirer';
import Peer from 'simple-peer';
import wrtc from 'wrtc';
import chalk, { ChalkInstance } from 'chalk';

function createPeer(name: string, color: ChalkInstance, c_peer: Peer.Instance){
  const peer = new Peer({ wrtc, initiator: true });

  console.log(color(name + " Initiated"));

  const fsig = data => {
    peer.signal(data);
  };

  c_peer.on("signal", fsig);

  peer.on("signal", data => {
    console.log(color(name + " Signal"));
    c_peer.signal(data);
  });

  peer.on("connect", data => {
    console.log(color(name + " Connected"));
    c_peer.off("signal", fsig);
  });

  peer.on("data", data => console.log(color("Data on " + name), color(data.toString())));

  peer.on("error", data => console.log(color(name + " Error"), color(data)));

  peer.on("close", data => console.log(color(name + " Closed.")));

  return peer;
}

(async function() {
  const peer1 = new Peer({ wrtc, initiator: false });
  const peer2 = createPeer("PEER2", chalk.green, peer1);
  let peer3: Peer.Instance;

  async function sendEmitter(){
    const send = await inquirer.prompt([
      {
        name: "emitter",
        message: "Emit by:",
        type: "list",
        choices: ["PEER 1", "PEER 2", "PEER 3"]
      },
      {
        name: "data",
        message: "Send data:",
        type: "input"
      }
    ]);

    switch(send["emitter"]){
      case "PEER 1": peer1.send(send["data"]); break;
      case "PEER 2": peer2.send(send["data"]); break;
      case "PEER 3": peer3.send(send["data"]); break;
      default: sendEmitter();
    }
  };

  peer1.on("signal", data => console.log("PEER1 Signal"));

  peer1.on("connect", data => {
    console.log("PEER1 Connected");
  });

  peer1.on("data", data => {
    console.log("Data on PEER1", data.toString());
    sendEmitter();
  });

  peer2.on("connect", data => {
    peer3 = createPeer("PEER3", chalk.red, peer1);
    peer3.on("connect", data => {
      sendEmitter();
    });
    peer3.on("data", data => sendEmitter());
  });

  peer2.on("data", data => sendEmitter());
})();