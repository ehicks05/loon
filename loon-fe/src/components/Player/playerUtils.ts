import { clamp } from "lodash-es";

function scaleVolume(inputDecibel: number) {
  const dB = clamp(inputDecibel, -60, 0);
  return dB === -60 ? 0 : 10 ** (dB / 20);
}

function getMaxSafeGain(trackGainLinear: number, trackPeak: number) {
  if (!trackPeak) return 1;

  const maxSafeGain = 1 / trackPeak;

  if (maxSafeGain < trackGainLinear) {
    console.log({ trackGainLinear, trackPeak, maxSafeGain });
    return maxSafeGain;
  }

  return trackGainLinear;
}

export { getMaxSafeGain, scaleVolume };
