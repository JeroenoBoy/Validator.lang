import { BaseType } from './BaseType';
import { Lexer } from './Parsing/Lexer';
import { Parser } from './Parsing/Parser';
import { BooleanType } from './types/Boolean';
import { NumberType } from './types/Number';
import { StringType } from './types/String';
import { ValidatorError } from './util/Errors';
import { validate as emailValidator } from 'email-validator';
import { ObjectType } from './types/Object';



export type AdvancedOutput = { [key: string]: AdvancedOutput } & { _errors?: string[] };
export type SimpleOutput = true | string;
export type CustomValidatorHandler = (value: any) => true | string;



export abstract class Validator {
	public static readonly inputName = 'i';
	public static readonly insertCode = '<---INSERT--->';
	public static readonly variableName = 'v';
	public static readonly Error = 'validatorError';
	public static readonly tempVariableName = 't';



	protected validator: (...args: any) => any;

	public readonly template: string;
	public readonly types = new Map<string, BaseType>();
	public readonly customValidators = new Map<string, CustomValidatorHandler>();
	public readonly validatorError = ValidatorError;


	/**
	 * Create a new validator
	 * @param template The template to build
	 * @param addDefaulTypes If the default types should be added
	 */
	public constructor(template: string, addDefaulTypes = true) {
		this.template = template;
		if (addDefaulTypes) this.addDefaultTypes();
	}


	/**
	 * Add the default types to the validator
	 */
	public addDefaultTypes() {
		this.addType(new StringType);
		this.addType(new NumberType);
		this.addType(new BooleanType);
		this.addType(new ObjectType);

		this.addValidator('string', 'isEmail', (value: string) => {
			if (emailValidator(value)) return true;
			return 'is not a valid email adress';
		});
	}


	/**
	 * Add a specific type to the validator
	 * @param type the type validator
	 */
	public addType(type: BaseType) {
		if (this.types.has(type.name)) throw new Error(`Type ${type.name} already exists`);
		this.types.set(type.name, type);
	}


	/**
	 * Add a new validator to the list
	 * @param type The type the validator should add to
	 * @param name The name of the validator
	 * @param handler The handler of the validator
	 */
	public addValidator(type: string, name: string, handler: CustomValidatorHandler) {
		if (this.customValidators.has(`${type}:${name}`)) throw new Error(`Custom validator '${type}:${name}' already exists`);
		this.customValidators.set(`${type}:${name}`, handler);
	}


	/**
	 * Build the validator
	 */
	public build() {
		const lexedResult = Lexer.lex(this.template);
		const validator = Parser.parse(lexedResult, this);
		this.validator = validator;
		if (typeof this.validator !== 'function') throw new Error('Validator did not return a function!');
		return this;
	}


	/**
	 * Return the template for the validator
	 */
	public abstract getTemplate(): string;


	/**
	 * Return the template for a vladator type
	 */
	public abstract getValidatorTypeTemplate(): string


	/**
	 * Return the string to run a validator type template
	 */
	public abstract getCustomValidatorHandler(name: string, path: string): string


	/**
	 * Create a new error message. the returned string could contain a throw or return.
	 * @param path The path to the variable
	 * @param message The error message
	 */
	public abstract errorString(path: string, message: string): string


	/**
	 * Validate an input
	 * @param input the input to validate
	 */
	public abstract validate(input: any): true | any
}




export class SimpleValidator extends Validator {
	public getTemplate(): string {
		return `(${Validator.inputName}, ${Validator.variableName})=>{${Validator.insertCode}return!0}`
	}


	public getValidatorTypeTemplate(): string {
		return `(${Validator.inputName}, ${Validator.variableName}) => {${Validator.insertCode}return!0}`
	}


	public getCustomValidatorHandler(name: string, path: string): string {
		return `{
			const ${Validator.tempVariableName}=${Validator.variableName}.customValidators.get('${name}')(${path}, ${Validator.variableName});
			if(${Validator.tempVariableName}!==true)return new ${Validator.variableName}.${Validator.Error}('${path}', ${Validator.tempVariableName});
		}`.replaceAll(/(?:^[\t ]+)|(?:[\n\r])/gm, '');
	}


	public errorString(path: string, message: string): string {
		return `return new ${Validator.variableName}.${Validator.Error}('${path}', '${message}');`;
	}

	//	@ts-ignore
	public validate(input: any): SimpleOutput {
		return this.validator(input, this);
	}
}


export class AdvancedValidator extends Validator {
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
				t._errors.push(m);
			};
			${Validator.insertCode}
			return o
		}`.replaceAll(/(?:^[\t ]+)|(?:[\n\r])/gm, '')
	}


	public getValidatorTypeTemplate(): string {
		return `(${Validator.inputName}, e, ${Validator.variableName}) => {${Validator.insertCode}}`
	}


	public getCustomValidatorHandler(name: string, path: string): string {
		return `${Validator.variableName}.validatorTypes.get('${name}')('${path}', e, ${Validator.variableName});`;
	}



	public errorString(path: string, message: string): string {
		return `e('${path}', '${message}');`
	}


	//@ts-ignore
	public validate(input: any): AdvancedOutput {
		return this.validator(input, this);
	}
}