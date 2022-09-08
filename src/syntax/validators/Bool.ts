import { Validator, ValidatorInput } from "../..";


export default class VarString extends Validator {

	name = 'boolean';
	aliases = ['bool']
	_VLang = new Map();

	compile(data: ValidatorInput): string {
		if(data.optional)
			return `if(typeof ${data.variable}==='boolean'){%INPUT%}else if(typeof ${data.variable}!=='undefined')err('${data.variable}','Object must be of type boolean.')`
		return `if(typeof ${data.variable}==='boolean'){%INPUT%}else err('${data.variable}','Object must be of type boolean.')`
	}
}