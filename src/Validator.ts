import { BaseType } from './BaseType';
import { Lexer } from './Parsing/Lexer';
import { Parser } from './Parsing/Parser';
import { NumberType } from './types/Number';
import { StringType } from './types/String';
import { ValidatorError } from './util/Errors';



type AdvancedOutput = { [key: string]: AdvancedOutput } & { _errors?: string[] };
type SimpleOutput = true | string;



export abstract class Validator {
	public static readonly inputName = 'i';
	public static readonly insertCode = '<---INSERT--->';
	public static readonly variableName = 'v';
	public static readonly Error = 'validatorError';



	protected validator: (...args: any) => any;

	public readonly template: string;
	public readonly types = new Map<string, BaseType>();
	public readonly customValidators = new Map<string, (value: any) => true | string | string[]>();
	public readonly validatorTypes = new Map<string, (...args: any) => void>();
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
	}


	/**
	 * Add a specific type to the validator
	 */
	public addType(type: BaseType) {
		if (this.types.has(type.name)) throw new Error(`Type ${type.name} already exists`);
		this.types.set(type.name, type);
	}


	/**
	 * Build the validator
	 */
	public build() {
		console.log('Building');
		const lexedResult = Lexer.lex(this.template);
		const validator = Parser.parse(lexedResult, this);
		this.validator = validator;
		if (typeof this.validator !== 'function') throw new Error('Validator did not return a function!');
	}


	/**
	 * Return the template for the validator
	 */
	public abstract getTemplate(): string;


	/**
	 * Return the template for a velidator type
	 */
	public abstract getValidatorTypeTemplate(): string


	/**
	 * Return the string to run a validator type template
	 */
	public abstract getRunValidatorType(name: string, path: string): string


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
		return `(${Validator.inputName}, ${Validator.variableName})=>{${Validator.insertCode}return !0}`
	}


	public getValidatorTypeTemplate(): string {
		return `(${Validator.inputName}, ${Validator.variableName}) => {${Validator.insertCode}}`
	}


	public getRunValidatorType(name: string, path: string): string {
		return `${Validator.variableName}.validatorTypes.get('${name}')('${path}', ${Validator.variableName})`;
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
				if(m instanceof Array)t._errors.push(...m);
				else t._errors.push(m);
			};
			${Validator.insertCode}
			return o
		}`.replaceAll(/(?:^[\t ]+)|(?:[\n\r])/gm, '')
	}


	public getValidatorTypeTemplate(): string {
		return `(${Validator.inputName}, e, ${Validator.variableName}) => {${Validator.insertCode}}`
	}


	public getRunValidatorType(name: string, path: string): string {
		return `${Validator.variableName}.validatorTypes.get('${name}')('${path}', e, ${Validator.variableName})`;
	}



	public errorString(path: string, message: string): string {
		return `e('${path}', '${message}');`
	}


	//@ts-ignore
	public validate(input: any): AdvancedOutput {
		return this.validator(input, this);
	}
}