export default class Randomizer {
	private static _lastId: number = 0;
	private static readonly _prefix: string = 'e';

	public static next = (): string => {
		this._lastId++;
		return `${this._prefix}${this._lastId}`;
	}
}
