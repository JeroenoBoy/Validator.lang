import { join } from 'path';
import { inspect } from 'util';
import { VLang } from '..';

console.time('Compile time');

const vlang = new VLang();
vlang.add('user', join(__dirname, '../../VLang/user.vlang'));

console.timeEnd('Compile time');
//	@ts-ignore
console.log(vlang.validators.get('user').toString())
console.time('Parse time');


const t = vlang.parse('user', {
	id: 'abcdef1234567890',
	name: 'Johnny',
	array: [{test: 'test'}]
})

console.timeEnd('Parse time');
console.log(inspect(t, false, null, true));

//
//
//	if(typeof ${data.variable}==='array') {
//		for(let ${_v = data.uniqueVar()} = 0; _v < ${data.variable.length}; i__) {
//			%INPUT%
//		}
//	}
//
//
//