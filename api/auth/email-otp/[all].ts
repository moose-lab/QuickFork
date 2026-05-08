import { createAuthRouteHandler } from "../../../src/server/auth-node-handler.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createAuthRouteHandler("/api/auth/email-otp");
