import { Annotation, AnnotationArgument } from '../Annotation';
import { LexError } from '../util/Errors';
import { Peeker } from './Peeker';

export type LexedResult = { [key: string]: LexedNode[] };
export type LexedNode = {
	type: string;
	name: string;
	children?: LexedNode[];
	annotations: Annotation[];
}


export class Lexer {
	private constructor() { }


	public static lex(input: string) {
		const result: LexedResult = {};
		const peeker = new Peeker(input);

		while (!peeker.isFinished()) {
			const name = peeker.consumeWord();
			if (result[name]) throw new LexError(peeker, 'Duplicate valdiator name ' + name);

			peeker.consumeSpaces();
			if (peeker.consume() != '{') throw new LexError(peeker, 'Missing \'{\'');
			peeker.consumeSpaces();

			result[name] = this.lexNode(peeker);
			peeker.consumeSpaces();
		}

		return result;
	}


	public static lexNode(peeker: Peeker): LexedNode[] {
		const nodes = new Array<LexedNode>();

		while (peeker.peek() != '}') {
			//	@ts-ignore
			const node: LexedNode = {};

			//	Getting name and type

			node.type = peeker.consumeWord();
			peeker.consumeSpaces();
			node.name = peeker.consumeWord();
			peeker.consumeSpaces();
			node.annotations = [];

			//	Parsing annotations

			while (peeker.peek() === '@') {
				peeker.consume();
				node.annotations.push(this.lexAnnotation(peeker));
			}
			peeker.consumeSpaces();

			//	Checking for objects

			if (peeker.peek() === '{') {
				peeker.consume();
				peeker.consumeSpaces();
				node.children = this.lexNode(peeker);
			}

			nodes.push(node);
		}

		peeker.consume();
		peeker.consumeSpaces();

		return nodes;
	}


	public static lexAnnotation(peeker: Peeker): Annotation {
		//	@ts-ignore
		const annotation = new Annotation();

		annotation.name = peeker.consumeWord();
		annotation.arguments = [];
		peeker.consumeSpaces();

		if (peeker.peek() == '(') {
			peeker.consume();
			peeker.consumeSpaces();

			//	Parsing arguments

			while (peeker.peek() != ')') {
				peeker.consumeSpaces();

				//	Trying to get variable type

				annotation.arguments.push(this.lexArgument(peeker));

				//	Checking for more

				peeker.consumeSpaces();
				if (peeker.peek() != ',') break;
				peeker.consume();
				peeker.consumeSpaces();
			}

			if (peeker.consume() != ')') throw new LexError(peeker, 'Expected ) but found ' + peeker.previous());
		}

		peeker.consumeSpaces();

		return annotation;
	}


	public static lexArgument(peeker: Peeker): AnnotationArgument {
		const arg = peeker.peek();

		if (arg === '\'' || arg === '"') return this.lexString(peeker);
		if (/[0-9.]/.test(arg)) return this.lexNumber(peeker);
		if (/[tfynof]/.test(arg)) return this.lexBooleanOrNull(peeker);
		if (arg === '/') return this.lexRegExp(peeker);

		throw new LexError(peeker, 'Unable to parse annotation argument ' + arg)
	}


	public static lexString(peeker: Peeker): string {
		const quote = peeker.consume();

		let result = '';
		let escaped = false;
		while (escaped || peeker.peek() != quote) {
			const char = peeker.consume();

			if (escaped) escaped = false;
			else if (char == '\\') { escaped = true; continue; }
			result += char;
		}

		peeker.consume();
		peeker.consumeSpaces();

		return result;
	}


	public static lexNumber(peeker: Peeker): number {
		let num = '';

		while (/[0-9_]/.test(peeker.peek())) {
			const char = peeker.consume();
			if (char != '_') num += char;
		}

		if (/\./.test(peeker.peek())) {
			peeker.consume();
			num += '.';
			while (/[0-9_]/.test(peeker.peek())) {
				const char = peeker.consume();
				if (char !== '_') num += char;
			}
		}

		peeker.consumeSpaces();
		return parseInt(num);
	}


	public static lexBooleanOrNull(peeker: Peeker): boolean | null {
		const word = peeker.consumeWord();

		switch (word) {
			case "true":
			case "yes":
			case "on":
				return true;
			case "false":
			case "no":
			case "off":
				return false;
			case "null":
				return null;
			default:
				throw new LexError(peeker, 'Invalid boolean character: ' + word)
		}
	}



	public static lexRegExp(peeker: Peeker): RegExp {
		const slash = peeker.consume();

		let pattern = '';
		let escaped = false;

		while (escaped || peeker.peek() != slash) {
			const char = peeker.consume();

			if (escaped) escaped = false;
			else if (char === '\\') { escaped = true; continue; }
			pattern += char;
		}

		peeker.consume();

		let flags = '';

		while (/[gmiyusd]/.test(peeker.peek()))
			flags += peeker.consume();

		return new RegExp(pattern, flags);
	}
}