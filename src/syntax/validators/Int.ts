import { Validator, ValidatorInput, Field, regexTable } from "../..";


export default class VarString extends Validator {

	name = 'integer';
	aliases = ['int'];

	compile(data: ValidatorInput): string {
		if(data.optional)
			return `if(typeof ${data.variable}==='number'&&${regexTable.int}.test(${data.variable})){%INPUT%}else if(typeof ${data.variable}!=='undefined')err('${data.variable}','Object must be of type int.')`
		return `if(typeof ${data.variable}==='number'&&${regexTable.int}.test(${data.variable})){%INPUT%}else err('${data.variable}','Object must be of type int.')`
	}

	/**
	 * Parsing the max size of a string.
	 */

	@Field('max', 'INT')
	parseMaxSize(data: ValidatorInput): string {
		return `if(${data.variable}>${data.node.value})err('${data.variable}','this variable has to be less than ${data.node.value}')`;
	}

	/**
	 * Parsing the min size of a string.
	 */

	@Field('min', 'INT')
	parseMinSize(data: ValidatorInput): string {
		return `if(${data.variable}.length<${data.node.value})err('${data.variable}','This variable has to be more than ${data.node.value}')`;
	}

	/**
	 * Parsing the min size of a string.
	 */

	@Field('test', 'RegExp')
	parseRegex(data: ValidatorInput): string {
		return `if(!${data.node.value}.test(${data.variable})) err('${data.variable}',"This variable didn't match the RegExp")`;
	}
}