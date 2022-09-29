import { ValidatorError } from '../../src/util/Errors';
import { SimpleValidator } from '../../src/Validator';

describe('Array annotations', () => {
	describe('Min Length', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{string[] nums @minLength("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string[] nums @minLength(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string[] nums @minLength(-200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string[] nums @minLength(0)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string[] nums @minLength(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string[] nums @minLength(200)}`).build()).not.toThrow();
		});
		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{string[] nums @minLength(5)}`).build();

			expect(validator.validate({ nums: ['1', '2', '3', '4'] })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ nums: ['1', '2', '3', 4, '5'] })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ nums: ['1', '2', '3', '4', '5', '6'] })).toBe(false);
			expect(validator.validate({ nums: ['1', '2', '3', '4', '5'] })).toBe(false);
		});
	});

	describe('Max Length', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{string[] nums @maxLength("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string[] nums @maxLength(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string[] nums @maxLength(-200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string[] nums @maxLength(0)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string[] nums @maxLength(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{string[] nums @maxLength(200)}`).build()).not.toThrow();
		});
		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{string[] nums @maxLength(5)}`).build();

			expect(validator.validate({ nums: ['1', '2', '3', '4', '5', '6'] })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ nums: ['1', '2', '3', 4, '5'] })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ nums: ['1', '2', '3', '4'] })).toBe(false);
			expect(validator.validate({ nums: ['1', '2', '3', '4', '5'] })).toBe(false);
		});
	});

	test('Testing field validators', () => {
		const validator = new SimpleValidator(`Validator{string[] vals @maxLength(5) @item:maxLength(5)}`).build();

		expect(validator.validate({ vals: ['abc', 'abc', 'abcde'] })).toBe(false);
		expect(validator.validate({ vals: ['abc', 'abc', 'abcde', 'abcd', 'aera'] })).toBe(false);
		expect(validator.validate({ vals: ['abc', 'abc', 'abcde', 'abcd', 'aera', 'eagae'] })).toBeInstanceOf(ValidatorError);
		expect(validator.validate({ vals: ['abc', 'abc', 'abcde', 'abcd', 'aeraege'] })).toBeInstanceOf(ValidatorError);
		expect(validator.validate({ vals: ['aeraege'] })).toBeInstanceOf(ValidatorError);

	});
});