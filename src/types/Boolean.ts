import { BaseType } from '../BaseType';
import { LexedNode } from '../Parsing/Lexer';
import { Validator } from '../Validator';


export class BooleanType extends BaseType {

	public readonly name = 'bool';


	constructor() {
		super();
	}


	/**
	 * Parses a string
	 */
	public parse(path: string, node: LexedNode, validator: Validator): string {
		const optional = node.annotations.find(t => t.name === 'optional');
		let result = `if(${this.simpleStatementValidator(path, 'boolean', optional)})${validator.errorString(path, 'must be a boolean')}`
		return result;
	}
}