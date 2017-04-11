/**
 * Created by wujianbo on 15/12/8.
 */
/**
 * Usage: Set the ref of the form to be validated as :
 *     ref="vForm"
 * then pass down the props:
 *     rules
 *     messages
 * And you are all set to go!
 *  [CAUTION]:  You will need to pass the [submit event handler] from the original Form to this ValidateableForm!
 *
 * Default rules ar in the [ defaultRules.js ]
 *
 * example: rules : {
 *              field1: {
 *                  number: true,
 *                  required: true
 *              },
 *              field2: {
 *                  email: true,
 *                  space: /\b/
 *              }
 *          }
 *          messages : {
 *              field1: {
 *                  number: 'Please Input A Valid Number !',
 *                  required: 'Please Input Field1 !'
 *              }
 *          }
 */
import React from 'react';
import ReactDom from 'react-dom';
import _defaultRules from './defaultRules';
import _defaultMessages from './defaultMessages';
import assign from 'object-assign';
require('./ValidateableForm.css');

let __OriginFromSubmitHandler = function(){};
const _defaultMessage = 'Input is not valid.';

function insertMessageAfterInput (messages){
    let inputClassName = this.className.split(/\s+/);
    if(inputClassName.indexOf('text-red') === -1){
        inputClassName.push('text-red');
    }
    else {
        //Do Noting
    }
    this.className = inputClassName.join(' ');
    if(this.nextSibling && this.nextSibling.className === 'validate-message'){
        this.nextSibling.innerText = messages[0];
    }
    else{
        let messageNode = document.createElement('span');
        messageNode.innerText = messages[0];
        messageNode.className = 'validate-message';
        if(this.nextSibling && this.parentNode){
            this.parentNode.insertBefore(messageNode, this.nextSibling);
        }
        else if(this.parentNode) {
            this.parentNode.appendChild(messageNode);
        }
        else {
            throw "Don't have a parent Node?  Impossible!"
        }
    }
}
function deleteMessageAfterInput (){
    let inputClassName = this.className.split(/\s+/);
    while(inputClassName.indexOf('text-red') !== -1){
        inputClassName.splice(inputClassName.indexOf('text-red'), 1);
    }
    this.className = inputClassName.join(' ');
    if(this.nextSibling && this.nextSibling.className === 'validate-message'){
        this.nextSibling.innerText = '';
    }
    else {
        //Do Nothing
    }
}

const VFrom = React.createClass({
    getDefaultProps (){
        return {
            rules: {},
            messages: {},
            onSubmit(){},
            messageClassName: ''
        }
    },
    getInitialState (){
        return {
            fitRule: true,
            messages: []
        }
    },
    findChildInputByName (name){
        const _theForm = ReactDom.findDOMNode(this.refs['vForm']);
        return _theForm.querySelector('[name=' + name + ']');
    },
    addChangeValidator (name){
        const rules = assign({}, this.props.rules[name]);
        return this.validate(rules, this.props.messages[name] || {});
    },
    validate (rules, messages){
        return (event) => {
            let value = event.target.value,
                testFlag = true,
                popMessages = [],
                input = event.target;
            for(let i in rules){
                if(rules.hasOwnProperty(i) && rules[i]){
                    if(Object.prototype.toString.call(rules[i]) === '[object RegExp]'){
                        //If the rule itself is a RegExp Object
                        if(!rules[i].test(value)){
                            //If you break the rules
                            testFlag = false;
                            popMessages.push(messages[i] || _defaultMessage);
                        }
                        else {
                            //Do Nothing
                        }
                    }
                    else if(Object.prototype.toString.call(rules[i]) === '[object Function]'){
                        //If the rule itself is a Function.
                        if(!rules[i](value)){
                            testFlag = false;
                            popMessages.push(messages[i] || _defaultMessage);
                        }
                        else {
                            //Do Nothing
                        }
                    }
                    else {
                        if(!_defaultRules[i]){
                            if(!_defaultRules['_NOT_' + i]){  //没有这条规则
                                throw 'ERROR: Rule: ' + i + ' is not defined.';
                            }
                            else { //If there is a anti-rule of this current rule
                                if(_defaultRules['_NOT_' + i].test(value)){
                                    testFlag = false;
                                    popMessages.push(messages[i] || _defaultMessages[i]);
                                }
                                else {
                                    //Do Nothing
                                }
                            }
                        }
                        else { //If there is a Default Rule.
                            if(Object.prototype.toString.call(_defaultRules[i]) === '[object RegExp]'){
                                if(!_defaultRules[i].test(value)){
                                    testFlag = false;
                                    popMessages.push(messages[i] || _defaultMessages[i]);
                                }
                                else {
                                    //Do Nothing
                                }
                            }
                            else if(Object.prototype.toString.call(_defaultRules[i]) === '[object Function]') {
                                if(!_defaultRules[i](rules[i], value)){
                                    testFlag = false;
                                    popMessages.push(messages[i] || (_defaultMessages[i] + rules[i]));
                                }
                            }
                        }
                    }
                }
            }
            if(testFlag){
                deleteMessageAfterInput.call(input, popMessages);
            }
            else {
                insertMessageAfterInput.call(input, popMessages);
            }
            return testFlag;
        }
    },
    componentDidMount (){
        const rules = this.props.rules;
        if(this.refs['vForm']){
            const _theForm = ReactDom.findDOMNode(this.refs['vForm']);
            _theForm.addEventListener('submit', this.valid);
            for(let i in rules){
                if(rules.hasOwnProperty(i)){
                    let input = this.findChildInputByName(i);
                    if(input){
                        input.onkeyup = this.addChangeValidator(i);
                    }
                    else {
                        throw 'ERROR: There is no input name as :' + i + ' !'
                    }
                }
            }
        }
        else {
            throw 'ERROR: Did not found a Form to validate. Make sure you set the ref of the Form as "vForm".'
        }
    },
    valid (event){
        if(this.refs['vForm']){
            const rules = this.props.rules;
            let testFlag = true;
            for(let i in rules){
                if(rules.hasOwnProperty(i)){
                    let input = this.findChildInputByName(i);
                    if(input){
                        testFlag = this.validate(this.props.rules[i], this.props.messages[i] || {})({target: input});
                    }
                    else {
                        throw 'ERROR: There is no input name as :' + i + ' !'
                    }
                }
            }
            if(!testFlag){
                event.preventDefault();
                event.stopPropagation();
            }
            else {
                this.props.onSubmit(event);
            }
        }
        else {
            throw 'ERROR: Did not found a Form to validate. Make sure you set the ref of the Form as "vForm".'
        }
    },
    render (){
        return(
            <div>
                {React.Children.map(this.props.children, (element) => {
                    return React.cloneElement(element, { ref: element.ref });
                    })}
            </div>
        )
    }
});

export default VFrom;
module.exports = VFrom;