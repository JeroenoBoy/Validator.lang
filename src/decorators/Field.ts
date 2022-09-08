import { Validator } from "..";

export function Field(name: string, type: string) {
	return (target: Validator, key: string | symbol, _: PropertyDescriptor) => {
		
		if(typeof target._VLang === 'undefined') target._VLang = new Map();
		
		target._VLang.set(name, {name, key, type});

		return _;
	}
}