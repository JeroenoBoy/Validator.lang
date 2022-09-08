import { ASN, ValidatorType } from "../..";


export default class ValFloat extends ValidatorType {
	name = 'bool'

	parse(node: ASN) {
		if(!(node.value.toLowerCase() == 'true' || node.value.toLowerCase() == 'false')) throw new Error(`(1)Input isn\'t a number.\n${node.line}: ${node.type} = ${node.value}`);
	}
}