import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "d587007d5651476fb9ebd2f0a7a387ea";
const token =
  "006d587007d5651476fb9ebd2f0a7a387eaIAADYqN1Kl9dXe5ziJCiiSOjJLtEQk+/ShAhzuX7+cDs5qMlb/oAAAAAEADKF8m84edpYgEAAQDg52li";

export const config = { mode: "rtc", codec: "vp8", appId, token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Event";
