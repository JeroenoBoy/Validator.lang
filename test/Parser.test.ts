import { ValidatorError } from '../src/util/Errors';
import { SimpleValidator } from '../src/Validator';

describe('Challenging the parser', () => {
	test('Parsing using Simple Validator', () => {

		const input = `
			Validator {
				string name @minLength(3) @maxLength(5)
				string password @minLength(8) @maxLength(25)
			}
		`;

		const validator = new SimpleValidator(input);
		validator.build();

		let v = validator.validate({
			name: "abc",
			password: "Aa0)12345678"
		})

		expect(v).toBe(true);

		v = validator.validate({
			name: "ab",
			password: "Aa0)12345678"
		});

		expect(v).toBeInstanceOf(ValidatorError)
		expect(v).toHaveProperty("message", "must be larger than 3");

		v = validator.validate({
			name: "abcdefgh",
			password: "Aa0)12345678"
		});

		expect(v).toBeInstanceOf(ValidatorError)
		expect(v).toHaveProperty("message", "must be smaller than 5");
	});


	test('Parsing all types', () => {

		const input = `
			Validator {
				string username
				number age
				bool hasPremium
			}
		`;

		const validator = new SimpleValidator(input);
		validator.build();

		expect(validator.validate({
			username: 'My Username',
			age: 123,
			hasPremium: false
		})).toBe(true)
	});


	test('Type validator', () => {

		const input = `
			Validator {
				Author author
			}
			Author {
				number id
				string name
				number created
			}
		`;

		const validator = new SimpleValidator(input);
		validator.build();

		expect(validator.validate({
			author: {
				id: 525,
				name: 'John wick',
				created: Date.now()
			}
		})).toBe(true)
	})


	test.todo('Testing Arrays')
	test.todo('Testing Advanced validator')
	test.todo('Testing object length restrictions')
});