import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import cookie from 'react-cookie';
import { Modal, Button, Panel } from 'react-bootstrap';
import * as actions from '../../actions/messaging';
import $ from 'jquery';
import { audioCallTokenRequest } from '../../actions/expert';

const socket = actions.socket;
const currentUser = cookie.load('user');
//console.log('currentUser: '+JSON.stringify(currentUser));

class ExpertAudioCall extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      audioCallFrom: ''
    };
    var self = this;
    this.open = this.open.bind(this);
    this.disconnectCall = this.disconnectCall.bind(this);
    this.connectCall = this.connectCall.bind(this);

    const user = cookie.load('user');
    if(user){ // user cookie is set
      const userRole = user.role
      if(userRole == 'Expert'){
        //console.log('**** username ****'+user.slug);
        const expertUsername = user.slug;
        socket.emit('expert audio call session', 'expert-audio-session-'+expertUsername);
      }
    }
    socket.on('audio call to expert', function(data){
        self.setState({
          audioCallFrom: data.audioCallFrom
        });
        self.open();
    });
  }
  open() { this.setState({showModal: true}); }

  disconnectCall() {this.setState({showModal: false}); }

  connectCall(){
    this.setState({showModal: false});

    this.props.audioCallTokenRequest().then(
      (response)=>{
        alert('success');
      },
      (err) => err.response.json().then(({errors})=> {
        alert('error');

      })
    )

    $('#expert-audio-call-interface-wrapper').fadeIn();
  }

  render() {
    return (
        <div>
          {/* modal for expert to notify audio call  */}
          <Modal className="modal-container"
            show={this.state.showModal}
            onHide={this.close}
            animation={true}
            bsSize="small">
            <Modal.Header closeButton>
              <Modal.Title>Audio Call from <strong>{this.state.audioCallFrom}</strong> </Modal.Title>
            </Modal.Header>
            <Modal.Body> Do you want to connect?</Modal.Body>
            <Modal.Footer>
              <Button bsStyle="danger" onClick={this.disconnectCall}>Disconnect</Button>
              <Button bsStyle="primary" onClick={ this.connectCall }>Connect</Button>
            </Modal.Footer>
          </Modal>
          {/* modal for expert to notify audio call  */}

          {/*  Expert Audio Calling interface : START */}
            <div id="expert-audio-call-interface-wrapper" className="expert-audio-call-interface-wrapper">
              <Panel header="Audio Calling..."  bsStyle="primary" >
                Hello this is epxert calling interface
              </Panel>
            </div>
          {/*  Expert Audio Calling interface : END */}

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    content: state.auth.content,
    messages: state.communication.messages
  };
}


export default connect(null, { audioCallTokenRequest })(ExpertAudioCall);
