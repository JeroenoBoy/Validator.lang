
export class Peeker {
	public readonly input: string;
	public index: number;
	private lineStartIndex: number;
	public line: number;


	public get lineChar() {
		return this.index - this.lineStartIndex;
	}


	constructor(input: string) {
		this.input = input;
		this.index = 0;
		this.line = 0;
		this.lineStartIndex = 0;
	}


	public isFinished(): boolean { return this.index >= this.input.length }


	public peek(foreseight: number = 0) {
		return this.input[this.index + foreseight]
	}


	public previous() {
		return this.input[this.index - 1]
	}


	public consume() {
		const char = this.input[this.index++];
		if (char == '\n') {
			this.line++;
			this.lineStartIndex = this.index + (this.peek() == '\r' ? -1 : 0);
		}
		return char;
	}


	public consumeSpaces() {
		while (/[ \t\n]/.test(this.peek())) this.consume();
	}


	public consumeWord() {
		let word = '';
		while (/[a-zA-Z0-9_!#\$%&]/.test(this.peek())) word += this.consume();
		return word;
	}


	public peekWord() {
		let i = this.index;
		let word = '';
		while (/[a-zA-Z0-9_!#\$%&]/.test(this.peek(i))) word += this.peek(i++);
		return word;
	}
}