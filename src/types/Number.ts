import { AnnotationHandler, BaseType } from '../BaseType';
import { LexedNode } from '../Parsing/Lexer';
import { ParseError } from '../util/Errors';
import { Validator } from '../Validator';


export class NumberType extends BaseType {

	public readonly name = 'number';


	constructor() {
		super();
		this.addAnnotationHandler(this.minSize);
		this.addAnnotationHandler(this.maxSize);
	}


	/**
	 * Parses a string
	 */
	public parse(path: string, node: LexedNode, validator: Validator): string {
		const annotations = node.annotations;
		const optional = node.annotations.find(t => t.name === 'optional');

		let result = `if(${this.simpleStatementValidator(path, 'number', optional)})${validator.errorString(path, 'must be a number')}`

		//	Checking annotations

		if (annotations.length > 0) {
			result += optional ? 'else{' : `else if(typeof ${path}==='number'){`

			for (const annotation of annotations) {
				if (annotation.name === 'optional') continue;
				result += this.runAnnotationHandler(annotation, path, node, validator);
			}

			result += '}'
		}

		return result;
	}


	//	Annotations


	public minSize: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 1) throw new ParseError('correct usage is minSize(int size)');
		if (typeof args[0] !== 'number') throw new ParseError('Argument index 0 must be a number!');

		return `if(${path} < ${args[0]})${valdiator.errorString(path, `must be bigger than ${args[0]}`)}`;
	}


	public maxSize: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 1) throw new ParseError('correct usage is maxSize(int size)');
		if (typeof args[0] !== 'number') throw new ParseError('Argument index 0 must be a number!');

		return `if(${path} > ${args[0]})${valdiator.errorString(path, `must be smaller than ${args[0]}`)}`;
	}
}