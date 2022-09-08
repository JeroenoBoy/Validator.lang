import { Validator, ValidatorInput } from "../..";
import { ASN, symbols } from "../../Parsing/Parser";
import { ParseValidatorsInput } from "../../syntaxUtils";


export default class VarObject extends Validator {

	name = 'array';
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


	compile(_: ValidatorInput): string {
		let v = _.uniqueVar();

		const str = _.parse(`${_.variable}[${v}]`, _.node.nest!);

		if(_.optional)
			return `if(Array.isArray(${_.variable})){for(let ${v} = 0; ${v} < ${_.variable}.length; ${v}++){${str}}else if(typeof ${_.variable}!=='undefined')err('${_.variable}','Invalid object type.')`
		return `if(Array.isArray(${_.variable})){for(let ${v} = 0; ${v} < ${_.variable}.length; ${v}++){${str}}}else err('${_.variable}','Invalid object type.')`
	}
}