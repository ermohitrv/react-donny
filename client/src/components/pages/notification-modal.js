import React, { Component } from 'react';
import { connect } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { rechargeVideoSession } from '../../actions/expert';

class LoginModal extends Component {
  onToken(stripeToken){

    try{

      const amount = 30;  //default initial time is 30 minutes
      const expertEmail = this.state.expertEmail;
      console.log('state expertEmail: '+expertEmail);

      this.props.rechargeVideoSession({stripeToken, expertEmail, amount}).then(
      	(response)=>{
          this.setState({responseTextMsg : "<div class='alert alert-success text-center'>"+response.message+"</div>"});
          setTimeout(function(){
            $('.alert').text("");
            $('.alert').removeClass("alert alert-success text-center");
            $("input[name='text_email").val("");
            $("textarea[name='text_message").val("");
          },2500);
      	},
      	(err) => err.response.json().then(({errors})=> {
       		this.setState({responseTextMsg : "<div class='alert alert-danger text-center'>"+errors+"</div>"});
          setTimeout(function(){
            $('.alert').text("");
            $('.alert').removeClass("alert alert-success text-center");
            $("input[name='text_email").val("");
            $("textarea[name='text_message").val("");
          },2500);
       	})
      )
    }catch(e){}

  }

  render() {
    return (
      <div id={this.props.modalId} className="modal fade continueshoppingmodal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">×</button>
                <h4 className="modal-title">Message</h4>
            </div>
            <div className="modal-body text-center">
                <div className="alert alert-danger">{this.props.modalMessage}</div>
                <StripeCheckout token={this.onToken.bind(this)} stripeKey="pk_test_s744wYvqQUrpqsXGLnUBUFRw" panelLabel="Pay Now!" name="Please recharge your account to initiate the session"> <a href="javascript:void()" className="btn btn-primary">Recharge Now!</a></StripeCheckout>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message
  };
}

export default connect(mapStateToProps, { rechargeVideoSession })(LoginModal);
