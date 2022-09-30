import { Annotation } from '../Annotation';
import { AnnotationHandler, BaseType } from '../BaseType';
import { LexedNode } from '../Parsing/Lexer';
import { ParseError } from '../util/Errors';
import { Validator } from '../Validator';


export class ArrayType extends BaseType {

	public readonly name = 'Array';


	constructor() {
		super();
		this.addAnnotationHandler(this.minLength);
		this.addAnnotationHandler(this.maxLength);
	}


	/**
	 * Parses a string
	 */
	public parse(path: string, node: LexedNode, validator: Validator): string {
		//	Getting requried annotations

		const annotations = node.annotations;
		const optional = node.annotations.find(t => t.name === 'optional');

		//	Type annotations

		const typeAnnotation = annotations.find(n => n.name === 'type');
		if (!typeAnnotation) throw new ParseError('Must contain the @type(string type) validator');
		const typeName = typeAnnotation.arguments[0];
		if (typeof typeName !== 'string') throw new ParseError('First argument of @type(string type) must be a string');
		const typeValidator = validator.types.get(typeName);
		if (!typeValidator) throw new ParseError(`Type ${typeName} does not exist`);

		//	Starting building

		let result = `if(!Array.isArray(${path})${optional?.arguments[0] ? `&&typeof ${path}!=='undefined'` : ''})${validator.errorString(path, 'must be an array')}`

		//	Checking annotations

		let varName = validator.uniqueVarName();
		result += optional ? 'else{' : `else if(Array.isArray(${path})){`

		const itemAnnotations = new Array<Annotation>();

		for (const annotation of annotations) {
			if (annotation.name === 'optional' || annotation.name === 'type') continue;
			if (annotation.name.startsWith('item:')) {
				annotation.name = annotation.name.substring(5);
				itemAnnotations.push(annotation);
				continue;
			}
			result += this.runAnnotationHandler(annotation, path, node, validator);
		}

		result += `for(let ${varName}=0;${varName}<${path}.length;${varName}++){`
		result += typeValidator.parse(`${path}[${varName}]`, {
			type: typeName,
			name: varName,
			annotations: itemAnnotations
		}, validator);

		result += '}}';

		return result;
	}


	//	Annotations


	public minLength: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 1) throw new ParseError('correct usage is minLength(int length)');
		if (typeof args[0] !== 'number') throw new ParseError('Argument must be a number!');
		if (args[0] <= 0) throw new ParseError('Argument must be atleast 1')

		return `if(${path}.length < ${args[0]})${valdiator.errorString(path, `must be larger than ${args[0]}`)}`;
	}


	public maxLength: AnnotationHandler = (path, args, _, valdiator) => {
		if (args.length != 1) throw new ParseError('correct usage is maxLenght(int length)');
		if (typeof args[0] !== 'number') throw new ParseError('Argument must be a number!');
		if (args[0] <= 0) throw new ParseError('Argument must be atleast 1')

		return `if(${path}.length > ${args[0]})${valdiator.errorString(path, `must be smaller than ${args[0]}`)}`;
	}
}