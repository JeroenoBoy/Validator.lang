// Input
`
title : STRING
// test
id : STRING
	size = 16

nest
	test : STRING
		size = 5
`

//	Output

let _t = (_) => {
	input = JSON.parse(JSON.stringify(_));

	//	BOILERPLATE

	var e = {};

	var checkDelete=(t,_e)=>{
		t=t.split('.');
		t.shift();

		let r = e;
		let _i = input;
		for(var i of t) {
			if(!r[i]) r[i]={};
			r = r[i];_i = _i[i];
		}
		for(var i in _i) {
			if(!r[i]) r[i] = {_errors: []};
			r[i]._errors.push(_e);
		}
	}
	var err=(t, err)=>{
		t = t.split('.');
		t.shift();

		let r = e;
		for(const i in t) {
			if(!r[t[i]]) e[t[i]] = {};
			r = e[t[i]];
		}

		if(!r._errors) r._errors = [];
		r._errors.push(err);
	}

	//	generated
	if(typeof input != 'object') err('input', 'Invalid object type.')
	if(typeof input.title != 'string') err('input.title', 'Invalid object type.')
	if(typeof input.id != 'string') err('input.id', 'Invalid object type.')
	if(typeof input.nest != 'object') err('input.nest', 'Invalid object type.')
	if(typeof input.nest.test != 'string') err('input.nest.test', 'Invalid object type.')

	//	checking for overflow

	if(Object.keys(e).length>0)return e;

	delete input.title;
	delete input.id;
	delete input.nest.test;
	if(Object.keys(input.nest)!=0)checkDelete('input.nest', 'Invalid object.');
	delete input.nest;
	if(Object.keys(input)!=0)checkDelete('input', 'Invalid object.');


	return Object.keys(e).length===0?null:e
}

// (input)=>{input=JSON.parse(JSON.stringify(input));let e={};let checkDelete=(t,_e)=>{t=t.split('.');t.shift();let r=e;let _i=input;for(let i of t) {if(!r[i])r[i]={};r=r[i];_i=_i[i];}for(let i in _i) {if(!r[i])r[i]={_errors:[]};r[i]._errors.push(_e);}};let err=(t,err)=>{t=t.split('.');t.shift();let r=e;for(const i in t){if(!r[t[i]])e[t[i]]={};r=e[t[i]];}if(!r._errors)r._errors=[];r._errors.push(err);};%INSERT%if(Object.keys(e).length>0)return e;%OVERFLOW%return Object.keys(e).length===0?null:e}

console.log(_t({
	title: 'abcd',
	id: 'tet',
	nest: { test:'kek', hehe: 'erer' },
	abc: 'efg'
}))