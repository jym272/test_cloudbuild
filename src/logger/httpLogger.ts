import Elysia from 'elysia';
import pc from 'picocolors';
import { Http } from '@/http';

let logBeforeFlag = false;

const logBefore = (method: string, url: string) => {
  if (logBeforeFlag) return;
  const logStr: string[] = ['<--'];

  logStr.push(methodString(method));

  const pathname = new URL(url).pathname;
  if (pathname.includes('internal/health')) return;
  logStr.push(pathname);

  Http.log.info(logStr.join(' '));
  logBeforeFlag = true;
};

export const httpLogger = () =>
  new Elysia({
    name: '@grotto/logysia',
  })
    .onRequest((ctx) => {
      logBefore(ctx.request.method, ctx.request.url);
      ctx.store = { ...ctx.store, beforeTime: process.hrtime.bigint() };
    })
    .onBeforeHandle((ctx) => {
      logBefore(ctx.request.method, ctx.request.url);
      ctx.store = { ...ctx.store, beforeTime: process.hrtime.bigint() };
    })
    .onAfterHandle(({ request, store, set }) => {
      logBeforeFlag = false;
      const logStr: string[] = ['-->'];
      if (request.headers.get('X-Forwarded-For')) {
        logStr.push(`[${pc.cyan(request.headers.get('X-Forwarded-For'))}]`);
      }

      logStr.push(methodString(request.method));

      const pathname = new URL(request.url).pathname;

      if (pathname.includes('internal/health')) return;
      logStr.push(pathname);

      logStr.push(pc.green(String(set.status)));

      const beforeTime = (store as { beforeTime: bigint }).beforeTime;

      logStr.push(durationString(beforeTime));

      Http.log.info(logStr.join(' '));
    })
    .onError(({ request, error, store }) => {
      logBeforeFlag = false;
      const logStr: string[] = ['-->'];

      logStr.push(methodString(request.method));

      logStr.push(new URL(request.url).pathname);

      if ('status' in error) {
        logStr.push(pc.red(String(error.status)));
      }

      const beforeTime: bigint = (store as { beforeTime: bigint }).beforeTime;

      logStr.push(durationString(beforeTime));

      Http.log.error(logStr.join(' '));
    });

function durationString(beforeTime: bigint) {
  const now = process.hrtime.bigint();
  const timeDifference = now - beforeTime;
  const nanoseconds = Number(timeDifference);

  const durationInMicroseconds = (nanoseconds / 1e3).toFixed(0); // Convert to microseconds
  const durationInMilliseconds = (nanoseconds / 1e6).toFixed(0); // Convert to milliseconds
  let timeMessage = '';

  if (nanoseconds >= 1e9) {
    const seconds = (nanoseconds / 1e9).toFixed(2);
    timeMessage = `${seconds}s`;
  } else if (nanoseconds >= 1e6) {
    timeMessage = `${durationInMilliseconds}ms`;
  } else if (nanoseconds >= 1e3) {
    timeMessage = `${durationInMicroseconds}µs`;
  } else {
    timeMessage = `${nanoseconds}ns`;
  }

  return timeMessage;
}

function methodString(method: string) {
  switch (method) {
    case 'GET':
      // Handle GET request
      return pc.white('GET');

    case 'POST':
      // Handle POST request
      return pc.yellow('POST');

    case 'PUT':
      // Handle PUT request
      return pc.blue('PUT');

    case 'DELETE':
      // Handle DELETE request
      return pc.red('DELETE');

    case 'PATCH':
      // Handle PATCH request
      return pc.green('PATCH');

    case 'OPTIONS':
      // Handle OPTIONS request
      return pc.gray('OPTIONS');

    case 'HEAD':
      // Handle HEAD request
      return pc.magenta('HEAD');

    default:
      // Handle unknown request method
      return method;
  }
}
