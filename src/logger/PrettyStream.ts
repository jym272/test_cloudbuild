import pretty from 'pino-pretty';
import pino from 'pino';
import { colorObject } from '.';
import pc from 'picocolors';

const prettifyColor = (value: string | object) => {
  switch (typeof value) {
    case 'object':
      return colorObject(value);
    default:
      return pc.magenta(value);
  }
};

const formatTime = (timestamp: string | object) => {
  return pc.gray(
    `[${pc.green(String.fromCodePoint(0x23f1))} ${pc.blue(
      timestamp as string,
    )}]`,
  );
};

const stream = pretty({
  minimumLevel: 'trace',
  colorize: true,
  colorizeObjects: true,
  translateTime: `yyyy-mm-dd HH:MM:ss.l`,
  ignore: 'pid',
  crlf: true, // testear
  // TODO: apagar o crear logica para evitar usar chalk en produccion, no tiene el permofarmc
  customPrettifiers: {
    // The argument for this function will be the same
    // string that's at the start of the log-line by default:
    // time: (timestamp) =>
    //   chalk`{gray [}{green ${String.fromCodePoint(0x23f1)} }{blue ${
    //     timestamp as string
    //   }}{gray ]}`,
    time: formatTime,
    hostname: prettifyColor,

    // // The argument for the level-prettifier may vary depending
    // // on if the levelKey option is used or not.
    // // By default this will be the same numerics as the Pino default:
    // level: logLevel => `LEVEL: ${logLevel}`,
    //
    // // other prettifiers can be used for the other keys if needed, for example
    // hostname: hostname => colorGreen(hostname),
    // pid: pid => colorRed(pid),
    // name: name => colorBlue(name),
    // caller: caller => colorCyan(caller),
    // Afecta directamente a las props de un objeto
    // http: prettifyQuerys,
    // error: prettifyQuerys,
    '🌈': prettifyColor,
    '☟': prettifyColor,
    '↳': prettifyColor,
    '☆': prettifyColor,
    '✍': prettifyColor,
    '❯': prettifyColor,
  },
  // messageKey: 'no_message_key'
  // (log: LogDescriptor, messageKey: string, levelLabel: string) => string
  // messageFormat: (log: LogDescriptor, messageKey: string, levelLabel: string) => {
  //     return `s`;
  // }
});
// pino.Logger<pretty.PrettyStream>

// type CustomLogger = pino.Logger<pretty.PrettyStream>;

export const logger = pino(stream);
logger.level = 'info'; // De hecho es el Default, se declara de forma explícita.
process.env.LOG_LEVEL && (logger.level = process.env.LOG_LEVEL);
