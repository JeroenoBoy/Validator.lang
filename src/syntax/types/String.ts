import { ASN, regexTable, ValidatorType } from "../..";


export default class ValString extends ValidatorType {
	name = 'string'

	parse(node: ASN) {
		if(!regexTable.string.test(node.value)) throw new Error(`Input isn\'t a string.\n${node.line}: ${node.type} = ${node.value}`);
	}
}