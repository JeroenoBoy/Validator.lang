import { ASN, baseSyntax, Template, symbols, SyntaxTree, baseTemplate } from "..";
import _ from 'lodash';



export function compiler(ast: ASN[], syntax: SyntaxTree = baseSyntax, template: Template = baseTemplate) : string {
	ast = _.cloneDeep(ast);
	let _a;

	//
	//	Utility functions
	//


	let rv_index = 0;
	const uniqueVar = () => `rv_${rv_index++}`;

	//
	//	Parsing
	//

	function parseValidators(variable: string, node: ASN) {
		const validator = syntax.validators[node.type];
		if(!validator) throw new CompileError(`Invalid validator type: ${node.type}`);

		//	Checking if this variable is optional

		const optional = (_a = variable.split('.'))[_a.length-1].startsWith('?')
		if(optional) {
			_a[_a.length-1] = _a[_a.length-1].slice(1, _a[_a.length-1].length);
			variable = _a.join('.');
		}

		//	Util for setting variable

		const setVariable = (str: string) => variable = str; 

		//	Getting and compiling the type
		
		const _code = validator.compile({variable, node, optional, uniqueVar, parse, setVariable});
		let compiledCode = '';

		// set the compiled code

		const setCompiledCode = (c: string) => compiledCode += c.endsWith(';') ? c : c + ';';

		// Loop thru all the validators

		for(const val of (node.validations || [])) {
			const field = validator._VLang.get(val.type);
			if(!field)
				throw new CompileError(`Invalid field(${val.type}) on type ${node.type}`);

			//	@ts-ignore
			setCompiledCode(validator[field.key]({ variable, node: val }));
		}

		// Returning the compiled code

		return _code.replace(/%INPUT%/, compiledCode);
	}


	//	Parse the AST


	function parse(variable: string, ast: ASN[]) {
		let code = '';

		// Checking if this variable is optional.

		const optional = (_a = variable.split('.'))[_a.length-1].startsWith('?');
		if(optional) {
			_a[_a.length-1] = _a[_a.length-1].slice(1, _a[_a.length-1].length);
			variable = _a.join('.');
		}

		// Adding code function

		const addCode = (c: string) => code += c.endsWith(';') ? c : c + ';'	

		// Looping thru all sub-objects

		for(const node of ast) {
			if(node.id !== symbols.var) throw new Error(`Cannot accept validators here! line: ${node.line}`);

			if(node.type === 'object')
				addCode(parse(variable+'.'+node.value!, node.nest!));
			else
				addCode(parseValidators(variable+'.'+node.value!, node));
		}

		// Checking if it should be optional or not

		return (optional ? template.optionalObject : template.object)
			.replace(/%VARIABLE%/g, variable)
			.replace(/%INSERT%/g, code);
	}


	//	Parse the deletion checks


	function parseOverflow(s: string, ast: ASN[]) {

		let code = '';
		const addCode = (c: string) => code += c.endsWith(';') ? c : c + ';';

		for(const node of ast) {
			let _var = s+'.'+ (node.value.startsWith('?')
			? node.value.slice(1,node.value.length)
			: node.value);
			if(node.nest) addCode(parseOverflow(_var, node.nest));
			addCode(`delete ${_var}`);
		}

		addCode(`if(Object.keys(${s}).length>0)checkDelete('${s}','Invalid object.')`);
		return code;
	}
	return template.base
		.replace(/%INSERT%/g, parse('input', ast))
		.replace(/%OVERFLOW%/g, parseOverflow('input', ast));
}


export class CompileError extends Error {

	constructor(msg: string) {
		super(msg);
		this.name = 'CompileError'
	}

}