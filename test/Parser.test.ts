import { ValidatorError } from '../src/util/Errors';
import { SimpleValidator } from '../src/Validator';

describe('Challenging the parser', () => {

	test('Parsing using Simple Validator', () => {

		const input = `
			Validator {
				string name @minLength(5) @maxLength(20) @pattern(/^[a-z][a-z0-9_]+$/i)
				string password @minLength(8) @maxLength(128) @containsUppercase @containsLowercase @containsSpecial @containsNumber
			}
		`;

		const validator = new SimpleValidator(input);
		validator.build();

		let v = validator.validate({
			name: "Jeroeno_Boy",
			email: "Jeroen@vandegeest.eu",
			password: "Aa0)12345678"
		})

		expect(v).toBe(true);

		v = validator.validate({
			name: "_Jeroeno_Boy",
			email: "Jeroen@vandegeest.eu",
			password: "Aa0)12345678"
		});

		expect(v).toBeInstanceOf(ValidatorError)
		expect(v).toHaveProperty("message", "did not match /^[a-z][a-z0-9_]+$/i");

		v = validator.validate({
			name: "_Jeroeno_Boy",
			email: "Jeroen@vandegeest.eu",
			password: "Aa0)12345678"
		});

		expect(v).toBeInstanceOf(ValidatorError)
		expect(v).toHaveProperty("message", "did not match /^[a-z][a-z0-9_]+$/i");

		v = validator.validate({
			name: "Jeroeno_Boy",
			email: "Jeroen@vandegeest.eu",
			password: "lkhalkhliuaAHRARH@^"
		});

		expect(v).toBeInstanceOf(ValidatorError)
		expect(v).toHaveProperty("message", "must contain a number");
	});

});