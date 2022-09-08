import { Validator, ValidatorInput } from "../..";
import { ASN, symbols } from "../../Parsing/Parser";
import { ParseValidatorsInput } from "../../syntaxUtils";


export default class VarObject extends Validator {

	name = 'object';
	_VLang = new Map();


	parse(_: ParseValidatorsInput): ASN {
		return {
			id: symbols.var,
			line: _.node.line,
			type: this.name,
			value: _.name,
			nest: _.nest(_.tabCount+1)
		}
	}


	compile(data: ValidatorInput): string {
		if(data.optional)
			return `if(typeof ${data.variable}==='string'){%INPUT%}else if(typeof ${data.variable}!=='undefined')err('${data.variable}','Invalid object type.')`
		return `if(typeof ${data.variable}==='string'){%INPUT%}else err('${data.variable}','Invalid object type.')`
	}
}