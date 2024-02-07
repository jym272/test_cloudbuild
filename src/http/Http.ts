import type { Elysia } from 'elysia';
import { logger as lg } from '@/logger';
import { ServerBuilder } from '.';
import { getEnvOrFail } from '@/env';

export class Http {
  private static instance?: Http;
  private readonly app: Elysia;
  static log = lg.child({}, { msgPrefix: '[HTTP] ' });

  private constructor() {
    this.app = ServerBuilder.create().addPlugins().addRoutes().build();
  }

  public static async start() {
    if (this.instance) {
      throw new Error('HttpServer has already been initialized');
    }
    this.instance = new Http();
    await this.instance.serve();
  }

  private serve = async () => {
    const port = Number(getEnvOrFail('PORT'));

    const waitForComplete = new Promise<void>((resolve) => {
      this.app.listen(port, (s) => {
        console.info(
          '\x1b[32m%s\x1b[0m',
          `🦊 Elysia is running at ${s.hostname}:${s.port}`,
        );
        resolve();
      });
    });
    await waitForComplete;
  };

  private stop = async () => {
    await this.app.stop();
  };

  public static async stop() {
    await this.instance?.stop();
    this.instance = undefined;
  }
}
