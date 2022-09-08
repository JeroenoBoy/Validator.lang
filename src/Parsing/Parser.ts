import { baseSyntax } from "..";
import { SyntaxTree, Validator } from "../syntaxUtils";
import { LexedNode } from "./Lexer";


//	symbols
export const symbols = {
	var: Symbol('var'),
	validator: Symbol('val')
}

export interface ASN {
	id: Symbol
	line: number
	type: string
	value?: any
	nest?: ASN[]
	validations?: ASN[]
}



export function parser(input: LexedNode[], syntax: SyntaxTree = baseSyntax): ASN[] {
	let _a;

	let spacing = '';
	let regex: RegExp = /^\t*/g;

	//	Getting space stuff

	for(const node of input) {
		if(spacing == '' && /^[\t ]/.test(node.value)) {
			if(node.value.startsWith('\t'))
				spacing = '\t'
			else
				spacing = (_a = node.value.match(/^ {1,4}(?! )/g))
				? _a[0] //	@ts-ignore
				: (()=>{throw new ParseError(`Invalid space length: ${_a[0].length}`)})();
				
			regex = new RegExp(`^(${spacing})*`, 'g')
			break;
		}
		
	}

	//	Doing the rest

	let c = 0;
	const getSpaces = (s: string) => s.match(regex)![0].length / spacing.length || 0;
	const peek = () => input[c];
	const consume = () => input[c++];

	//	Parse single variable.

	function parseNode(node: LexedNode, tabCount: number): ASN {
		let [ name, type ] = node.value.trim().split(/ *: */);
		let _type;

		//	Parsing objects
		
		if(name.endsWith('[]')) { name = name.substr(0, name.length-2); _type = 'array' }
		else if(type == '') _type = 'object';

		//	Validating name
		
		if(!/^\??[a-z@_-]{1,100}$/i.test(name))
			throw new ParseError('Variable names must follow the following regex: /^\??[a-z@_-]{1,100}$/i')

		//	getting field validator

		const field = syntax.validators[_type || type];
		if(!(field instanceof Validator)) throw new ParseError(`Unknown validator: ${_type || type}`)

		//	Parsing

		return field.parse({
			syntax, node, name, type, validator: field,
			spacing, tabCount,
			peek, consume, getSpaces, parseTypes, nest
		})
	}

	//	Parse the validator types.
	
	function parseTypes(node: ASN, type: string) {
		const t = syntax.types.find(c=>c.name == type);
		if(!t) throw new ParseError(`Invalid type: ${type}`);
		t.parse(node);
	}
	
	//	Parse the nest for a object

	function nest(tabCount = 0): ASN[] {
		const tree: ASN[] = [];
	
		while (!!peek() && getSpaces(peek().value) >= tabCount) {
			const parsed = parseNode(consume(), tabCount)
			// if(tree.find(n=>n.value === parsed.value)) throw new ParseError(`Duplicate object in line ${parsed.line}`)
			tree.push(parsed);
		}
		return tree;
	}

	return nest();
}




export class ParseError extends Error {

	constructor(msg: string) {
		super(msg);
		this.name = 'ParseError'
	}

}