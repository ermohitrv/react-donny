import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { registerUser, facebookLoginUser } from '../../actions/auth';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from '../../actions/index';
import $ from 'jquery';
var Recaptcha = require('react-recaptcha');

const form = reduxForm({
  form: 'register'
});

const renderField = field => (
  <div>
    <input className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);

// specifying your onload callback function
var callback = function () {
  console.log('Done!!!!');
};

class Register extends Component {
  constructor(props, context) {
    super(props, context);

    $(document).ready(function(){
      console.log('test');
    });
  }

  // specifying verify callback function
  verifyCallback = function (response) {
    console.log('verifyCallback '+response);
    $('#hiddenRecaptcha').val(response);
  };

  componentDidMount(){

    $(document).ready(function(){

      // register form Validation
      jQuery("#signup_form").validate({
          rules: {
             firstName: {
                 required: true
             },
             lastName: {
                 required: true
             },

              hiddenRecaptcha: {
                  required: true,
              },
              email: {
                  required: true,
                  email:true,
                  remote: {
                      url: "/checkemail",
                      type: "post",
                      data: {
                          action: function () {
                              return "checkemail";
                          },
                          username: function() {
                              var emailAddress = $('input[name=email]').val();
                              return emailAddress;
                          }
                      },
                      dataFilter: function(response) {
                          return checkEmailSuccess(response);
                      }
                  }
              },
              password: {
                  required: true,
                  minlength: 6
              },
              password1: {
                  required: true,
                  equalTo: "#password"
              },
              confirm_joining:{
                  required: true,
              },
              confirm_age:{
                  required: true,
              }
           },
           messages: {
             firstName:{
               required: "Please enter this field",
             },
             lastName:{
               required: "Please enter this field",
             },
             username: {
                  remote: "Sorry, our system has detected that an account with this username already exists!"
              },
              email: {
                  required: "Please enter this field",
                  remote: "Sorry, our system has detected that an account with this email address already exists!"
              },

              password:{
                required: "Please enter this field",
              },
              password1: {
                  equalTo: "Password and Confirm Password must be same!"
              },
              hiddenRecaptcha:{
                  required: "Please enter recaptcha",
              }
           },
           submitHandler: function(form) {
              form.submit();
           }
      });
    });
  }

  handleFormSubmit(formProps) {
    this.props.registerUser(formProps);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div>
          <span><strong>Error!</strong> {this.props.errorMessage}</span>
        </div>
      );
    }
  }
  handleFacebookClick() {
    window.open(`${API_URL}/auth/facebook`, 'sharer', 'toolbar=0,top=50,status=0,width=748,height=525');
  }
  render() {
    const { handleSubmit } = this.props;

    return (
    <div className="col-sm-6 col-sm-offset-3">
      <div className="page-title text-center"><h2>Signup</h2></div>
      <p className="text-center">Signup to access awesome features.</p>
      <form id="signup_form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        {this.renderAlert()}
        <div className="row">
          <div className="col-md-6 form-group">
            <label>First Name</label>
            <Field name="firstName" className="form-control" required component={renderField} type="text" />
          </div>
          <div className="col-md-6 form-group">
            <label>Last Name</label>
            <Field name="lastName" className="form-control" required component={renderField} type="text" />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12">
            <label>Email</label>
            <Field name="email" className="form-control" required component={renderField} type="text" />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12">
            <label>Password</label>
            <Field name="password" className="form-control" required component={renderField} type="password" />
          </div>
        </div>

        <div className="form-group text-center g-recaptcha-wrapper">
          <input type="text" class="form-control g-recaptcha" id="hiddenRecaptcha" name="hiddenRecaptcha"  />
          <Recaptcha  sitekey="6LeMERsUAAAAACSYqxDZEOOicHM8pG023iDHZiH5"  render="explicit" onloadCallback={callback} verifyCallback={this.verifyCallback.bind(this)} />
        </div>

        <div className="form-group text-center">
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
      <div className="form-group social-login text-center">
        <p>OR</p>
        <a href="javascript:void()" onClick={this.handleFacebookClick} className="btn btn-default facebook"> <i className="fa fa-facebook modal-icons"></i> Sign Up with Facebook </a>&nbsp;
        {/*}
        <a href="javascript:void()" onClick={this.handleTwitterClick} className="btn btn-default twitter"> <i className="fa fa-twitter modal-icons"></i> Sign In with Twitter </a>&nbsp;
        <a href="javascript:void()" className="btn btn-default google"> <i className="fa fa-google-plus modal-icons"></i> Sign In with Google </a>
        {*/}
      </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, { registerUser })(form(Register));
