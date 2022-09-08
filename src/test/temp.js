const { cloneDeep } = require('lodash');
const { type } = require('os');
console.log(((input) => {
    input = cloneDeep(input);
    let e = {};
    let checkDelete = (t, _e) => {
        t = t.split('.');
        t.shift();
        let r = e;
        let _i = input;
        for (let i of t) {
            if (!r[i]) r[i] = {};
            r = r[i];
            _i = _i[i];
        }
        for (let i in _i) {
            if (!r[i]) r[i] = {
                _errors: []
            };
            r[i]._errors.push(_e);
        }
    };
    let err = (t, err) => {
        t = t.split('.');
        t.shift();
        let r = e;
        for (const i in t) {
            if (!r[t[i]]) e[t[i]] = {};
            r = e[t[i]];
        }
        if (!r._errors) r._errors = [];
        r._errors.push(err);
    };
    if (typeof input === 'object') {
        if (typeof input.id === 'string') {
            if (input.id.length !== 16) err('input.id', 'This variable can only be 16 characters long.');
            if (!/^[0-9a-fA-F]+$/.test(input.id)) err('input.id', "This variable didn't match the RegExp");
        } else err('input.id', 'Invalid object type.');
        if (typeof input.name === 'string') {
            if (input.name.length < 5) err('input.name', 'This variable can only be 5 characters long.');
            if (input.name.length > 16) err('input.name', 'This variable can only be 16 characters long.');
        } else err('input.name', 'Invalid object type.');
        if (Array.isArray(input.array)) {
            for (let rv_0 = 0; rv_0 < input.array.length; rv_0++) {
                if (typeof input.array[rv_0] === 'object') {
                    console.log(typeof input.array[rv_0].test)
                    if (typeof input.array[rv_0].test === 'string') {} else err('input.array[rv_0].test', 'Invalid object type.');
                } else err('input.array[rv_0]', 'Invalid object type.');
            }
        } else err('input.array', 'Invalid object type.');
    } else err('input', 'Invalid object type.');
    if (Object.keys(e).length > 0) return e;
    delete input.id;
    delete input.name;
    delete input.array.test;
    if (Object.keys(input.array).length > 0) checkDelete('input.array', 'Invalid object.');
    delete input.array;
    if (Object.keys(input).length > 0) checkDelete('input', 'Invalid object.');
    return Object.keys(e).length === 0 ? null : e
})({
    id: 'abcdef1234567890',
    name: 'Johnny',
    array: [{
        test: 'test'
    }]
}));