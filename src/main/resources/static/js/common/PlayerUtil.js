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

function getFrequencyTiltAdjustment(binStartingFreq) {
    let temp = binStartingFreq ? binStartingFreq : 20;

    const octaves = [
        {from: 0,     to: 20,    distance: -6},
        {from: 20,    to: 40,    distance: -5},
        {from: 40,    to: 80,    distance: -4},
        {from: 80,    to: 160,   distance: -3},
        {from: 160,   to: 320,   distance: -2},
        {from: 320,   to: 640,   distance: -1},
        {from: 640,   to: 1280,  distance:  0},
        {from: 1280,  to: 2560,  distance:  1},
        {from: 2560,  to: 5120,  distance:  2},
        {from: 5120,  to: 10240, distance:  3},
        {from: 10240, to: 20480, distance:  4},
        {from: 20480, to: 40960, distance:  5}
    ];

    const octaveAdjustment = octaves.find(octave => octave.from <= temp && octave.to >= temp).distance;

    let dBAdjustment = octaveAdjustment * 1.1;
    return Math.pow(10, (dBAdjustment / 20));
}

function getMergedFrequencyBins(dataArray, binWidth) {
    const mergedData = [];
    let i = 0;
    let size = 1;
    while (true)
    {
        let bins = Math.floor(size);

        let linearAdjustment = getFrequencyTiltAdjustment(i * binWidth);

        if (i === dataArray.length || i * binWidth > 22000)
            break;

        if (i + bins > dataArray.length)
            bins = dataArray.length - i;

        let slice = dataArray.slice(i, i + bins);
        let average = (array) => array.reduce((o1, o2) => o1 + o2) / array.length;
        const avg = average(slice);

        mergedData.push(avg * linearAdjustment);
        // console.log('i:' + i + '. bins:' + bins + '. db adjust:' + linearAdjustment + '. ' + (i * binWidth) + ' - ' + (i * binWidth + (bins * binWidth) - 1));
        i += bins;
        size *= 1.3;
    }

    return mergedData.slice(2); // the first 2 frequency bins tend to have very little energy
}

export {isScrolledIntoView, scrollIntoView, getMaxSafeGain, scaleVolume, getFrequencyTiltAdjustment, getMergedFrequencyBins}