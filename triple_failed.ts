import inquirer from 'inquirer';
import Peer from 'simple-peer';
import wrtc from 'wrtc';

(async function() {
  const peer1 = new Peer({ wrtc, initiator: true });
  const peer2 = new Peer({ wrtc, initiator: false });
  const peer3 = new Peer({ wrtc, initiator: false });

  let s_peer = "peer1";
  const s_peer2: any[] = [];
  const s_peer3: any[] = [];

  peer1.on("signal", data => {
    console.log("SIGNAL 1:", data);
    if(s_peer.match(/^(peer1|peer2)$/i)) peer2.signal(data);
    if(s_peer.match(/^(peer1|peer3)$/i)) peer3.signal(data);
  });

  peer2.on("signal", data => {
    console.log("SIGNAL 2:", data);
    s_peer2.push(data);

    if (s_peer.match(/^(peer1|peer2)$/i)){
      s_peer = "peer2";
      peer1.signal(s_peer2.shift());
    }
  });

  peer2.on("connect", data => {
    s_peer = "peer3";
    new Promise((res, rej) => {
      let sig;
      while(sig = s_peer3.shift() && sig){
        peer1.send(sig);
      }
    });
  });

  peer3.on("signal", data => {
    console.log("SIGNAL 3:", data);
    s_peer3.push(data);

    if (s_peer.match(/^(peer1|peer3)$/i)){
      s_peer = "peer3";
      peer1.signal(s_peer3.shift());
    }
  });

  async function sendEmitter(){
    const send = await inquirer.prompt([
      {
        name: "emitter",
        message: "Emit by:",
        type: "list",
        choices: ["initiator", "receiver 2", "receiver 3"]
      },
      {
        name: "data",
        message: "Send data:",
        type: "input"
      }
    ]);

    switch(send["emitter"]){
      case "initiator": peer1.send(send["data"]); break;
      case "receiver 2": peer2.send(send["data"]); break;
      case "receiver 3": peer3.send(send["data"]); break;
      default: sendEmitter();
    }
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

  peer3.on("data", data => {
    console.log("Data on Peer2:", data.toString());
    sendEmitter();
  });
})();