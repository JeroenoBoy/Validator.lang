# Validation made easy

Easy create body validations using Validator.lang!

This package is still in development, so it may have some bugs.

## Usage

```js

import { SimpleValidator } from 'validatorlang'

const validator = new SimpleValidator(`
	Validator {
		string name @minLength(5) @maxLength(20)
		number age @optional
		bool isAdult
		Adress adress
	}

	Address {
		string state
		string city
		string street
		number number
	}
`).build();

const result = validator.validate({
	name: 'John',
	age: 20,
	isAdult: true
});

if (result !== true) throw result;

```

## Planned features

- [ ] Add more validations
- [x] Add array support
- [ ] Finish Advanced validator
- [ ] Add support for enums
- [ ] Add support for building validators from a directory
- [ ] Add types for typescript for builded validators

## Validators

### string

Normal behaviour: Checks if the value is a string.

extra validators:
```
@minLength(int size) - Minimum length of the string
@maxLength(int size) - Maximum length of the string
@pattern(Regex regex) - Checks if the string matches the regex
@containsLowercase - Checks if the string contains a lowercase letter
@containsUppercase - Checks if the string contains a uppercase letter
@containsNumber - Checks if the string contains a number
@containsSpecial - Checks if the string contains a special character
```

### number

normal behaviour: Checks if the value is a number.

extra validators:
```
@min(int size) - Minimum value of the number
@max(int size) - Maximum value of the number
@integer - Checks if the number is an integer
```

### bool

normal behaviour: Checks if the value is a boolean.

### Object

normal behaviour: Checks if the value is an object.


## Global validators

```
@optional - Makes the type optional (has no default implementation, must be handled by the Type)
@custom(string name) - Adds a custom validator, can be added using Validator#addValidator
```


# License
MIT License

Copyright (c) 2022 JeroenoBoy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

