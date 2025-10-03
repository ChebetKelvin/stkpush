import { createCookieSessionStorage } from "react-router";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one

    cookie: {
      name: "__session",

      // all of these are optional

      // domain: "reactrouter.com",

      // Expires can also be set (although maxAge overrides it when used in combination).

      // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!

      //

      // expires: new Date(Date.now() + 60_000),

      httpOnly: true,

      maxAge: 60 * 60 * 24,

      path: "/",

      sameSite: "lax",

      secrets: ["s3cret1"],

      secure: true,
    },
  });
export function setSuccessMessage(session, message) {
  session.flash("toastMessage", { message, type: "success" });
}
export function setErrorMessage(session, message) {
  session.flash("toastMessage", { message, type: "error" });
}
export { getSession, commitSession, destroySession };
