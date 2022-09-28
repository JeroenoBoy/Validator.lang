import { ValidatorError } from '../../src/util/Errors';
import { SimpleValidator } from '../../src/Validator';

describe('String annotations', () => {
	describe('Min Length', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{string string @minLength("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @minLength(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @minLength(-200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @minLength(0)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @minLength(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @minLength(200)}`).build()).not.toThrow();
		});
		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{string string @minLength(5)}`).build();

			expect(validator.validate({ string: '1234' })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ string: 3 })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ string: '123456' })).toBe(true);
			expect(validator.validate({ string: '12345' })).toBe(true);
		});
	});

	describe('Max Length', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{string string @maxLength("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @maxLength(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @maxLength(-200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @maxLength(/[a-z]/g)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @maxLength(0)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @maxLength(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @maxLength(200)}`).build()).not.toThrow();
		});
		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{string string @maxLength(5)}`).build();

			expect(validator.validate({ string: '123456' })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ string: 8 })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ string: '1234' })).toBe(true);
			expect(validator.validate({ string: '12345' })).toBe(true);
		});
	});

	describe('Pattern', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{string string @pattern("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @pattern(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @pattern(-200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @pattern(0)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @pattern(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string @pattern(/[a-z]/gis)}`).build()).not.toThrow();
		});
		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{string string @pattern(/^[a-z]{2}-$[a-z]{6}/i)}`).build();

			expect(validator.validate({ string: '123456' })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ string: 8 })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ string: '34-eharha' })).toBe(false);
			expect(validator.validate({ string: 'ae-ghedhd' })).toBe(true);
			expect(validator.validate({ string: 'bf-eharha' })).toBe(true);
		});
	});

	describe.each<[string, ...[string, boolean][]]>([
		['@containsLowercase', ['ABFDABdfbdaDBF', true], ['ARBERANAEN', false], ['124141', false], ['124141gagBF', true]],
		['@containsUppercase', ['dabdfbADDANADG', true], ['bafbdbfbfd', false], ['124141', false], ['124141gagBF', true]],
		['@containsNumber', ['dabdfbADDANADG', false], ['bafbdbfbfd', false], ['124141', true], ['124141gagBF', true]],
		['@containsSpecial', ['dabdfbADDANADG', false], ['bafbdbfbfd', false], ['124141', false], ['124141gagBF', false]]
	])('Contains checks for %s', (type, ...tests) => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{string string ${type}("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string ${type}(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string ${type}(200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string string ${type}}`).build()).not.toThrow();
			expect(() => new SimpleValidator(`Validator{string string ${type}()}`).build()).not.toThrow();
		});

		const validator = new SimpleValidator(`Validator{string string ${type}}`).build();
		test.each(tests)('Functionality for "%s"', (str, result) => {
			if (result) expect(validator.validate(str)).toBe(true)
			else expect(validator.validate(str)).toBeInstanceOf(ValidatorError)
		});
	});
});