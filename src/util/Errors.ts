import { Peeker } from '../Parsing/Peeker';


export class LexError extends Error {

	public line: number;
	public char: number;

	constructor(peeker: Peeker, message: string) {
		super(message);
		this.line = peeker.line;
		this.char = peeker.lineChar;
		this.message += ` on ${this.line}:${this.char}`
		this.name = 'LexError';
	}

}
export class ParseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ParseError'
	}
}