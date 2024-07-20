import _ from "lodash";

function isScrolledIntoView(el: Element) {
  const rect = el.getBoundingClientRect();
  // Partially visible elements return true:
  return rect.top < window.innerHeight && rect.bottom >= 0;
}

// scroll to the now-playing track (if it isn't already in view)
function scrollIntoView(trackId: string) {
  const el = document.getElementById(`track${trackId}`);
  if (el && !isScrolledIntoView(el)) {
    window.location.href = `#track${trackId}`;
    window.scrollBy(0, -50);
  }
}

function scaleVolume(inputDecibel: number) {
  const dB = _.clamp(inputDecibel, -60, 0);
  return dB === -60 ? 0 : 10 ** (dB / 20);
}

function getMaxSafeGain(trackGainLinear: number, trackPeak: number) {
  if (!trackPeak) return trackGainLinear;

  const maxSafeGain = 1 / trackPeak;

  if (maxSafeGain < trackGainLinear) {
    console.log(
      `rg: ${trackGainLinear}, peak: ${trackPeak}, maxSafeGain: ${maxSafeGain}`,
    );

    return maxSafeGain;
  }

  return trackGainLinear;
}

export { isScrolledIntoView, scrollIntoView, getMaxSafeGain, scaleVolume };
