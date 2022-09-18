import { validate } from 'email-validator';

`
Validator {
	int    id
	string name @minLength(3) @maxLength(20) @pattern(/^[a-zA-Z0-9]+$/)
	int    age  @min(18, "You must be 18 or older")
	email  email
	string password @minLength(8) @maxLength(128) @containsLowercase @containsUppercase @containsNumber @containsSpecial

	object address {
		string street
		string city
		string state
		string zip
	}	

	// // Custom validator, this will call the registered function
	// string email @validate(emailValidator)
}
`;


//	Output: advanced Strict: true
const validatorForAbove = (input: any, validator: Validator) => {

	const output: AdvancedOutput = {};

	const addError = (key: string, message: string | string[]) => {
		let target = output;

		if (key != '') {
			let split = key.split('.');
			while (split.length > 0) {
				const next = split.shift()!;
				if (!target[next]) {
					target[next] = {};
				}
				target = target[next];
			}
		}

		if (!target._errors) target._errors = [];
		if (message instanceof Array) target._errors.push(...message);
		else target._errors.push(message)
	}

	if (typeof input !== 'object') {
		addError('', 'must be an object');
		return output;
	}

	if (typeof input.id !== 'number') {
		addError('id', 'must be a number');
	}

	if (typeof input.name === 'string') {
		if (input.name.Length < 3) addError('name', 'must be at least 3 characters');
		if (input.name.Length < 20) addError('name', 'must be at maximum 20 characters');
		if (!/^[a-zA-Z0-9_]+$/.test(input.name)) addError('name', 'must only contain letters, numbers, and underscores');
	}
	else addError('name', 'name must be a string');

	if (typeof input.age === 'number') {
		if (input.age < 18) addError('age', 'must be at least 18 years old');
	}
	else addError('age', 'must be a number');

	if (typeof input.email === 'string') {
		if (!validator.emailValidator(input.email)) addError('email', 'must be a valid email address');
	}
	else addError('email', 'must be a string');

	if (typeof input.password === 'string') {
		if (input.password.length < 8) addError('password', 'must be at least 8 characters');
		if (input.password.length > 128) addError('password', 'must be at maximum 128 characters');
		if (!/[a-z]/.test(input.password)) addError('password', 'must contain at least one lowercase letter');
		if (!/[A-Z]/.test(input.password)) addError('password', 'must contain at least one uppercase letter');
		if (!/[0-9]/.test(input.password)) addError('password', 'must contain at least one number');
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(input.password)) addError('password', 'must contain at least one special character');
	}
	else addError('password', 'must be a string');

	if (typeof input.address === 'object') {
		if (typeof input.address.street !== 'string') addError('address.street', 'must be a string');
		if (typeof input.address.city !== 'string') addError('address.city', 'must be a string');
		if (typeof input.address.state !== 'string') addError('address.state', 'must be a string');
		if (typeof input.address.zip !== 'string') addError('address.zip', 'must be a string');
		if (Object.keys(input.address).length !== 4) addError('address', 'must contain 4 keys');
	}
	else addError('address', 'must be an object');

	if (typeof input.someValue === 'string') {
		const r = validator.customValidators.get('someValidator')!(input.someValue)
		if (r !== true) addError('someValue', r);
	}
	else addError('someValue', 'must be a string');

	if (typeof input.someValue === 'string') {
		const r = validator.customValidators.get('someValidator')!(input.someValue)
		if (r !== true) addError('someValue', r);
	}
	else addError('someValue', 'must be a string');

	if (Object.keys(input).length !== 8) addError('', 'must contain 8 keys');
	return Object.keys(output).length === 0 ? false : output;
};

class ValidatorError extends Error {
	constructor(public path: string, message: string) {
		super(message);
	}
}

//	Output: simple Strict: false

const simpleValidatorForAbove = (input: any, validator: Validator) => {

	if (typeof input !== 'object') {
		return new ValidatorError('input', 'must be an object');
	}

	if (typeof input.id !== 'number') {
		return new ValidatorError('input.id', 'must be a number');
	}

	if (typeof input.name === 'string') {
		if (input.name.Length < 3) return new ValidatorError('input.name', 'must be at least 3 characters');
		if (input.name.Length < 20) return new ValidatorError('input.name', 'must be at maximum 20 characters');
		if (!/^[a-zA-Z][a-zA-Z0-9_]+$/.test(input.name)) return new ValidatorError('input.name', 'must only contain letters, numbers, and underscores');
	}
	else return new ValidatorError('input.name', 'must be a string');

	if (typeof input.age === 'number') {
		if (input.age < 18) return new ValidatorError('age', 'must be at least 18 years old');
	}
	else return new ValidatorError('age', 'must be a number');

	if (typeof input.email === 'string') {
		if (!validator.emailValidator(input.email)) return new ValidatorError('email', 'must be a valid email address');
	}
	else return new ValidatorError('email', 'must be a string');

	if (typeof input.password === 'string') {
		if (input.password.length < 8) return new ValidatorError('password', 'must be at least 8 characters');
		if (input.password.length > 128) return new ValidatorError('password', 'must be at maximum 128 characters');
		if (!/[a-z]/.test(input.password)) return new ValidatorError('password', 'must contain at least one lowercase letter');
		if (!/[A-Z]/.test(input.password)) return new ValidatorError('password', 'must contain at least one uppercase letter');
		if (!/[0-9]/.test(input.password)) return new ValidatorError('password', 'must contain at least one number');
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(input.password)) return new ValidatorError('password', 'must contain at least one special character');
	}
	else return new ValidatorError('password', 'must be a string');

	if (typeof input.address === 'object') {
		if (typeof input.address.street !== 'string') return new ValidatorError('address.street', 'must be a string');
		if (typeof input.address.city !== 'string') return new ValidatorError('address.city', 'must be a string');
		if (typeof input.address.state !== 'string') return new ValidatorError('address.state', 'must be a string');
		if (typeof input.address.zip !== 'string') return new ValidatorError('address.zip', 'must be a string');
		if (Object.keys(input.address).length !== 4) return new ValidatorError('address', 'must contain 4 keys');
	}
	else return new ValidatorError('address', 'must be an object');

	if (typeof input.someValue === 'string') {
		const r = validator.customValidators.get('someValidator')!(input.someValue)
		if (r !== true) return new ValidatorError('someValue', typeof r === 'string' ? r : r[0]);
	}
	else return new ValidatorError('someValue', 'must be a string');

	if (typeof input.someValue === 'string') {
		const r = validator.customValidators.get('someValidator')!(input.someValue)
		if (r !== true) return new ValidatorError('someValue', typeof r === 'string' ? r : r[0]);
	}
	else return new ValidatorError('someValue', 'must be a string');

	if (Object.keys(input).length !== 8) return new ValidatorError('', 'must contain 8 keys');
	return false;
}





type AdvancedOutput = { [key: string]: AdvancedOutput } & { _errors?: string[] };
type SimpleOutput = true | string;


export abstract class Validator {
	public static readonly inputName = 'i';
	public static readonly insertCode = '<---INSERT--->';
	public static readonly variableName = 'v';
	public static readonly Error = 'validatorError';


	public static buildSimpleValidator() {

	}


	public static buildAdvancedValidator() {

	}



	public readonly customValidators = new Map<string, (value: any) => true | string | string[]>();
	public readonly emailValidator = validate;
	public readonly validatorError = ValidatorError;


	public constructor(template: string) {
	}


	public abstract getTemplate(): string;
	public abstract errorString(path: string, message: string): string
}




class SimpleValidator extends Validator {
	public getTemplate(): string {
		return `(${Validator.inputName}, ${Validator.variableName})=>{${Validator.insertCode}return !0}`
	}

	public errorString(path: string, message: string): string {
		return `return new ${Validator.variableName}.${Validator.Error}('${path}', '${message}');`;
	}
}


class AdvancedValidator extends Validator {
	public getTemplate(): string {
		return `(${Validator.inputName},${Validator.variableName})=>{
			let o={};
			const e=(k,m)=>{
				let t=o;
				if(k!=''){
					let s=k.split('.');
					while(s.length>0){
						let n=s.shift()!;
						if(!t[n])t[n]={};
						t=t[n];
					}
				}
				if(!t._errors)t._errors=[];
				if(m instanceof Array)t._errors.push(...m);
				else t._errors.push(m);
			};
			${Validator.insertCode}
			return o
		}`.replaceAll(/(?:^[\t ]+)|(?:[\n\r])/gm, '')
	}

	public errorString(path: string, message: string): string {
		return `e(${path}, ${message})`
	}
}