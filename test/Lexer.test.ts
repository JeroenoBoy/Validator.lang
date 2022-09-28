import { Lexer } from '../src/Parsing/Lexer';
import { Peeker } from '../src/Parsing/Peeker';


describe('Challenging the lexer', () => {

	test.each([
		[`Validator { number id string name int age email email string password }`],
		[`Validator { number id @someAnnotation }`],
		[`Validator { number id @string("return \\"String\\"") }`],
		[`Validator { number id @args(1_23.3) }`],
		[`Validator { number id @args(yes, no, true, false, on, off, null) }`],
		[`Validator { number id @args(/\\//gmiyusd) }`],
	])('Testing for errors %#', (input) => {
		expect(() => Lexer.lex(input)).not.toThrow();
	});


	test.each([
		['"Hello World!"', 'Hello World!'],
		['"Hello \\"World!\\""', 'Hello "World!"'],
	])('Testing string parsing %#', (input, target) => {
		const peeker = new Peeker(input);
		const result = Lexer.lexString(peeker);
		expect(result).toBe(target)
	});


	test.todo('Adding comments');
	test.todo('Adding array support');
})