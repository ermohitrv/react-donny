# React-form-validator
## A React Form Validator. The same API as jQuery.validator

Usage: Set the ref of the form to be validated as :
 
`ref="vForm"`
     
then pass down the props:

* rules
* messages

And you are all set to go!
 
**CAUTION**:  You will need to pass the **submit event handler** from the original Form to this ValidateableForm!

Default rules ar in the 
 
[defaultRules](https://github.com/0rangeT1ger/React-form-validator/blob/release/source/defaultRules.js)

example: 
```
<ValidateableForm  
    onSubmit={this.console}
    rules={{
        input1: {
            required: true,
            numbers: true,
            minLength: 6
        },
        input2: {
            required: true,
            maxLength: 6
        },
        input3: {
            required: true,
            awesome (value){
                return value === 'awesome';
            }
        }}}>
    <form ref="vForm">
        <label>Please input Numbers!</label>
        <input type="text" name="input1"/>
        <br/>
        <label>Please input a Chinese IdCard Number!</label>
        <input type="text" name="input2"/>
        <br/>
        <label>Please awesome!</label>
        <input type="text" name="input3"/>
        <br/>
        <input type="submit"/>
    </form>
</ValidateableForm>
```

You may see the demo in the [demo.html](https://rawgit.com/0rangeT1ger/React-form-validator/release/demo/index.html)

**Update 0.0.11**: 

* You may now pass a function into your rules, which receive value and return true or false to validate
 your form.
* You may now use default rules : maxLength, minLength.
* Some default messages updated.

**Update 0.0.14**: 

You may use either

`const ValidateableForm =  require('react-form-validate');`

or

`import ValidateableForm from 'react-form-validate'; `

now.

**Update 1.0.1**: 

Fixed the most important bug: the export failure.

First time publishing something on npm... Sorry about my carelessness.

You can really and truly import and use this component now

**Update 1.0.2**:
 
 Fixed bugs under FireFox.
