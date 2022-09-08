import { ASN, regexTable, ValidatorType } from "../..";


export default class ValFloat extends ValidatorType {
	name = 'float'

	parse(node: ASN) {
		if(!regexTable.float.test(node.value)) throw new Error(`(1)Input isn\'t a float.\n${node.line}: ${node.type} = ${node.value}`);
		if(isNaN(parseFloat(node.value)))      throw new Error(`(2)Input isn\'t a float.\n${node.line}: ${node.type} = ${node.value}`);
	}
}