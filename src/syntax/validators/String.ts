import { Validator, ValidatorInput, Field } from "../..";


export default class VarString extends Validator {

	name = 'string';

	compile(data: ValidatorInput): string {
		if(data.optional)
			return `if(typeof ${data.variable}==='string'){%INPUT%}else if(typeof ${data.variable}!=='undefined')err('${data.variable}','Invalid object type.')`
		return `if(typeof ${data.variable}==='string'){%INPUT%}else err('${data.variable}','Invalid object type.')`
	}

	/**
	 * Parsing the exact size of a string.
	 */

	@Field('size', 'INT')
	parseSize(data: ValidatorInput): string {
		return `if(${data.variable}.length!==${data.node.value})err('${data.variable}','This variable can only be ${data.node.value} characters long.')`;
	}

	/**
	 * Parsing the max size of a string.
	 */

	@Field('max', 'INT')
	parseMaxSize(data: ValidatorInput): string {
		return `if(${data.variable}.length>${data.node.value})err('${data.variable}','This variable can only be ${data.node.value} characters long.')`;
	}

	/**
	 * Parsing the min size of a string.
	 */

	@Field('min', 'INT')
	parseMinSize(data: ValidatorInput): string {
		return `if(${data.variable}.length<${data.node.value})err('${data.variable}','This variable can only be ${data.node.value} characters long.')`;
	}

	/**
	 * Parsing the min size of a string.
	 */

	@Field('test', 'RegExp')
	parseRegex(data: ValidatorInput): string {
		return `if(!${data.node.value}.test(${data.variable})) err('${data.variable}',"This variable didn't match the RegExp")`;
	}
}