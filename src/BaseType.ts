import { Annotation } from './Annotation';
import { LexedNode } from './Parsing/Lexer';
import { ParseError } from './util/Errors';
import { Validator } from './Validator';

export type AnnotationHandler = (path: string, args: any[], node: LexedNode, validator: Validator) => string;

export abstract class BaseType {
	public abstract readonly name: string;
	public abstract parse(path: string, node: LexedNode, validator: Validator): string;


	protected readonly annotationHandlers = new Map<string, AnnotationHandler>();


	protected constructor(addDefaultAnnotations: boolean = true) {
		if (!addDefaultAnnotations) return;

		this.addAnnotationHandler('optional', () => { throw new Error('optional has been handled incorrectly!') });
		this.addAnnotationHandler('custom', this.customAnnotation);
	}


	/**
	 * Returns the variable name from the path
	 * @param path The current variable path
	 * @returns the name of the current variable
	 */
	public nameFromPath(path: string): string {
		const _ = path.split('.');
		return _[_.length - 1];
	}


	/**
	 * Adds an annotationhandler to the list
	 * @param handler The annotation handler
	 * @param handler The validator
	 */
	public addAnnotationHandler(name: string, handler: AnnotationHandler): void;
	/**
	 * Adds an annotationhandler to the list
	 * @param handler The annotation handler, must be a named function
	 */
	public addAnnotationHandler(handler: AnnotationHandler): void;
	public addAnnotationHandler(nameOrHandler: string | AnnotationHandler, handler?: AnnotationHandler) {
		const name = typeof nameOrHandler == 'string' ? nameOrHandler : nameOrHandler.name;
		handler = typeof nameOrHandler == 'string' ? handler! : nameOrHandler

		if (this.annotationHandlers.has(name)) throw new Error(`Annotation handler ${name} already exists!`);
		this.annotationHandlers.set(name, handler);
	}


	/**
	 * Get common statement parameter with optional checks 
	 * @param path The path of the variable
	 * @param type The type to use for typeof
	 * @param optionalAnnotation The optional argument, can be null
	 * @returns 
	 */
	public simpleStatementValidator(
		path: string,
		type: 'bigint' | 'boolean' | 'number' | 'object' | 'string' | 'symbol',
		optionalAnnotation: Annotation | undefined
	): `typeof ${typeof path}!==${typeof type}` | `typeof ${typeof path}!==${typeof type}&&typeof ${typeof path}!=='undefined'` {

		//	Check optional

		if (optionalAnnotation) {
			if (optionalAnnotation.arguments.length > 1) throw new ParseError('Optional annotation must only have up to 1 argument');
			const arg = optionalAnnotation.arguments[0]

			if (arg == undefined || arg === false) {
				//	@ts-ignore
				return `typeof ${path}!=='string'&&typeof ${path}!=='undefined'`
			}
			else if (arg === true) {
				throw new Error('This option has not been implemented yet')
			}
			throw new ParseError('correct usage is optional(boolean canBeNull = no)')
		}

		//	Check not optional

		else {
			return `typeof ${path}!=='${type}'` as `typeof ${typeof path}!==${typeof type}`;
		}
	}


	/**
	 * run an annotation handler
	 */
	public runAnnotationHandler(annotation: Annotation, path: string, node: LexedNode, validator: Validator): string {
		if (!this.annotationHandlers.has(annotation.name)) throw new ParseError(`Annotation handler ${annotation.name} not found`);
		const result = this.annotationHandlers.get(annotation.name)!(path, annotation.arguments, node, validator);
		if (typeof result !== 'string') throw new Error(`Annotatio handler ${annotation.name} did not return a string`);
		return result;
	}


	/**
	 * Run custom annotations
	 */
	public customAnnotation(path: string, args: any[], node: LexedNode, valdiator: Validator): string {
		if (args.length != 1) throw new ParseError('custom validator handler must have 1 argument');
		const arg = args[0];
		if (typeof arg !== 'string') throw new ParseError('custom validator must have a string input');
		if (!valdiator.customValidators.has(`${node.type}:${arg}`)) throw new ParseError(`Custom validator '${node.type}:${arg}' does not exist`);
		return valdiator.getCustomValidatorHandler(`${node.type}:${arg}`, path);
	}
}