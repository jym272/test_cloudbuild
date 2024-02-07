import { STATES } from 'mongoose';
import mongoose from 'mongoose';
import { getEnvOrFail } from '@/env';
import { ListModel } from './models';

export class Mongoose {
  private static instance?: Mongoose;

  public static start = async () => {
    if (this.instance) {
      throw new Error('Moongose has already been initialized');
    }
    this.instance = new Mongoose();
    await this.instance.connectToMongo();
    await this.instance.syncModelsIndexes();
  };

  public static op = () => {
    if (!this.instance) {
      throw new Error('Mongoose has not been initialized');
    }
    return this.instance;
  };

  private syncModelsIndexes = async () => {
    const models = [ListModel];
    for (const model of models) {
      await model.syncIndexes();
    }
  };
  private connectToMongo = async () => {
    const MONGO_URI = getEnvOrFail('MONGO_URI');
    await new Promise<void>((resolve, reject) => {
      mongoose
        .connect(MONGO_URI)
        .then(() => {
          console.info('\x1b[32m%s\x1b[0m', `🪿 Mongoose connected`);
          resolve();
        })
        .catch((e) => {
          console.error(
            '\x1b[31m%s\x1b[0m',
            `🪿 Mongoose initial connection failed`,
            (e as Error).message,
          );
          reject(e as Error);
        });
    });
  };

  public static isHealthy = () => {
    if (!this.instance) {
      console.error('isHealthy: Mongoose has not been initialized');
      return false;
    }
    return mongoose.connection.readyState === STATES.connected;
  };

  private stop = async () => {
    await mongoose.disconnect();
  };

  public static stop = async () => {
    await this.instance?.stop();
    this.instance = undefined;
    console.info('Mongoose has been stopped');
  };
}
