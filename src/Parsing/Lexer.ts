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


	/**
	 * Lex a validator
	 * @param input The current validator
	 * @returns The current validator
	 */
	public static lex(input: string) {
		const result: LexedResult = {};
		const peeker = new Peeker(input);

		peeker.consumeSpaces();

		while (!peeker.isFinished()) {
			const name = peeker.consumeWord();
			if (result[name]) throw new LexError(peeker, 'Duplicate valdiator name ' + name);



			peeker.consumeSpaces();
			if (peeker.consume() != '{') throw new LexError(peeker, 'Missing \'{\'');
			peeker.consumeSpaces();

			result[name] = this.lexNodes(peeker);
			peeker.consumeSpaces();
		}

		return result;
	}


	/**
	 * Lex all nodes in an object
	 * @param peeker The current peeker
	 * @returns The nodes in the object
	 */
	public static lexNodes(peeker: Peeker): LexedNode[] {
		const nodes = new Array<LexedNode>();

		while (peeker.peek() != '}') {
			//	@ts-ignore
			const node: LexedNode = {};

			//	Getting name and type

			node.annotations = [];

			//	Adding type

			node.type = peeker.consumeWord();
			peeker.consumeSpaces();

			//	Checking if array

			if (peeker.peek() === '[') {
				if (peeker.peek(1) !== ']') throw new LexError(peeker, 'Expected ]');
				peeker.consume(); peeker.consume();

				node.annotations.push({
					name: 'type',
					arguments: [node.type]
				});

				node.type = 'Array';
				peeker.consumeSpaces();
			}

			//	Getting name

			if (!peeker.isWordCharacter(peeker.peek())) throw new LexError(peeker, 'Expected a word');
			node.name = peeker.consumeWord();
			peeker.consumeSpaces();

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
				node.children = this.lexNodes(peeker);
			}

			nodes.push(node);
		}

		peeker.consume();
		peeker.consumeSpaces();

		return nodes;
	}


	/**
	 * Lex an annotation
	 * @param peeker The current peeker
	 * @returns The lexed annotation
	 */
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


	/**
	 * Lex an argument of unkown type
	 * @param peeker The current peeker
	 * @returns The parsed argument
	 */
	public static lexArgument(peeker: Peeker): AnnotationArgument {
		const arg = peeker.peek();

		if (arg === '\'' || arg === '"') return this.lexString(peeker);
		if (/[0-9.]/.test(arg)) return this.lexNumber(peeker);
		if (/[tfynof]/.test(arg)) return this.lexBooleanOrNull(peeker);
		if (arg === '/') return this.lexRegExp(peeker);

		throw new LexError(peeker, 'Unable to parse annotation argument ' + arg)
	}


	/**
	 * Parse a string
	 * @param peeker The current peeker
	 * @returns The string
	 */
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


	/**
	 * Parse a number
	 * @param peeker The current peeker
	 * @returns The number
	 */
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


	/**
	 * Parse a boolean
	 * @param peeker The current peeker
	 * @returns The boolean
	 */
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


	/**
	 * Parse a regular expression
	 * @param peeker The current peeker
	 * @returns The regex
	 */
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