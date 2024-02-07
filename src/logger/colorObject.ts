import pc from 'picocolors';

const picocolorsColors = ['magenta', 'blue', 'yellow', 'cyan'] as const;

export const colorObject = (obj: Record<never, unknown>, level = 0): string => {
  const colorIndex = level % picocolorsColors.length;
  const indentation = '  '.repeat(level); // Two spaces per level for indentation

  return `${pc.gray('{')}\n${Object.entries(obj).reduce(
    (acc, [key, value], i, arr) => {
      let coloredValue;
      if (typeof value === 'object' && value !== null) {
        coloredValue = colorObject(value, level + 1);
      } else {
        coloredValue = pc.green(JSON.stringify(value));
      }
      const colorFunction = picocolorsColors[colorIndex];
      const keyColor = level === 0 ? pc.bold(key) : key;
      acc += pc.green(
        `${indentation}  ${pc[colorFunction](keyColor)}: ${coloredValue}`,
      );

      if (i < arr.length - 1) {
        acc += ',';
      }
      acc += '\n';
      return acc;
    },
    '',
  )}${indentation}${pc.gray('}')}`;
};

// const chalkColors = [
//   "magentaBright",
//   "blueBright",
//   "yellowBright",
//   "cyanBright",
// ];

//   blackBright: enabled ? formatter("\x1b[90m", "\x1b[39m"): String,
//   redBright: enabled ? formatter("\x1b[91m", "\x1b[39m"): String,
//   greenBright: enabled ? formatter("\x1b[92m", "\x1b[39m"): String,
//   yellowBright: enabled ? formatter("\x1b[93m", "\x1b[39m"): String,
//   blueBright: enabled ? formatter("\x1b[94m", "\x1b[39m"): String,
//   magentaBright: enabled ? formatter("\x1b[95m", "\x1b[39m"): String,
//   cyanBright: enabled ? formatter("\x1b[96m", "\x1b[39m"): String,
//   whiteBright: enabled ? formatter("\x1b[97m", "\x1b[39m"): String,

// export const colorObjectChalk = (obj: Record<never, unknown>, level = 0): string => {
//   const colorIndex = level % chalkColors.length;
//   const indentation = "  ".repeat(level); // Two spaces per level for indentation
//
//   return `${chalk`{gray {}`}\n${Object.entries(obj).reduce(
//     (acc, [key, value], i, arr) => {
//       let coloredValue = value;
//       if (typeof value === "object" && value !== null) {
//         coloredValue = colorObject(value, level + 1);
//       } else {
//         coloredValue = chalk`{green ${JSON.stringify(value)}}`;
//       }
//       const addBold = level === 0 ? "bold." : "";
//       acc += `${indentation}  ${chalk`{${addBold}${chalkColors[colorIndex]} ${key}}: ${coloredValue}`}`;
//
//       if (i < arr.length - 1) {
//         acc += ",";
//       }
//       acc += "\n";
//       return acc;
//     },
//     "",
//   )}${indentation}${chalk`{gray \}}`}`;
// };
