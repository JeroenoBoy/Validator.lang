import { readFileSync } from "fs";
import { compile } from "..";


export class VLang {
	private validators = new Map<string, (input: string) => null | any>();


	add(name: string, dir: string) {
		const file = readFileSync(dir, 'utf-8');
		this.validators.set(name, compile(file));
	}


	parse(name: string, input: any) {
		if(!this.validators.has(name))
			return new Error('this validator doesn\'t exist!');
		return this.validators.get(name)!(input);
	}
}