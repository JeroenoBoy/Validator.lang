import { Validator } from '../Validator';
import { Lexer } from './Lexer';



export class Parser {
	constructor(public readonly validator: Validator) { }


	public parse(input: string) {
		let result = '';

		const lexed = Lexer.lex(input);


	}
}