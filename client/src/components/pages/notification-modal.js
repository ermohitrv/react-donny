import React, { Component } from 'react';
import { connect } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { rechargeVideoSession } from '../../actions/expert';
import { CLIENT_ROOT_URL, errorHandler } from '../../actions/index';

class NotificationModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { responseTextMsg : "" };
    const userEmail = this.props.userEmail;
  }

  onToken(stripeToken){
    try{
      const amount = 30;  //default initial time is 30 minutes
      const userEmail = this.props.userEmail;
      const expertSlug = this.props.expertSlug;

      this.props.rechargeVideoSession({stripeToken, expertSlug, userEmail, amount}).then(
      	(response)=>{
          console.log('response: '+JSON.stringify(response));
      	},
      	(err) => err.response.json().then(({errors})=> {
          console.log('err: '+JSON.stringify(err));
       	})
      )
    }catch(e){}
  }

  render() {
    return (
      <div id={this.props.modalId} className="modal fade continueshoppingmodal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header text-center">
                <button type="button" className="close" data-dismiss="modal">×</button>
                <h4 className="modal-title">Message</h4>
            </div>
            <div className="modal-body text-center">
                {this.props.modalMessage}
                <div dangerouslySetInnerHTML={{__html: this.state.responseTextMsg}}/>
            </div>
            <div className="modal-footer">
              <div className="bootstrap-dialog-footer">
                <div className="bootstrap-dialog-footer-buttons text-center">
                  <StripeCheckout token={this.onToken.bind(this)} stripeKey="pk_test_s744wYvqQUrpqsXGLnUBUFRw" panelLabel="Pay Now!" name="Donny's List Wallet Money"> <a href="javascript:void()" className="btn btn-primary">Add Money to Wallet</a></StripeCheckout>
                </div>
              </div>
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

export default connect(mapStateToProps, { rechargeVideoSession })(NotificationModal);
