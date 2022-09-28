import { Annotation } from '../Annotation';
import { ParseError } from '../util/Errors';
import { Validator } from '../Validator';
import { LexedNode, LexedResult } from './Lexer';



export class Parser {
	private constructor() { }


	/**
	 * Start parsing an LexedResult
	 *	@param lexedResult The LexedResult to parse
	 *  @param validator The current validator object
	 */
	public static parse(lexedResult: LexedResult, validator: Validator): (...args: any) => any {
		let mainValidator: LexedNode[] | undefined = undefined;

		//	Seperating and parsing the validator types from the main validator

		for (const [key, value] of Object.entries(lexedResult)) {
			if (key === 'Validator') mainValidator = value;
			else this.createValidatorType(key, lexedResult, validator);
		}

		//	Parsing the main validator

		if (!Array.isArray(mainValidator)) throw new Error('Main validator not found');

		let result = this.parseNodes(Validator.inputName, lexedResult, mainValidator, validator);
		result = validator.getTemplate().replace(Validator.insertCode, result);

		console.log(result);
		//	Evaluating the result

		const evaluated = eval(result);
		if (typeof evaluated !== 'function') throw new Error(`Evaluator did not return a function on 'Main Validator'`);
		return evaluated;
	}


	/**
	 * Create new validator type
	 * @param key The key / name of the validator
	 * @param types All the types in the validator
	 * @param valdiator The current validator object
	 */
	public static createValidatorType(key: string, types: LexedResult, valdiator: Validator) {
		const current = types[key];

		//	Creating the nodes

		let result = this.parseNodes(Validator.inputName, types, current, valdiator);
		result = valdiator.getValidatorTypeTemplate().replace(Validator.insertCode, result);

		//	Evaluating the result

		const evaluated = eval(result);
		if (typeof evaluated !== 'function') throw new Error(`Evaluator did not return a function on ${key}`);

		//	Adding to the list

		valdiator.addValidator('object', key, evaluated);
	}


	/**
	 * Parse list of nodes
	 * @param path The current path
	 * @param types The types in the script
	 * @param nodes The current nodes
	 * @param validator The current validator object
	 * @returns The parsed validator
	 */
	public static parseNodes(path: string, types: LexedResult, nodes: LexedNode[], validator: Validator): string {
		let result = '';

		for (const node of nodes) {
			const varPath = `${path}.${node.name}`

			//	Check normal types

			if (validator.types.has(node.type)) {
				const type = validator.types.get(node.type)!;
				result += type.parse(varPath, node, validator);
			}

			//	Check validator types

			else if (types[node.type]) {
				node.annotations.push(new Annotation('custom', [node.type]));
				node.type = 'object'
				result += validator.types.get('object')!.parse(varPath, node, validator)
			}

			//	Something didn't go as planned

			else throw new ParseError(`Type \'${node.type}\' not found in list and validator`);
		}

		return result;
	}
}