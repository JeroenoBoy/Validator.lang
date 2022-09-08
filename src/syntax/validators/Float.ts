import { Validator, ValidatorInput, Field, regexTable } from "../..";


export default class VarString extends Validator {

	name = 'float';

	compile(data: ValidatorInput): string {
		if(data.optional)
			return `if(typeof ${data.variable}==='number'&&${regexTable.float}.test(${data.variable})){%INPUT%}else if(typeof ${data.variable}!=='undefined')err('${data.variable}','Object must be of type float.')`
		return `if(typeof ${data.variable}==='number'&&${regexTable.float}.test(${data.variable})){%INPUT%}else err('${data.variable}','Object must be of type float.')`
	}

	/**
	 * Parsing the max size of a string.
	 */

	@Field('max', 'FLOAT')
	parseMaxSize(data: ValidatorInput): string {
		return `if(${data.variable}>${data.node.value.replace(',', '.')})err('${data.variable}','this variable has to be less than ${data.node.value.replace(',', '.')}')`;
	}

	/**
	 * Parsing the min size of a string.
	 */

	@Field('min', 'FLOAT')
	parseMinSize(data: ValidatorInput): string {
		return `if(${data.variable}<${data.node.value.replace(',', '.')})err('${data.variable}','This variable has to be more than ${data.node.value.replace(',', '.')}')`;
	}

	/**
	 * Parsing the min size of a string.
	 */

	@Field('test', 'RegExp')
	parseRegex(data: ValidatorInput): string {
		return `if(!${data.node.value}.test(${data.variable})) err('${data.variable}',"This variable didn't match the RegExp")`;
	}
}