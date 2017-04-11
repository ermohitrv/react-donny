/**
 * Created by wujianbo on 15/12/9.
 */
/**
 * Created by wujianbo on 15/12/8.
 */
import React from 'react';
import ReactDom from 'react-dom';
import ValidateableForm from '../index';

const App = React.createClass({
    console (event){
        console.log('simulate submit!');
        event.preventDefault();
        event.stopPropagation();
    },
    render (){
        return (
            <ValidateableForm  onSubmit={this.console}
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
                 }
                }}>
                <form ref="vForm" className="demo-validate-form">
                    <label>Please input at least 6 numbers!</label>
                    <input type="text" name="input1"/>
                    <br/>
                    <label>Please input no more than 6 letters!</label>
                    <input type="text" name="input2"/>
                    <br/>
                    <label>Please awesome!</label>
                    <input type="text" name="input3"/>
                    <br/>
                    <input type="submit"/>
                </form>
            </ValidateableForm>
        )
    }
});

ReactDom.render(
    <App />,
    document.getElementById('content')
);