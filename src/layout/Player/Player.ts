import { useEffect, useRef } from 'react';
import { getTrackById } from '@/hooks/useLibraryStore';
import { type PlaybackState, usePlayerStore } from '@/hooks/usePlayerStore';
import { getPlaylistById } from '@/hooks/usePlaylistStore';
import {
	type PlaybackDirection,
	setSelectedTrackId,
	useUserStore,
} from '@/hooks/useUserStore';
import { getMaxSafeGain, scaleVolume } from './utils';
import renderSpectrumFrame from './spectrum';
import { getNewTrackId } from './trackDeterminationUtils';
import { useKeyboardControls } from './useKeyboardControls';

const API_URL = '/api';

export const Player = () => {
	const userState = useUserStore((state) => state);
	const {
		setElapsedTime,
		setDuration,
		playbackState,
		setPlaybackState,
		forcedElapsedTime,
		setAudioCtx,
		setAnalyser,
	} = usePlayerStore((state) => ({
		setElapsedTime: state.setElapsedTime,
		setDuration: state.setDuration,
		playbackState: state.playbackState,
		setPlaybackState: state.setPlaybackState,
		forcedElapsedTime: state.forcedElapsedTime,
		setAudioCtx: state.setAudioCtx,
		setAnalyser: state.setAnalyser,
	}));

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);
	const audioBufferSourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
	const fadeGainNodeRef = useRef<GainNode | null>(null); // fade out/in for pause/resume
	const trackGainNodeRef = useRef<GainNode | null>(null); // apply replaygain
	const userGainNodeRef = useRef<GainNode | null>(null); // apply user-controlled gain
	const bandsRef = useRef<BiquadFilterNode[]>([]);
	const analyserRef = useRef<AnalyserNode | null>(null);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.currentTime = forcedElapsedTime;
		}
	}, [forcedElapsedTime]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		function initAudio() {
			const audio = new Audio();
			audio.crossOrigin = '';
			audio.controls = false;
			audio.autoplay = false;
			audio.onended = () => changeTrack('next');
			audio.ondurationchange = () => setDuration(audio.duration);
			audio.onerror = () => console.log(audio.error);
			audio.onplaying = () => renderSpectrumFrame();
			audio.onpause = () => {};
			audio.ontimeupdate = () => setElapsedTime(audio.currentTime);

			if (userState.selectedTrackId) {
				audio.src = `${API_URL}/media/${userState.selectedTrackId}`;
			}

			document.body.appendChild(audio);
			return audio;
		}

		// create objects
		const audio = initAudio();
		const audioCtx = new AudioContext();
		const audioBufferSourceNode = new MediaElementAudioSourceNode(audioCtx, {
			mediaElement: audio,
		});

		const fadeGainNode = new GainNode(audioCtx);
		const trackGainNode = new GainNode(audioCtx);
		const userGainNode = new GainNode(audioCtx, {
			gain: scaleVolume(userState.volume),
		});

		const eqBands = userState.eqBands.map(
			(band) =>
				new BiquadFilterNode(audioCtx, {
					type: band.type,
					frequency: band.frequency,
					gain: band.gain,
				}),
		);

		const analyser = new AnalyserNode(audioCtx, { fftSize: 4096 });

		// connect nodes
		audioBufferSourceNode.connect(fadeGainNode);
		fadeGainNode.connect(userGainNode);
		userGainNode.connect(trackGainNode);
		trackGainNode.connect(eqBands[0]);

		eqBands.slice(0, eqBands.length - 1).forEach((_, i) => {
			eqBands[i].connect(eqBands[i + 1]);
		});
		eqBands[eqBands.length - 1].connect(analyser);

		analyser.connect(audioCtx.destination);

		// setup refs
		audioRef.current = audio;
		audioCtxRef.current = audioCtx;
		audioBufferSourceNodeRef.current = audioBufferSourceNode;
		fadeGainNodeRef.current = fadeGainNode;
		trackGainNodeRef.current = trackGainNode;
		userGainNodeRef.current = userGainNode;
		bandsRef.current = eqBands;
		analyserRef.current = analyser;

		setAudioCtx(audioCtxRef);
		setAnalyser(analyserRef);
	}, []);

	const changeTrack = (direction: PlaybackDirection) => {
		setSelectedTrackId(getNewTrackId(direction));
	};

	useKeyboardControls(playbackState, setPlaybackState, changeTrack);

	useEffect(() => {
		const trackId = userState.selectedTrackId;
		if (trackId) {
			initAudioSource();
		}
	}, [userState.selectedTrackId]);

	useEffect(() => {
		const playlist = getPlaylistById(userState.selectedPlaylistId);
		const loop = playlist?.playlistTracks.length === 1;
		if (audioRef.current) {
			audioRef.current.loop = loop;
		}
	}, [userState.selectedPlaylistId]);

	useEffect(() => {
		if (userGainNodeRef.current)
			userGainNodeRef.current.gain.value = scaleVolume(userState.volume);
	}, [userState.volume]);

	useEffect(() => {
		if (!audioRef.current) return;

		audioRef.current.muted = userState.muted;
	}, [userState.muted]);

	useEffect(() => {
		userState.eqBands.forEach((eqBand, i) => {
			const band = bandsRef.current[i];
			band.type = eqBand.type;
			band.frequency.value = eqBand.frequency;
			band.gain.value = eqBand.gain;
		});
	}, [userState.eqBands]);

	useEffect(() => {
		const handlePlaybackStateChange = (playbackState: PlaybackState) => {
			const audioCtx = audioCtxRef.current;
			const audio = audioRef.current;
			const fadeGainNode = fadeGainNodeRef.current;

			if (playbackState === 'paused') {
				fade(audioCtx, fadeGainNode, 'out', () => audioCtx?.suspend());
				return;
			}

			if (
				playbackState === 'playing' &&
				audio?.currentSrc &&
				audioCtx?.state === 'suspended'
			) {
				fade(audioCtx, fadeGainNode, 'in', () => {
					audio?.play();
					audioCtx?.resume();
				});
				return;
			}
		};

		handlePlaybackStateChange(playbackState);
	}, [playbackState]);

	const initAudioSource = async () => {
		const audioCtx = audioCtxRef.current;
		const audio = audioRef.current;
		const fadeNode = fadeGainNodeRef.current;
		const trackGainNode = trackGainNodeRef.current;
		setElapsedTime(0);

		const track = getTrackById(userState.selectedTrackId);
		if (!track || track.missingFile) {
			if (!track) console.log('no track found...');
			else if (track.missingFile) console.log('track is missing file...');
			changeTrack('next');
			return;
		}

		if (!audio) return;

		// set new audio source
		audio.src = `${API_URL}/media/${track.id}`;
		audio.load();

		if (trackGainNode) {
			trackGainNode.gain.value = getMaxSafeGain(
				Number(track.trackGainLinear),
				Number(track.trackPeak),
			);
		}

		if (playbackState === 'playing') {
			fade(audioCtx, fadeNode, 'in', () => audio?.play());
		}

		if (playbackState !== 'playing') {
			fade(audioCtx, fadeNode, 'out', () => audioCtx?.suspend());
		}
	};

	return null;
};

function fade(
	audioCtx: AudioContext | null,
	gainNode: GainNode | null,
	mode: 'in' | 'out',
	callback: () => void,
) {
	if (!audioCtx || !gainNode) {
		return;
	}

	const { currentTime } = audioCtx;
	const duration = 50;
	const nearZero = 0.0001;

	const from = mode === 'in' ? nearZero : gainNode.gain.value;
	gainNode.gain.setValueAtTime(from, currentTime);

	const to = mode === 'in' ? 1 : nearZero;
	gainNode.gain.exponentialRampToValueAtTime(to, currentTime + duration / 1000);

	setTimeout(callback, duration);
}
