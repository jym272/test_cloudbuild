type Dependencies = 'dev' | 'prod';
const install = (dep: Dependencies) => {
  const checkUpdates = Bun.spawnSync(
    [
      'bunx',
      'npm-check-updates',
      '--target=minor',
      '--jsonUpgraded',
      `--dep=${dep}`,
    ],
    {
      env: { ...process.env },
    },
  );
  const dependencies = JSON.parse(
    checkUpdates.stdout.toString().trim(),
  ) as Record<string, string>;
  const keys = Object.keys(dependencies);
  if (keys.length === 0) {
    console.log(`\x1b[35m\x1b[1m---- No ${dep}Dependencies to update\x1b[0m`);
    return;
  }
  console.log(
    `\x1b[35m\x1b[1m---- ${dep}Dependencies ${
      keys as unknown as string
    } ----\x1b[0m`,
  );

  if (keys.length > 0) {
    console.log(`\x1b[31m-- Removiendo ${dep} dependencies --\x1b[0m`);
    keys.forEach((key) => {
      const proc = Bun.spawnSync(['bun', 'remove', key], {
        env: { ...process.env },
      });
      console.log(proc.stdout.toString());
    });
    console.log(`\x1b[34m-- Añadiendo ${dep} dependencies --\x1b[0m`);
    keys.forEach((key) => {
      const proc = Bun.spawnSync(
        ['bun', 'add', `${dep == 'dev' ? '-D' : ''}`, key],
        {
          env: { ...process.env },
        },
      );
      console.log(proc.stdout.toString());
    });
  }
};

(() => {
  install('dev');
  install('prod');
})();
