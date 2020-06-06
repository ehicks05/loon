function isScrolledIntoView(el) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    // Partially visible elements return true:
    return elemTop < window.innerHeight && elemBottom >= 0;
}

// scroll to the now-playing track (if it isn't already in view)
function scrollIntoView(trackId)
{
    const el = document.getElementById('track' + trackId);
    if (el && !isScrolledIntoView(el))
    {
        location.href = '#track' + trackId;
        window.scrollBy(0, -50);
    }
}

function scaleVolume(dB)
{
    if (dB > 0) dB = 0;
    if (dB < -60) dB = -60;

    let level = Math.pow(10, (dB / 20));
    if (dB === -60)
        level = 0;

    return level;
}

function getMaxSafeGain(trackGainLinear, trackPeak)
{
    if (!trackPeak)
        return trackGainLinear;

    let maxSafeGain = 1 / trackPeak;

    if (maxSafeGain < trackGainLinear)
    {
        console.log('Whoa there! Track replaygain is ' + trackGainLinear +
            ', but with a track peak of ' + trackPeak + ', we can only adjust gain by ' + maxSafeGain + '.');

        return maxSafeGain;
    }

    return trackGainLinear;
}

export {isScrolledIntoView, scrollIntoView, getMaxSafeGain, scaleVolume}