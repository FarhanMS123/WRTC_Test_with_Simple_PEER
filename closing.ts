import Peer from 'simple-peer';
import wrtc from 'wrtc';
import chalk, { ChalkInstance } from 'chalk';

(async function(){
  console.log(chalk.green("Begin of instruction here."));

  const peer1 = new Peer({ initiator: true, wrtc });
  const peer2 = new Peer({ wrtc });

  peer1.on('signal', signal => {
    console.log(chalk.blueBright("PEER1 Signal"));
    peer2.signal(signal);
  });

  peer2.on('signal', signal => {
    console.log(chalk.red("PEER2 Signal"));
    peer1.signal(signal);
  });

  peer1.on('connect', () => console.log(chalk.blueBright("PEER1 Connected")));
  peer2.on('connect', () => console.log(chalk.red("PEER2 Connected")));

  // these two never called, instead jump to close
  peer1.on('end', () => console.log(chalk.blueBright("PEER1 End")));
  peer2.on('end', () => console.log(chalk.red("PEER2 End")));

  // when close, always destroyed
  peer1.on('close', () => console.log(chalk.blueBright("PEER1 Closed", "Is destroyed?", peer1.destroyed)));
  peer2.on('close', () => console.log(chalk.red("PEER2 Closed", "Is destroyed?", peer2.destroyed)));

  await new Promise((res, rej) => { setTimeout(res, 4000) });
  // peer1.end();
  // peer1.destroy();
  // peer2.end();
  peer2.destroy();
  console.log(chalk.green("Last instruction here."));
})();