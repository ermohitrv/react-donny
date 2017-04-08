import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { ExpertSendReply,FetchExpertConversation } from '../../actions/messaging';
import * as actions from '../../actions/messaging';
import $ from 'jquery'

const form = reduxForm({
  form: 'expertReplyMessage',
});
const socket = actions.socket;

class ExpertReplyMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      composedMessage: ''
    }

    /*
    //= ===============================
    // Expert-Session Messaging sockets
    //= ===============================
    */
    socket.emit('expert enter session', this.props.sessionOwnerUsername);

    // Listen for 'refresh expert session messages' from socket server
    socket.on('refresh expert session messages', (data) => {

        console.log('refresh expert session messages '+this.props.sessionOwnerUsername);
        this.props.FetchExpertConversation(this.props.sessionOwnerUsername);

    });

    /*$(document).ready(function() {
      $('.emojionearea-editor').on('onKeyDown',function(e){
        console.log( e.target.value );
        this.setState({ composedMessage : e.target.value });
        if (e.keyCode == 13 || e.which == 13) {
          alert('enter')
          e.preventDefault();
          this.handleFormSubmit();
        }
      });
    });*/
  }

  componentWillUnmount() {
    socket.emit('expert leave session', this.props.sessionOwnerUsername);
  }

  handleChange(e, name) {
    this.setState({ composedMessage : e.target.value });
  };

  onKeyDown (e,name) {
    if (e.keyCode == 13) {
      e.preventDefault();
      this.handleFormSubmit();
    }
  }

  handleFormSubmit() {
    console.log('in');
    this.props.ExpertSendReply(this.props.sessionOwnerUsername, this.props.messageReceiverEmail, this.props.messageSenderEmail,this.state.composedMessage);
    this.setState({ composedMessage : "" });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    } else if (this.props.message) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.props.message}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        {this.renderAlert()}
        <div className="form-group">
          <textarea name="composedMessage" value={this.state.composedMessage} id="composedMessage" onKeyDown={ (e) => this.onKeyDown(e, 'composedMessage') } onChange={ (e) => this.handleChange(e, 'composedMessage') } required rows="3" autoComplete="off" placeholder="Your message here" className="form-control"></textarea>
            {/*}
            <div className="SendBtn_action">
              <li><a href="#"><i className="fa fa-smile-o" aria-hidden="true"></i></a></li>
              <li><button action="submit" className="btnNull"><i className="fa fa-paper-plane" aria-hidden="true"></i></button></li>
            </div>
            {*/}
       </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    recipients: state.communication.recipients,
    errorMessage: state.communication.error,
  };
}

export default connect(mapStateToProps, { ExpertSendReply, FetchExpertConversation })(form(ExpertReplyMessage));
