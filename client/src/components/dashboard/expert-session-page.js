import React, { Component } from 'react';
import { Link, IndexLink  } from 'react-router';
import moment from 'moment';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from '../../actions/index';
import { protectedTest } from '../../actions/auth';
import $ from 'jquery'
import axios from 'axios';

import { FetchExpertConversation,ExpertSessionUserDisconnected } from '../../actions/messaging';
import * as actions from '../../actions/messaging';
import ExpertReplyMessage from './expert-reply-message';
import io from 'socket.io-client';
const socket = actions.socket;
import Loader from './loader';
import SessionWhiteboard from './session-whiteboard';

class SessionPage extends Component {
  constructor(props) {
    super(props);
    this.props.FetchExpertConversation(this.props.params.slug);
    this.state = {
      expert: "",
      firstName: "",
      lastName: "",
      apiToken: "",
      showEndCallOptions: false,
      session: "",
      publisher: "",
      numberofConnections:0,
      errorSession : false,
      errorSessionMessage : "",
      streams : {},
      sessionDate : ""
    };

    this.state = { time: {}, seconds: 1800 };
    //this.state = { time: {}, seconds: 310 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);

    this.props.protectedTest();

		$(document).ready(function(){
		   jQuery('.Chat_Trigger').click(function() {
		        jQuery("body").toggleClass('OpenChatList');
            //jQuery(".Left_Panel").show();
		    });
		    jQuery(document).on('click','.Hide_Left_panel',function(){
		      jQuery("body").toggleClass('OpenChatList');
          //jQuery(".Left_Panel").hide();
		    });

        jQuery(document).on('click','.WhiteBoard_Trigger a',function(){
		      jQuery("body").toggleClass('OpenWhiteBoard');
          //jQuery("body").toggleClass('OpenChatList');
          jQuery(".whiteBoard_close").removeClass('OpenWhiteBoard');
		    });

        jQuery(document).on('click','.stream-end-btn',function(){
          jQuery(this).parent().remove();
        });

        jQuery('.canvas-tools a').click(function(){
          jQuery('.canvas-tools a').removeClass('active');
          jQuery(this).addClass('active');
        });
		});

    socket.on('expert user disconnected', (data) => {
      console.log('client side : expert user disconnected '+this.state.time+" : "+this.state.seconds);
      //this.props.ExpertSessionUserDisconnected(this.props.sessionOwnerUsername);
    });
  }

  handleFormSubmit(formProps) {
    console.log('handleFormSubmit');
  }

  componentWillMount() {
    const currentUser = cookie.load('user');
    var expertEmail = "avadhesh_bhatt@rvtechnologies.co.in",
        userEmail = currentUser.email,
        slug = this.props.params.slug,
        sessionOwner = false;
    if(userEmail === expertEmail){
      sessionOwner = true;
    }

    axios.post(`${API_URL}/createVideoSession`, { expertEmail, userEmail, sessionOwner })
		  .then(res => {
        this.setState({sessionId  : res.data.sessionId });
        this.setState({apiToken   : res.data.token });
        var errorList = {};

        var connectionCount;

        var session = OT.initSession('45801242', this.state.sessionId)
        .on('streamCreated', function(event) {

          console.log('streamCreated');

          var subContainer = document.createElement('div');

          subContainer.id = 'stream-' + event.stream.streamId;

          document.getElementById('subscribers').appendChild(subContainer);

          $('#'+subContainer.id+' .OT_root').append('<button id="end-btn-'+event.stream.streamId+'" class="stream stream-end-btn">End Button</button>');

          // store the stream object for later use
          //streams[event.stream.streamId] = event.stream;
          console.log(event.stream);
          //this.state.streams.push(event.stream);

          var options = {width: 200, height: 200, 'box-shadow':'0 2px 12px 1px rgba(0,0,0,.89)', insertMode: 'append'}
          var subscriber = session.subscribe(event.stream, subContainer,options, function(error) {
            if (error) {
              console.log(error.message);
              return;
            }
            if (subscriber.stream.hasVideo) {
              var imgData = subscriber.getImgData();
              if(!imgData){
                  subscriber.setStyle('backgroundImageURI','https://donnieslist.com/src/public/img/mini-user-dummy.png');
              }
              subscriber.setStyle('backgroundImageURI', imgData);
            } else {
              subscriber.setStyle('backgroundImageURI','https://donnieslist.com/src/public/img/mini-user-dummy.png');
            }
          });
        })
        .on('connectionCreated', function (event) {
            connectionCount = connectionCount+1;
            if (event.connection.connectionId != session.connection.connectionId) {
              console.log('Another client connected. ' + connectionCount + ' total.');
            }
        })
        .on('connectionDestroyed', function connectionDestroyedHandler(event) {
            connectionCount = connectionCount-1;
            console.log('A client disconnected. ' + connectionCount + ' total.');
        })
        .on('streamDestroyed', function(event) {
          console.log('streamDestroyed: '+event.reason+' - '+slug);
          socket.emit('expert user disconnected', slug);
        })
        .connect( this.state.apiToken, function(error) {
          if (error) {
            if (error.code === 1010) {
              $('#publisher').html('<div class="alert alert-danger">Alas! You are not connected to the internet. Check your network connection. <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalExtendSession" class="btn btn-primary"><i className="fa fa-handshake-o"></i> Extend Session Now!</a></div>');
            }else if (error.code === 1004) {
              $('#publisher').html('<div class="alert alert-danger">Alas! Session Expired, Please recharge your account to restart session! <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalExtendSession" class="btn btn-primary"><i className="fa fa-handshake-o"></i> Extend Session Now!</a></div>');
            }
          } else {
            console.log('connected');
            $('.Left_Panel').css('height',$('.mainContainer').height()+'px');
            var publisher = OT.initPublisher('45801242', 'publisher',{width:'100%', height:'603px'});
            session.publish(publisher);
            $('.session-page-container').show();
            $('.loader-center-ajax').hide();
            $('.Left_Panel').css('height',$('.mainContainer').height()+'px');
          }
        });
        //this.inputElement.click();
        this.setState({showEndCallOptions: true });
        //this.startTimer();

	  }).catch(err => {
      if(err){
        this.setState({errorSessionMessage : "<div class='alert alert-danger'>Session is not active from Expert end. Please try again later.</div>" });
      }
    });
  }

  componentDidMount() {
    var todayDate = new Date();
    todayDate = todayDate.getDate()+"/"+todayDate.getMonth()+"/"+todayDate.getFullYear();
    this.setState({sessionDate : todayDate });
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    var slug = this.props.params.slug;

    axios.get(`${API_URL}/getExpertDetail/${slug}`)
		  .then(res => {
        const expert = res.data[0];
        this.setState({firstName : res.data[0].profile.firstName });
        this.setState({lastName : res.data[0].profile.lastName });
		    this.setState({expert});
		  })
		  .catch(err => {});
	}

  getClassName(sender,loggedInUser){
    if(sender == loggedInUser){
      return "me "+loggedInUser+" - "+sender;
    }else{
      return "you "+loggedInUser+" - "+sender;
    }
  }

  renderInbox() {
    const currentUser = cookie.load('user');
    const moment = require('moment');
    if (this.props.messages) {
      return (
        <ul>
            {this.props.messages.map(data =>
              <li className={this.getClassName(data.messageSenderEmail,currentUser.email)}>
                <span className="message-body">
                  {data.message}
                </span>
                <div className="session-msg-date">{moment(data.messageTime).from(moment())}</div>
              </li>
            )}
        </ul>
      );
    }
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);
    let obj = { "h": hours, "m": minutes, "s": seconds };
    return obj;
  }

  startTimer() {
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

  redAlertTiming(minutes) {
    if(minutes <= this.props.redAlert)
    return Object.assign(
      {'-webkit-animation':'shake 0.1s ease-in-out 0.1s infinite alternate', 'color':'#FF0000'}
    );
  }

  disconnect() {
    //session.disconnect();
    console.log('publisher: '+publisher);
    //session.disconnect();
    /*if (this.state.publisher) {
      this.state.session.unpublish(this.state.publisher);
    }*/
  }

  render() {
    const currentUser = cookie.load('user');
    var controller = this.props.messagesController;
    const { handleSubmit } = this.props;

    return (
      <div className="session-page">
        <Loader/>
        <div className="container-fluid session-page-container" style={{display: 'none' }}>
          <div className="row">
            <section>
              <div dangerouslySetInnerHTML={{__html: this.state.errorSessionMessage}} />
            	<div className="mainContainer">
            		<div className="Left_Panel">
            			<div className="Conversation">
            				<h6>Conversation</h6>
            				<a href="javascript:void()" className="Hide_Left_panel"><i className="fa fa-times" aria-hidden="true"></i></a>
            			</div>
                  <div className="Chat_Main_section">
                      <div className="Chating_msg_Here">
                        { this.renderInbox() }
                      </div>
                      <div className="typeMessage">
                        <ExpertReplyMessage sessionOwnerUsername={this.props.params.slug} messageReceiverEmail={'avadhesh_bhatt@rvtechnologies.co.in'} messageSenderEmail={currentUser.email}/>
                      </div>
                  </div>
                  <SessionWhiteboard/>
            		</div>
          		  <div className="Right_Panel">
            			<div className="Client_image">
            				<div className="innerm">
                      <div id="subscribers" className="chatHead chatHeadLeader"></div>
                      { this.state.showEndCallOptions ? null : <Loader/> }
                      <div id="publisher"></div>
            					<div className="upperimageName">
                        <div className="text-left-detail"><i className="fa fa-user-o" aria-hidden="true"></i> {this.state.firstName} {this.state.lastName}</div>
                        <div className="text-right-detail"></div>
                      </div>
            				</div>
            			</div>

            			<div className="footer_action_btns">
                    <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalWaitingToJoin" class="btn btn-primary btn_waitingtojoin"></a>
            				<ul>
            					<li className="Chat_Trigger">
                        <a data-toggle="tooltip" title="Conversation" href="javascript:void(0)"><i className="fa fa-commenting" aria-hidden="true"></i></a>
                      </li>
                      <li className="WhiteBoard_Trigger">
                        {/*}<a data-toggle="modal" data-target="#myWhiteBoard" class="btn btn-primary btn_waitingtojoin"></a>{*/}
                        <a data-toggle="tooltip" title="White Board" href="javascript:void(0)"><i className="fa fa-pencil" aria-hidden="true"></i></a>
                      </li>
                      { this.state.showEndCallOptions ? <li className="phone_call"><Link data-toggle="tooltip" title="End Session" to="javascript:void(0)" onClick={this.disconnect.bind(this)}><i className="fa fa-phone"></i></Link></li> : null }
                      <li className="clockicon" style={this.redAlertTiming(this.state.time.m)}><a data-toggle="tooltip" title="Session Time" href="javascript:void(0)"><i className="fa fa-clock-o" aria-hidden="true"></i> {this.state.sessionDate} - {this.state.time.m} : {this.state.time.s}</a></li>
                      { /* }
            					<li className="video_call"><a href="#"><i className="fa fa-video-camera" aria-hidden="true"></i></a></li>
            					<li className="microphone"><a href="#"><i className="fa fa-microphone" aria-hidden="true"></i></a></li>
            					<li className="phone_call"><a href="#"><i className="fa fa-phone" aria-hidden="true"></i></a></li>

            					<li className="ellipsismore"><a href="#"><i className="fa fa-ellipsis-h" aria-hidden="true"></i></a></li>
                      { */ }
            				</ul>
            			</div>
            		</div>
            	</div>
            </section>
          </div>
        </div>
        {/* myModalWaitingToJoin start here */}
        <div id="myModalWaitingToJoin" className="modal fade continueshoppingmodal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content alert alert-danger">
              <div className="modal-header text-center">
                  <h4 className="modal-title">Waiting for user to join!</h4>
              </div>
              <div className="modal-body text-center">
                  <p>No one has joined your session yet, once any user will join the session, timer will initiate!</p>
              </div>
            </div>
          </div>
        </div>
        {/* myModalWaitingToJoin end here */}
        {/* myModalExtendSession for email start here */}
         <div id="myModalExtendSession" className="modal fade continueshoppingmodal" role="dialog">
           <div className="modal-dialog">
             <div className="modal-content">
               <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">×</button>
                  <h4 className="modal-title">Send Email</h4>
               </div>
               <div className="modal-body">
                 <p className="text-center"> Recharge your account to start session! </p>
                 <table className="table table-hover">
                    <tbody>
                        <tr>
                            <form>
                              <div className="row form-group">
                                <div className="col-md-12">
                                  <label>Time</label>
                                  <select className="form-control" name="sessionExtendTime">
                                    <option value="30">30 Minutes</option>
                                    <option value="60">1 Hour</option>
                                  </select>
                                </div>
                              </div>
                              <div className="form-group">
                                <i>Note: Transaction will process automatically in backend!</i>
                              </div>
                              <div class="form-group">
                                <button type="submit" className="btn btn-primary">Pay Now!</button>
                                &nbsp;
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                              </div>
                            </form>
                        </tr>
                    </tbody>
                 </table>{/*end of table*/}
               </div>{/*end of modal body*/}
             </div>
           </div>
         </div> {/* myModalExtendSession for email end here */}
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

SessionPage.defaultProps = { redAlert: 5 }

export default connect(mapStateToProps, { protectedTest, FetchExpertConversation, ExpertSessionUserDisconnected })(SessionPage);
