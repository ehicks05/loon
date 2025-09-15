const formatTime = (_input: number) => {
	const secs = Math.round(_input);
	const minutes = Math.floor(secs / 60) || 0;
	const seconds = Math.round(secs - minutes * 60) || 0;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export { formatTime };
