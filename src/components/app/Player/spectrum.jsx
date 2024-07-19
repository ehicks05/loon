import { usePlayerStore } from "@/common/PlayerContextProvider";

const OCTAVES = [
  { distance: -6, from: 0, to: 20 },
  { distance: -5, from: 20, to: 40 },
  { distance: -4, from: 40, to: 80 },
  { distance: -3, from: 80, to: 160 },
  { distance: -2, from: 160, to: 320 },
  { distance: -1, from: 320, to: 640 },
  { distance: 0, from: 640, to: 1280 },
  { distance: 1, from: 1280, to: 2560 },
  { distance: 2, from: 2560, to: 5120 },
  { distance: 3, from: 5120, to: 10240 },
  { distance: 4, from: 10240, to: 20480 },
  { distance: 5, from: 20480, to: 40960 },
];

function getFrequencyTiltAdjustment(binStartingFreq) {
  const temp = binStartingFreq ? binStartingFreq : 20;

  const octaveAdjustment = OCTAVES.find(
    (octave) => octave.from <= temp && octave.to >= temp,
  ).distance;

  const dBAdjustment = octaveAdjustment * 1.1;
  return 10 ** (dBAdjustment / 20);
}

function getMergedFrequencyBins(dataArray, binWidth) {
  const mergedData = [];
  let i = 0;
  let size = 1;
  while (i < dataArray.length && i * binWidth <= 22000) {
    let bins = Math.floor(size);

    const linearAdjustment = getFrequencyTiltAdjustment(i * binWidth);

    if (i + bins > dataArray.length) bins = dataArray.length - i;

    const slice = dataArray.slice(i, i + bins);
    const average = (array) => array.reduce((o1, o2) => o1 + o2) / array.length;
    const avg = average(slice);

    mergedData.push(avg * linearAdjustment);
    // console.log('i:' + i + '. bins:' + bins + '. db adjust:' + linearAdjustment + '. ' + (i * binWidth) + ' - ' + (i * binWidth + (bins * binWidth) - 1));
    i += bins;
    size *= 1.3;
  }

  return mergedData.slice(2); // the first 2 frequency bins tend to have very little energy
}

export default function renderSpectrumFrame() {
  const audioCtx = usePlayerStore.getState().audioCtx;
  const analyser = usePlayerStore.getState().analyser;
  const playbackState = usePlayerStore.getState().playbackState;

  requestAnimationFrame(() => renderSpectrumFrame());

  const canvas = document.getElementById("spectrumCanvas");

  if (
    !canvas ||
    !audioCtx ||
    !analyser ||
    audioCtx.current.state !== "running" ||
    playbackState !== "playing"
  )
    return;

  const ctx = canvas.getContext("2d");

  // Make it visually fill the positioned parent
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  // ...then set the internal size to match
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
  const binWidth =
    audioCtx.current.sampleRate / analyser.current.frequencyBinCount;
  analyser.current.getByteFrequencyData(dataArray);

  const mergedData = getMergedFrequencyBins(dataArray, binWidth);
  const bufferLength = mergedData.length;

  let x = 0;
  const barWidth = WIDTH / bufferLength - 1;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = mergedData[i] / (255 / HEIGHT);

    const red = (barHeight / HEIGHT) * 255;

    const r = red + 25 * (i / bufferLength);
    const g = 250 * (i / bufferLength);
    const b = 50;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}
