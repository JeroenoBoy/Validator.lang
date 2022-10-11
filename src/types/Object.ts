import { BaseType } from '../BaseType';
import { LexedNode } from '../Parsing/Lexer';
import { Validator } from '../Validator';


export class ObjectType extends BaseType {

	public readonly name = 'object';


	constructor() {
		super();
	}


	/**
	 * Parses a string
	 */
	public parse(path: string, node: LexedNode, validator: Validator): string {
		const annotations = node.annotations;
		const optional = annotations.find(t => t.name === 'optional');
		let result = `if(${this.simpleStatementValidator(path, 'object', optional)})${validator.errorString(path, 'must be an object')}`;

		//	Checking annotations

		if (annotations.length > 0) {
			result += optional ? `else if(typeof ${path}==='object'){` : 'else{'

			for (const annotation of annotations) {
				if (annotation.name === 'optional') continue;
				result += this.runAnnotationHandler(annotation, path, node, validator);
			}

			result += '}'
		}

		return result;
	}
}