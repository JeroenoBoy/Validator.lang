import fs from "fs";
import { join } from "path";
import { ASN, ParseError, symbols, LexedNode } from ".";


export type SyntaxTree = {
	types: ValidatorType[]
	validators: { [key: string]: Validator }
}
export class Validator {
	name: string
	aliases: string[] = []
	_VLang: Map<string, {name:string,key:string|symbol,type:string}>

	compile(_: ValidatorInput): string {
		throw new Error('Please override the compile function.');
	}

	/**
	 * Parse the validators
	 */

	parse(_: ParseValidatorsInput): ASN {
		if(!_.syntax.validators[_.type]) throw new ParseError(`Invaid type: ${_.type}`);
		_.tabCount++;

		const tree: ASN[] = [];

		let tabs = 0;

		while (!!_.peek() && (tabs = _.getSpaces(_.peek().value)) >= _.tabCount) {
			const node = _.consume();

			if(tabs > _.tabCount)
				throw new ParseError(`Expected ${_.tabCount*_.spacing.length} ${_.spacing == '\t' ? 'tabs' : 'spaces'} but found ${node.value.match(/^[\t ]*/g)![0].replace(/\t/g, '[t]').replace(/ /g,'[s]')} in line ${node.line}`)

			let [ name, value ] = node.value.trim().split(/ *= */);

			if(!_.validator._VLang.has(name))
				throw new ParseError(`Unexpected node: ${name}`);

			const field = _.validator._VLang.get(name)!;
			const asn = {
				id: symbols.validator,
				line: node.line,
				type: name,
				value: value
			}

			_.parseTypes(asn, field.type.toLocaleLowerCase())

			tree.push(asn)
		}

		return {
			id: symbols.var,
			line: _.node.line,
			type: _.type,
			value: _.name,
			validations: tree
		};
	}
}

export class ValidatorType {
	name: string
	parse(node: ASN) {
		node;
		throw new Error('Please override the parse function.');
	}
}

export interface ValidatorInput {
	variable: string
	node: ASN
	optional: boolean,
	uniqueVar: () => string
	setVariable: (str: string) => string
	parse: (variable: string, ast: ASN[]) => string
}

export interface ParseValidatorsInput {
	syntax: SyntaxTree
	type: string
	name: string
	node: LexedNode
	spacing: string
	tabCount: number
	validator: Validator
	peek: () => LexedNode
	consume: () => LexedNode
	getSpaces: (s: string) => number
	parseTypes: (asn: ASN, type: string) => void
	nest: (tabcount: number) => ASN[]
}


export interface Template {
	base: string
	object: string
	optionalObject: string
	array: string
	optionalArray: string
}



export function mergeSyntax(...trees: SyntaxTree[]) {

	let newTree = trees.shift()!;

	for(const tree of trees) {
		newTree.validators = {...tree.validators, ...newTree.validators};
		newTree.types.push(...tree.types);
	}

	return newTree;
}



export function getSyntax(dir: string) {

	let syntax: SyntaxTree = {
		types: [],
		validators: {}
	};

	const files = fs.readdirSync(dir);

	for(const file of files) {
		const fileDir = join(dir, file);

		const stat = fs.lstatSync(fileDir);

		if(stat.isDirectory()) {
			const syn = getSyntax(fileDir);
			mergeSyntax(syntax, syn)
		}

		else {
			let _a;
			_a = (_a = require(fileDir)).default ? _a.default : _a;
			if(!(typeof _a === 'function')) continue;
			const c = new _a();

			if(c instanceof Validator) {
				syntax.validators[c.name.toLowerCase()] = c;
				for(const alias of c.aliases)
					syntax.validators[alias.toLocaleLowerCase()] = c;
			}

			else if(c instanceof ValidatorType)
				syntax.types.push(c);
		}
	}

	return syntax;
}