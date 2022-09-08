import { ASN, regexTable, ValidatorType } from "../..";


export default class ValInt extends ValidatorType {
	name = 'int'

	parse(node: ASN) {
		if(!regexTable.int.test(node.value)) throw new Error(`Input isn\'t a integer.\n${node.line}: ${node.type} = ${node.value}`);
		if(isNaN(parseInt(node.value)))      throw new Error(`Input isn\'t a integer.\n${node.line}: ${node.type} = ${node.value}`);
	}
}