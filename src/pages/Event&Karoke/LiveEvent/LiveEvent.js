import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "d587007d5651476fb9ebd2f0a7a387ea";
const token =
  "006d587007d5651476fb9ebd2f0a7a387eaIACTah4A+4emczVgYByblHB8Kt6b5DpxspzOI3VpJAaeiaMlb/oAAAAAEACgcVr/JEF8YgEAAQAkQXxi";

export const config = { mode: "rtc", codec: "vp8", appId, token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Event";
