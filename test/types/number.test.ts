import { ValidatorError } from '../../src/util/Errors';
import { SimpleValidator } from '../../src/Validator';

describe('Number annotations', () => {
	describe('Min', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{number num @min("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @min(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @min(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @min(-200)}`).build()).not.toThrow();
			expect(() => new SimpleValidator(`Validator{number num @min(0)}`).build()).not.toThrow();
			expect(() => new SimpleValidator(`Validator{number num @min(200)}`).build()).not.toThrow();
		});
		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{number num @min(5)}`).build();

			expect(validator.validate({ num: '4' })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: 7 })).toBe(false);
			expect(validator.validate({ num: 6 })).toBe(false);
			expect(validator.validate({ num: 5 })).toBe(false);
			expect(validator.validate({ num: 4 })).toBeInstanceOf(ValidatorError);
		});
	});

	describe('Max Length', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{number num @max(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @max("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @max(/[a-z]/g)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @max(-200)}`).build()).not.toThrow();
			expect(() => new SimpleValidator(`Validator{number num @max(0)}`).build()).not.toThrow();
			expect(() => new SimpleValidator(`Validator{number num @max(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @max(200)}`).build()).not.toThrow();
		});
		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{number num @max(5)}`).build();

			expect(validator.validate({ num: '3' })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: 6 })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: 5 })).toBe(false);
			expect(validator.validate({ num: 4 })).toBe(false);
		});
	});

	describe('Integer', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{number num @integer(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @integer("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @integer(-200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @integer(/[a-z]/g)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @integer(0)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @integer(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @integer(200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @integer()}`).build()).not.toThrow();
			expect(() => new SimpleValidator(`Validator{number num @integer}`).build()).not.toThrow();
		});

		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{number num @integer}`).build();

			expect(validator.validate({ num: 6.3 })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: 6.0003 })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: '5' })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: 5 })).toBe(false);
			expect(validator.validate({ num: 4_2 })).toBe(false);
		})
	});

	describe('Nan', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{number num @notNan(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @notNan("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @notNan(-200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @notNan(/[a-z]/g)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @notNan(0)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @notNan(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @notNan(200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @notNan()}`).build()).not.toThrow();
			expect(() => new SimpleValidator(`Validator{number num @notNan}`).build()).not.toThrow();
		});

		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{number num @notNan}`).build();

			expect(validator.validate({ num: NaN })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: '5' })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: 5 })).toBe(false);
		})
	});

	describe('Positive', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{number num @positive(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @positive("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @positive(-200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @positive(/[a-z]/g)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @positive(0)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @positive(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @positive(200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @positive()}`).build()).not.toThrow();
			expect(() => new SimpleValidator(`Validator{number num @positive}`).build()).not.toThrow();
		});

		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{number num @positive}`).build();

			expect(validator.validate({ num: -5 })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: '5' })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: 0 })).toBe(false);
			expect(validator.validate({ num: 5 })).toBe(false);
		})
	});

	describe('Negative', () => {
		test('Argument Validation', () => {
			expect(() => new SimpleValidator(`Validator{number num @negative(yes)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @negative("200")}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @negative(-200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @negative(/[a-z]/g)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @negative(0)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @negative(1, 5)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @negative(200)}`).build()).toThrow();
			expect(() => new SimpleValidator(`Validator{number num @negative()}`).build()).not.toThrow();
			expect(() => new SimpleValidator(`Validator{number num @negative}`).build()).not.toThrow();
		});

		test('Functionality', () => {
			const validator = new SimpleValidator(`Validator{number num @negative}`).build();

			expect(validator.validate({ num: 5 })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: '-5' })).toBeInstanceOf(ValidatorError);
			expect(validator.validate({ num: 0 })).toBe(false);
			expect(validator.validate({ num: -5 })).toBe(false);
		})
	});
});