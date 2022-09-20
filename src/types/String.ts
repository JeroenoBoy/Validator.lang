import { AnnotationHandler, BaseType } from '../BaseType';
import { LexedNode } from '../Parsing/Lexer';
import { ParseError } from '../util/Errors';
import { Validator } from '../Validator';


export class StringType extends BaseType {

	public readonly name = 'string';


	constructor() {
		super();
		this.addAnnotationHandler(this.minLength);
		this.addAnnotationHandler(this.maxLength);
		this.addAnnotationHandler(this.containsLowercase);
		this.addAnnotationHandler(this.containsUppercase);
		this.addAnnotationHandler(this.containsNumber);
		this.addAnnotationHandler(this.containsSpecial);
		this.addAnnotationHandler(this.pattern);
	}


	/**
	 * Parses a string
	 */
	public parse(path: string, node: LexedNode, validator: Validator): string {
		const annotations = node.annotations;
		const optional = node.annotations.find(t => t.name === 'optional');

		let result = `if(${this.simpleStatementValidator(path, 'string', optional)})${validator.errorString(path, 'must be a string')}`

		//	Checking annotations

		if (annotations.length > 0) {
			result += optional ? 'else{' : `else if(typeof ${path}==='string'){`

			for (const annotation of annotations) {
				if (annotation.name === 'optional') continue;
				result += this.runAnnotationHandler(annotation, path, node, validator);
			}

			result += '}'
		}

		return result;
	}


	//	Annotations


	public minLength: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 1) throw new ParseError('correct usage is minLength(int length)');
		if (typeof args[0] !== 'number') throw new ParseError('Argument index 0 must be a number!');

		return `if(${path}.length < ${args[0]})${valdiator.errorString(path, `must be larger than ${args[0]}`)}`;
	}


	public maxLength: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 1) throw new ParseError('correct usage is maxLenght(int length)');
		if (typeof args[0] !== 'number') throw new ParseError('Argument index 0 must be a number!');

		return `if(${path}.length > ${args[0]})${valdiator.errorString(path, `must be smaller than ${args[0]}`)}`;
	}


	public containsLowercase: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 0) throw new ParseError('No arguments allowed for containsLowercase');
		return `if(!/[a-z]/g.test(${path}))${valdiator.errorString(path, `must contain an lowercase letter`)}`;
	}


	public containsUppercase: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 0) throw new ParseError('No arguments allowed for containsLowercase');
		return `if(!/[A-Z]/g.test(${path}))${valdiator.errorString(path, `must contain an uppercase letter`)}`;
	}


	public containsNumber: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 0) throw new ParseError('No arguments allowed for containsNumber');
		return `if(!/[0-9]/g.test(${path}))${valdiator.errorString(path, `must contain a number`)}`;
	}



	public containsSpecial: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 0) throw new ParseError('No arguments allowed for containsSpecial');
		return `if(!/[!@#$%^&*()_+\\-=\\\\|[\\];':",.\\/<>?]/g.test(${path}))${valdiator.errorString(path, `must contain a special characters`)}`;
	}



	public pattern: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 1) throw new ParseError('correct usage is pattern(Regex pattern)');
		if (!(args[0] instanceof RegExp)) throw new ParseError('Argument index 0 is not a RegExp!');

		return `if(!${args[0]}.test(${path}))${valdiator.errorString(path, `did not match ${args[0]}`)}`;
	}


}