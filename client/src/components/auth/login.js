import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from '../../actions/index';
import { loginUser, facebookLoginUser } from '../../actions/auth';
var Recaptcha = require('react-recaptcha');
import cookie from 'react-cookie';

const form = reduxForm({
  form: 'login',
});

// specifying your onload callback function
var callback = function () {
  console.log('Done!!!!');
};

class Login extends Component {

    
 constructor(props, context) {
        super(props, context);
        this.state = {
            recaptcha_value: '',
        };
    }   
    
    

  handleFormSubmit(formProps) {
    try{
      if($('#login_form').valid()){
        // console.log("VALID IN LOGIN>JS")
        // console.log(formProps)
        this.props.loginUser(formProps).then(
         (response)=>{
          // console.log("%%%%%%%%%%% login.js %%%%%%%%%%%");
           console.log('response: '+JSON.stringify(response));
         },
         (err) => err.response.json().then(({errors})=> {
          // console.log("%%%%%%%%%%% ERRR login.js %%%%%%%%%%%");
           console.log('err: '+JSON.stringify(err));
         })
       )
      }
    }catch(e){console.log("Catch")}
  }

  // specifying verify callback function
  verifyCallback = function (response) {
    console.log('verifyCallback '+response);
    $('#hiddenRecaptcha').val(response);
    var recaptcha_value = response;
    this.setState({
        recaptcha_value
    });
  };

  componentDidMount(){
    $(document).ready(function(){
      jQuery("#login_form").validate({
        rules: {
             email: { required: true, email: true },
             password: { required: true },
             hiddenRecaptcha: { required: true }
        },
        messages: {
             email: { required: "Please enter this field" },
             password:{ required: "Please enter this field" },
             hiddenRecaptcha:{ required: "Please enter this field" }
        }
      });
    });
    
    console.log('*** requiredLogin ***'+ cookie.load('requiredLogin'));
  }

  handleFacebookClick() {
    window.open(`${API_URL}/auth/facebook`, 'sharer', 'toolbar=0,top=50,status=0,width=748,height=525');
  }
  
  renderRequiredLogin_for_session(){
      const requiredLogin_msg = cookie.load('requiredLogin_for_session');
      cookie.remove('requiredLogin_for_session', { path: '/' });
      return (
            <div className="alert alert-warning">
                <strong>{ requiredLogin_msg } </strong>
                <a href="#" className="close" data-dismiss="alert" aria-label="close" title="close">×</a>
            </div>
        );
  }

  render() {
    const { handleSubmit } = this.props;
    return (
        <div className="col-sm-6 col-sm-offset-3">
          <div className="page-title text-center"><h2>Login</h2></div>
          
              { cookie.load('requiredLogin_for_session') ? this.renderRequiredLogin_for_session() : '' } 
  
          <p className="text-center">Login to access awesome features.</p>
          <form id="login_form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <div className="form-group">
              <label>Email</label>
              <Field name="email" className="form-control" required component="input" type="text" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <Field name="password" className="form-control" required component="input" type="password" />
            </div>
            <div className="form-group text-center g-recaptcha-wrapper">
            {/* <Field id="hiddenRecaptcha" name="hiddenRecaptcha" className="g-recaptcha" required component="input" type="text" /> */}
                <input type="text" name="hiddenRecaptcha" value={ this.state.recaptcha_value } id="hiddenRecaptcha" class="g-recaptcha error" required="" />
              <Recaptcha sitekey="6LeMERsUAAAAACSYqxDZEOOicHM8pG023iDHZiH5" render="explicit" onloadCallback={callback} verifyCallback={this.verifyCallback.bind(this)} />
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>

          <div className="form-group social-login text-center">
            <p>OR</p>
            <a href="javascript:void()" onClick={this.handleFacebookClick} className="btn btn-default facebook"> <i className="fa fa-facebook modal-icons"></i> Sign In with Facebook </a>&nbsp;
            {/*}
            <a href="javascript:void()" onClick={this.handleTwitterClick} className="btn btn-default twitter"> <i className="fa fa-twitter modal-icons"></i> Sign In with Twitter </a>&nbsp;
            <a href="javascript:void()" className="btn btn-default google"> <i className="fa fa-google-plus modal-icons"></i> Sign In with Google </a>
            {*/}
          </div>
          <div className="form-group text-center">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  //console.log('state: '+JSON.stringify(state));
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, { loginUser,facebookLoginUser })(form(Login));
