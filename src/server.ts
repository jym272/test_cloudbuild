import { Mongoose } from '@/database';
import { Http } from '@/http';

void (async () => {
  try {
    // await Mongoose.start();
    await Http.start();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();

(() => {
  // https://en.wikipedia.org/wiki/Signal_(IPC)#Default_action
  // SIGHUP  -> 1  -> it means the controlling terminal has been closed
  // SIGINT  -> 2  -> ctrl + c
  // SIGTERM -> 15 -> docker stop
  ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((signal) => {
    process.on(signal, async (event) => {
      console.info(
        '\x1b[31m%s\x1b[0m',
        `${event} signal. ${String.fromCodePoint(
          0x1f44b,
        )} Server is shutting down. Goodbye!`,
      );
      await Http.stop();
      await Mongoose.stop();
      process.exit(0);
    });
  });
})();
