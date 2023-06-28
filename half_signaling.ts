import Peer from 'simple-peer';
import wrtc from 'wrtc';
import chalk, { ChalkInstance } from 'chalk';

(async () => {
  const peer1 = new Peer({ wrtc });
  const peer2 = new Peer({ wrtc, initiator: true });
  let peer3: Peer.Instance;

  let p1s = 2;

  peer1.on('signal', signal => {
    // accidentally, this become triple.ts
    if(p1s == 2) {
      peer2.signal(signal);
      console.log(chalk.blueBright("PEER #1 #2 Signaled"));
    } else {
      peer3.signal(signal);
      console.log(chalk.blueBright("PEER #1 #3 Signaled"));
    }
  });
  peer2.on('signal', signal => {
    console.log(chalk.red("PEER #2 Signaled"));
    peer1.signal(signal);
  });

  peer1.on('connect', () => console.log(chalk.blueBright("PEER #1 Connected")));
  peer2.on('connect', () => console.log(chalk.red("PEER #2 Connected")));

  peer1.on('end', () => console.log(chalk.blueBright("PEER #1 End")));
  peer2.on('end', () => console.log(chalk.red("PEER #2 End")));

  peer1.on('close', () => console.log(chalk.blueBright("PEER #1 Closed")));
  peer2.on('close', () => console.log(chalk.red("PEER #2 Closed")));

  await new Promise((res, rej) => { setTimeout(res, 4000) });

  console.log(chalk.magenta("#################################"))

  // try to comment this one
  p1s = 3;

  // this would cause error when peer1 or peer2 send signal to different peer
  peer3 = new Peer({ wrtc, initiator: true });
  peer3.on('signal', signal => {
    console.log(chalk.green("PEER #3 Signaled"));
    peer1.signal(signal);
  });

  peer3.on('connect', () => console.log(chalk.green("PEER #3 Connected")));
  peer3.on('close', () => console.log(chalk.green("PEER #3 Closed")));
})();