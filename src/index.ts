import { join } from "path";
import { compiler } from "./Parsing/Compiler";
import { lexer } from "./Parsing/Lexer";
import { parser } from "./Parsing/Parser";
import { Template, getSyntax } from "./syntaxUtils";

export * from './Parsing/Compiler';
export * from './Parsing/Lexer';
export * from './Parsing/Parser';
export * from './syntaxUtils';
export * from './util/VLang';

// Decorators
export * from './decorators/Field';

export const baseSyntax = getSyntax(join(__dirname, 'syntax'));
export const regexTable = {
	string: /^[a-z-_]+$/i,
	int: /^[0-9]{1,10}$/,
	float: /^[0-9]{1,30}([.,][0-9]{1,16})?$/
}


export const baseTemplate: Template = {
	base: `let {cloneDeep}=require('lodash');(input)=>{input=cloneDeep(input);let e={};let checkDelete=(t,_e)=>{t=t.split('.');t.shift();let r=e;let _i=input;for(let i of t) {if(!r[i])r[i]={};r=r[i];_i=_i[i];}for(let i in _i) {if(!r[i])r[i]={_errors:[]};r[i]._errors.push(_e);}};let err=(t,err)=>{t=t.split('.');t.shift();let r=e;for(const i in t){if(!r[t[i]])e[t[i]]={};r=e[t[i]];}if(!r._errors)r._errors=[];r._errors.push(err);};%INSERT%if(Object.keys(e).length>0)return e;%OVERFLOW%return Object.keys(e).length===0?null:e}`,
	object: `if(typeof %VARIABLE%==='object'){%INSERT%}else err('%VARIABLE%','Invalid object type.');`,
	optionalObject: `if(typeof %VARIABLE%==='object'){%INSERT%} else if(typeof %VARIABLE%!=='undefined')err('%VARIABLE%','Invalid object type.');`,
	array: `if(typeof %VARIABLE%==='array'){%INSERT%}else err('%VARIABLE%','Invalid object type.');`,
	optionalArray: `if(typeof %VARIABLE%==='array'){%INSERT%} else if(typeof %VARIABLE%!=='undefined')err('%VARIABLE%','Invalid object type.');`,
}



export const compile: (input: string) => (input: any) => null | any = (input: string) => eval(compiler(parser(lexer(input))));