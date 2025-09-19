interface FetchErrorInfo {
	path: string;
	params?: Record<string, string | number | boolean>;
}

export class FetchError extends Error {
	info;

	constructor(message: string, info: FetchErrorInfo) {
		super(message);
		this.info = info;
	}
}