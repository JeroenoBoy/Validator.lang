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

		expect(v).toBe(false);

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
		})).toBe(false)
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
		})).toBe(false)
	})


	test('Array validation', () => {
		const validator = new SimpleValidator('Validator { string[] names @maxLength(5) }').build();

		expect(validator.validate({
			names: [
				'John', 'Erica', 'Marin', 'Arjen', 'Tim', 'Damian'
			]
		})).toBeInstanceOf(ValidatorError);

		expect(validator.validate({
			names: [
				'John', 'Erica', 'Marin', 'Arjen', 'Tim'
			]
		})).toBe(false);
	});


	describe('Multiple variables in the parser', () => {
		test('with object[] declerations', () => {
			const validator = new SimpleValidator(`
				Validator {
					object[] cards @item:custom("Card")
				}
				Effect {
					string type @pattern(/^(?:nerf)|(?:buff)$/)
					string calc @pattern(/^\\\\+|\\\\-|\\\\*$/)
					number amount @min(0)
					string unit @maxLength(1)
				}
				Card {
					string name
					string rarity @pattern(/^(?:(?:un)?common)|(?:rare)|(?:legendary)$/)
					object[] effects @item:custom("Effect")
				}
			`).build();

			expect(() => validator.validate({
				cards: [{
					name: 'abc',
					rarity: 'uncommon',
					effects: [{
						type: 'buff',
						calc: '+',
						amount: 5,
						unit: 'm'
					}]
				}]
			})).not.toThrow();
		});


		test('Without T[] declerations', () => {
			const validator = new SimpleValidator(`
				Validator {
					Card[] cards
				}
				Card {
					string name
					string rarity @pattern(/^(?:(?:un)?common)|(?:rare)|(?:legendary)$/)
					Effect[] effects
				}
				Effect {
					string type @pattern(/^(?:nerf)|(?:buff)$/)
					string calc @pattern(/^\\\\+|\\\\-|\\\\*$/)
					number amount @min(0)
					string unit @maxLength(1)
				}
			`).build();

			expect(() => validator.validate({
				cards: [{
					name: 'abc',
					rarity: 'uncommon',
					effects: [{
						type: 'buff',
						calc: '+',
						amount: 5,
						unit: 'm'
					}]
				}]
			})).not.toThrow();
		});

	});



	test.todo('Testing Advanced validator')
	test.todo('Testing object length restrictions')
});