import { ASN, ValidatorType } from "../..";


export default class ValRegex extends ValidatorType {
	name = 'regexp'

	parse(node: ASN) {
		try {
			const [ value, flags ] = node.value.split('||');
			node.value = new RegExp(value, flags).toString();
		}
		catch {
			throw new Error(`Input isn\'t a valid RegExp.\n${node.line}: ${node.type} = ${node.value}`);
		}
	}
}