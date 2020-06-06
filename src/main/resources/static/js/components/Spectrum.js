

export default function Spectrum() {
    function getFrequencyTiltAdjustment(binStartingFreq) {
        let temp = binStartingFreq;
        if (temp === 0) temp = 20;

        let isAbove = temp >= 1000;
        let octavesFrom1000 = 0;
        while (true)
        {
            if (isAbove)
            {
                temp /= 2;
                if (temp < 1000)
                    break;
            }
            if (!isAbove)
            {
                temp *= 2;
                if (temp > 1000)
                    break;
            }
            octavesFrom1000++;
        }

        let dBAdjustment = (isAbove ? 1 : -1) * octavesFrom1000 * 1.1;
        let linearAdjustment = Math.pow(10, (dBAdjustment / 20));
        return linearAdjustment;
    }

    function getMergedFrequencyBins() {
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const binWidth = this.audioCtx.sampleRate / this.analyser.frequencyBinCount;
        this.analyser.getByteFrequencyData(dataArray);

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

    function renderSpectrumFrame() {
        requestAnimationFrame(renderSpectrumFrame);

        const canvas = document.getElementById("spectrumCanvas");
        if (!canvas)
            return;

        const ctx = canvas.getContext("2d");

        // Make it visually fill the positioned parent
        canvas.style.width ='100%';
        canvas.style.height='100%';
        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const mergedData = getMergedFrequencyBins();
        const bufferLength = mergedData.length;

        let x = 0;
        const barWidth = (WIDTH / bufferLength) - 1;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = mergedData[i] / (255 / HEIGHT);

            const red = (barHeight / HEIGHT) * 255;

            const r = red + (25 * (i/bufferLength));
            const g = 250 * (i/bufferLength);
            const b = 50;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    return (
        <canvas id='spectrumCanvas' height={100} width={150}> </canvas>
    );
}