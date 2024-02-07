import type { Elysia } from 'elysia';
import axios, { AxiosError } from 'axios';
import { getEnvOrFail } from '@/env';
import { NotFoundError, InvalidCookieSignature } from 'elysia';
import { Http } from '..';

export interface CurrentUser {
  userId: string;
  email: string;
  username: string;
  cookie: string;
}

export const sessionCookiePlugin = () => (app: Elysia) =>
  app.derive(async ({ set, cookie }) => {
    let currentUser: CurrentUser | undefined = undefined;
    if (!cookie.session.value) {
      set.status = 400;
      throw new NotFoundError('cookie not found');
    }
    console.log('session', cookie.session.value);

    try {
      const url = `${getEnvOrFail('AUTH_URL')}/current-user`;
      console.log('url', url);

      const { data } = await axios.get<{
        id: string;
        email: string;
        username: string;
      }>(url, {
        headers: { Cookie: `session=${cookie.session.value}` },
      });
      currentUser = {
        userId: data.id,
        email: data.email,
        username: data.username,
        cookie: cookie.session.value as string,
      };
      Http.log.info({ '❯': currentUser }, 'sessionCookiePlugin');
    } catch (e) {
      console.log('errorrr', e);
      if (e instanceof AxiosError) {
        const message = (e as AxiosError).message;
        Http.log.error({ message }, 'sessionCookiePlugin');
      }

      throw new InvalidCookieSignature(
        'session',
        'session cookie not authorized',
      );
    }
    return {
      currentUser,
    };
  });

// export const sessionCookiePlugin = new Elysia()
//   // .use(nodeModel)
//   // .guard({ body: "node.dto" })
//   .derive(({ set, cookie }) => {
//     let currentUser: CurrentUser | undefined = undefined;
//     const validateCookieHook = async () => {
//       // Get
//       if (!cookie.session.value) {
//         // Http.log.error("cookie not found");
//         set.status = 400;
//         return { message: "cookie not found" };
//       }
//
//       try {
//         const url = `${getEnvOrFail("AUTH_URL")}/current-user`;
//
//         const { data } = await axios.get<{
//           id: string;
//           email: string;
//           username: string;
//         }>(url, {
//           headers: { Cookie: `session=${cookie.session.value}` },
//         });
//         currentUser = {
//           userId: data.id,
//           email: data.email,
//           username: data.username,
//           cookie: cookie.session.value as string,
//         };
//         // Http.log.info({ "🌈": { ...currentUser } }, `auth success current user: `);
//       } catch (e) {
//         // const message = (e as AxiosError).message;
//         // Http.log.error({ message }, "auth failed");
//         set.status = 401;
//         return { message: "session cookie not authorized" };
//         // return c.json({ message: "session cookie not authorized" }, 401);
//       }
//     };
//     const getCurrentUser = () => {
//       if (!currentUser) {
//         throw new Error("No current user");
//       }
//       return currentUser;
//     };
//     return { validateCookieHook, getCurrentUser };
//   });

// const users = new Elysia({ prefix: "/user" })
//     .use(sessionCookiePlugin)
//     .get(
//         "/sign-in",
//         ({ getCurrentUser }) => {
//             console.log("currentUser", getCurrentUser());
//             return "sign-in";
//         },
//         {
//             beforeHandle: [
//                 ({ validateCookieHook }) => {
//                     return validateCookieHook();
//                 },
//                 // ({ validateBody }) => validateBody(),
//             ],
//         },
//     )
//     .post("/sign-in", ({ body }) => signIn(body), {
//         body: t.Object({
//             username: t.String({ minLength: 3, maxLength: 10 }),
//             password: t.String({ minLength: 3, maxLength: 10 }),
//         }),
//     })
//     .post("/sign-up", () => "sign-up")
//     .post("/profile", () => "profile");
//
// const app = new Elysia().get("/", () => "Hello Elysia");
// app.use(users).listen(3000);
// // app.group("/", (a) => a.use(users)).listen(3000);
//
// console.log(
//     `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
// );
