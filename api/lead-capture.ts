import { createLeadCaptureHandler } from "../src/server/marketing/lead-capture.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createLeadCaptureHandler();
