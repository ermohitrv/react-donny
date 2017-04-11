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
      audioCallFrom: '',
      email: this.props.email,
      sessionId: '',
      apiToken: ''
      
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
    
    
    //alert(this.props.expertEmail);
  }
  open() { this.setState({showModal: true}); }

  disconnectCall() {this.setState({showModal: false}); }

  connectCall(){
    this.setState({showModal: false});
    
    const email = this.state.email;

    this.props.audioCallTokenRequest({ email  }).then(
      (response)=>{
        //alert('success '+ JSON.stringify(response) );

        //console.log('**** createAudioSession this.state.sessionId ****'+ JSON.stringify(response) );
            this.setState({sessionId  : response.sessionId });
            this.setState({apiToken   : response.token });
            var session = OT.initSession('45801242', this.state.sessionId);

            //const expertAudioCallSokcetname = this.state.expertAudioCallSokcetname;
            //const audioCallFrom = this.state.currentUser.firstName + ' ' + this.state.currentUser.lastName;

            session.on('streamCreated', function(event){
                console.log('streamCreated');
                console.log('streamCreated');
                var options = {width:200, height:100};
                var subscriber = session.subscribe(event.stream, 'userSubscriberAudio' , options);
            });

            session.on('connectionCreated', function(event){
                console.log('connectionCreated');
            });

            session.on('connectionDestroyed', function(event){
                console.log('connectionDestroyed');
            });

            session.on('streamDestroyed', function(event){
                console.log('streamDestroyed');
            });

            session.connect(this.state.apiToken, function(error){
                if(error){
                    console.log('session connection error');
                } else {
                    //var publisher = OT.initPublisher('45801242', 'publisher',{width:'100%', height:'603px'});
                    //session.publish(publisher);
                    var pubOptions = {videoSource: null, width:200, height:100};
                    var publisher = OT.initPublisher('expertPublisherAudio', pubOptions);
                    session.publish(publisher);

                    //publisher.publishVideo(false);
                }
            });
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
            onHide={this.disconnectCall}
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
                <div id="expertPublisherAudio"></div>
                <div id="userSubscriberAudio"></div>
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
