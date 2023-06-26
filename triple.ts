import inquirer from 'inquirer';
import Peer from 'simple-peer';
import wrtc from 'wrtc';

function createPeer(name: string, c_peer: Peer.Instance){
  const peer = new Peer({ wrtc, initiator: true });

  const fsig = data => {
    peer.signal(data);
  };

  c_peer.on("signal", fsig);

  peer.on("signal", data => {
    c_peer.signal(data);
  });

  peer.on("connect", data => {
    console.log(name + " Connected");
    c_peer.off("signal", fsig);
  });

  peer.on("data", data => {
    console.log("Data on " + name, data.toString());
  });

  return peer;
}

(async function() {
  const peer1 = new Peer({ wrtc, initiator: false });
  const peer2 = createPeer("PEER2", peer1);
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

  peer1.on("connect", data => {
    console.log("PEER1 Connected");
  });

  peer1.on("data", data => {
    console.log("Data on PEER1", data.toString());
  });

  peer2.on("connect", data => {
    peer3 = createPeer("PEER3", peer1);
    peer3.on("connect", data => {
      sendEmitter();
    });
  });
})();