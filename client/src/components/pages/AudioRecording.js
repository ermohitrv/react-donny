import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import cookie from 'react-cookie';
import { Modal, Button, Panel } from 'react-bootstrap';
import * as actions from '../../actions/messaging';
import $ from 'jquery';
import { startRecording, getArchiveSessionAndToken, stopRecording, sendRecording } from '../../actions/expert';
import axios from 'axios';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from '../../actions/index';

const socket = actions.socket;
const currentUser = cookie.load('user');
//console.log('currentUser: '+JSON.stringify(currentUser));

class AudioRecording extends Component {
    
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            error: '',
            expertEmail: "",
            apiKey: '',
            apiSecret: '',
            apiToken: '',
            currentUser: cookie.load('user'),
            startAudioRecording: false,
            archiveSessionId: '',
            archiveStreamtoken: '',
            archiveID: '',
            connectionId: '',
            showRecordingPopup: false,
            pubOptions: {width:150, height:150, insertMode: 'append'},
            publisher: '',
            sessionObj: ''
                    
                    
        };
    }
   
    componentDidMount() {
        var slug = this.props.expertSlug;
        axios.get(`${API_URL}/getExpertDetail/${slug}`)
        .then(res => {
            this.setState({expertEmail : res.data[0].email });
        })
        .catch(err => {
            this.setState({
              loading: false,
              error: err
            });
        });
    }
    
    
 startAudioRecording(){
        var self = this;
        const expertEmail = this.state.expertEmail;
        const userEmail = this.state.currentUser.email;
        const archiveSessionId = this.state.archiveSessionId;
        
        this.props.startRecording({expertEmail, userEmail, archiveSessionId}).then(
    	(response)=>{
            console.log('**** startRecording success ****'+ JSON.stringify(response) );
            this.setState({
                archiveID: response.archive.id,
                startAudioRecording: true
            });
            
              
        },
    	(err) => err.response.json().then(({errors})=> {
            console.log('**** startRecording error ****'+ JSON.stringify(errors) );
        })
    )


    };
    
    stopAudioRecording(){
      
        this.setState({
            //startAudioRecording: false 
        });


        var self = this;
        const expertEmail = this.state.expertEmail;
        const userEmail = this.state.currentUser.email;
        const archiveID = this.state.archiveID;

        this.props.stopRecording({expertEmail, userEmail, archiveID}).then(
            (response)=>{
                console.log('**** stopRecording success ****'+ JSON.stringify(response) );
            },
            (err) => err.response.json().then(({errors})=> {
                console.log('**** stopRecording error ****'+ JSON.stringify(errors) );
            })
        )

  };
    
    
 audioRecordingPopup(mode){
    const self = this;
    const expertEmail = this.state.expertEmail;
    const userEmail = this.state.currentUser.email;
    const archiveSessionId = this.state.archiveSessionId;
    
    var pubOptions = this.state.pubOptions;
    var publisher = this.state.publisher;
    var session = this.state.sessionObj;
    
    if(mode == 'open'){
    this.props.getArchiveSessionAndToken({ expertEmail, userEmail, archiveSessionId }).then(
      (response) =>{
        const archiveSessionId = response.archiveSessionId;
        const archiveStreamtoken = response.archiveStreamtoken;
        this.setState({
            archiveSessionId  : archiveSessionId,
            archiveStreamtoken: archiveStreamtoken,
            //showRecordingPopup: true
        });
        
        session = OT.initSession('45801242', archiveSessionId);
        
        this.setState({
            sessionObj: session
        });
        
        session.connect(archiveStreamtoken, function(err, info) {
            if(err) {
              console.log(err.message || err);
            } else {
                publisher = OT.initPublisher('publisherRecordAudio', pubOptions);
                session.publish(publisher);
                publisher.publishVideo(false);
                
                self.setState({
                    showRecordingPopup: true,
                    publisher: publisher
                });
                
            }

        });
        
        
        session.on('archiveStarted', function(event) {
              var archiveID = event.id;
              self.setState({
                  archiveID: archiveID,
                  startAudioRecording: true
              });

              console.log("ARCHIVE STARTED");

            });

            session.on('archiveStopped', function(event) {
                
                //session.unpublish(publisher);
                //session.disconnect();
                //session.forceDisconnect(self.state.connectionId);
                
                const expertEmail = self.state.expertEmail;
                const userEmail = self.state.userEmail;
                var archiveID = event.id;
                
                
                setTimeout(function(){
                    self.props.sendRecording({expertEmail, userEmail, archiveID}).then(
                        (response)=>{
                            console.log('**** sendRecording success ****'+ JSON.stringify(response) );
                            archiveID = null;
                            self.setState({
                                archiveID: archiveID
                            });
                        },
                        (err) => err.response.json().then(({errors})=> {
                            console.log('**** sendRecording error ****'+ JSON.stringify(errors) );
                        })
                    )
                }, 8000);
                
                
                
                
                self.setState({
                  //archiveID: archiveID,
                  startAudioRecording: false
                });
                console.log("ARCHIVE STOPPED"+ event.id);
                
            });
        
      },
      (err) => {
        
      }
    );
    
    } else if(mode == 'close') {
        this.setState({
         showRecordingPopup: false
        });
        
        this.state.sessionObj.disconnect();
    }
    
    
 }
 
 showRecordingPopup(){
     
   
       return (
        <div className={ "record-audio-call-wrapper " + (this.state.showRecordingPopup ? 'show' : '') }>
            <Panel header={ "Record Audio Calling" }  bsStyle="primary" >
                <div onClick={ this.audioRecordingPopup.bind(this, 'close') } className="close">x</div>
                <div id="publisherRecordAudio"></div>
                { !this.state.startAudioRecording ? <Link title="Start Audio Recording" onClick={ this.startAudioRecording.bind(this) } className="start-audio-recording btn btn-success"> Start </Link> :  <Link title="Stop Audio Recording" onClick={ this.stopAudioRecording.bind(this) } className="stop-audio-recording btn btn-danger"> Stop </Link> } 
            </Panel>
        </div>
    );
   
    
 }
 
 closeRecordingPopup(){
     this.setState({
         showRecordingPopup: false
     });
 }
 
 renderLoading() {
    return <img className="loader-center" src="/src/public/img/ajax-loader.gif"/>;
  }

  render() {
      
      
    return (
        <div>
            <Link title="Recording" onClick={  !this.state.showRecordingPopup ?  this.audioRecordingPopup.bind(this, 'open') : e => e.preventDefault() } className="open-audio-recording-pop-up"> Recording </Link>
            
            { this.showRecordingPopup() } 
            
            
            
              
            
        </div>
        
    );
  }
}



export default connect(null, { startRecording, getArchiveSessionAndToken, stopRecording, sendRecording })(AudioRecording);
