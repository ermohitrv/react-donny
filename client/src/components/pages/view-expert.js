import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from '../../actions/index';
import { Field, reduxForm } from 'redux-form';
import { sendEmail, sendTextMessage, checkBeforeSessionStart, createAudioSession } from '../../actions/expert';
import axios from 'axios';
import ExpertReviews from './ExpertReviews';
import cookie from 'react-cookie';
import LoginModal from './login-modal';
import * as actions from '../../actions/messaging';
const socket = actions.socket;
import NotificationModal from './notification-modal';
import { Modal, Button } from 'react-bootstrap';

const form = reduxForm({
  form: 'email-form'
});
const renderField = field => (
  <div>
    <input type="email" required placeholder="Your email here" className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderFieldHidden= field => (
  <div><input type="hidden" {...field.input} /></div>
);
const renderTextarea = field => (
  <div>
    <textarea required rows="3" placeholder="Your message here" className="form-control" {...field.input} ></textarea>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);

class ViewExpert extends Component {
  /*** Class constructor. */
  constructor(props, context) {
    super(props, context);

    this.state = {
      category :"",
      showEndCallOptions : false,
      expert: "",
      firstName: "",
      lastName: "",
      expertEmail: "",
      sessionBtnText: "",
      loading: false,
      error: null,
      sessionId: '',
      apiKey: '',
      apiSecret: '',
      apiToken: '',
      expertUsername: this.props.params.slug,
      expertAudioCallSokcetname: 'expert-audio-session-'+this.props.params.slug,
      currentUser: cookie.load('user'),
      showModal: false,
      modalMessageNotification : "Alas, You have no donny's list wallet money in your account. Please recharge your account to start session.",
      modalMessageNotAuthorized : "Dear Expert, You are not authorized to publish your session on someone's channel. Please publish on your channel.",
      startAudioRecording: false
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }
  
  startAudioRecording(){
      this.setState({
          startAudioRecording: true
      });
  };
  
  stopAudioRecording(){
      this.setState({
         startAudioRecording: false 
      });
  };

  open() { this.setState({showModal: true}); }
  close() { this.setState({showModal: false}); }

  /*email form submittion*/
  handleFormSubmit(formProps) {
    try{
      this.props.sendEmail(formProps).then(
      	(response)=>{
          this.setState({responseEmailMsg : "<div class='alert alert-success text-center'>"+response.message+"</div>"});
          setTimeout(function(){
            $('.alert').text("");
            $('.alert').removeClass("alert alert-success text-center");
            $("input[name='email").val("");
            $("textarea[name='message").val("");
          },2500);
      	},
      	(err) => err.response.json().then(({errors})=> {
       		this.setState({responseEmailMsg : "<div class='alert alert-danger text-center'>"+errors+"</div>"});
          setTimeout(function(){
            $('.alert').text("");
            $('.alert').removeClass("alert alert-success text-center");
            $("input[name='email").val("");
            $("textarea[name='message").val("");
          },2500);
       	})
      )
    }catch(e){}
  }

  /*text message form submittion*/
  handleTextMessageFormSubmit(formProps) {
    try{
      //const expertEmail = this.state.expertEmail;
      //var myObj = { "expertEmail" : "ava@gmail.com" };
      //formProps.push(myObj);
      console.log('formProps: '+JSON.stringify(formProps));
      this.props.sendTextMessage(formProps).then(
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

  callNowButtonClick(e){
    e.preventDefault();
    
    const expertAudioCallSokcetname = this.state.expertAudioCallSokcetname;
    const audioCallFrom = this.state.currentUser.firstName + ' ' + this.state.currentUser.lastName;
//    
//    var data = {
//        expertAudioCallSokcetname: expertAudioCallSokcetname,
//        audioCallFrom: audioCallFrom
//    };
//    socket.emit('audio call to expert', data);
//    
//    return;

    const expertEmail = this.state.expertEmail;
    const currentUser = cookie.load('user');
    const userEmail = currentUser.email;

    console.log('case 1 expertEmail: '+expertEmail + ' userEmail: '+userEmail);

    this.props.createAudioSession({expertEmail, userEmail}).then(
    	(response)=>{
            console.log('**** createAudioSession this.state.sessionId ****'+ JSON.stringify(response) );
            this.setState({sessionId  : response.sessionId });
            this.setState({apiToken   : response.token });
            var session = OT.initSession('45801242', this.state.sessionId);

            

            session.on('streamCreated', function(event){
                console.log('streamCreated');
                var options = {width:200, height:100};
                var subscriber = session.subscribe(event.stream, 'expertSubscriberAudio' , options);
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
                    var publisher = OT.initPublisher('publisherAudio', pubOptions);
                    session.publish(publisher);

                    var data = {
                        expertAudioCallSokcetname: expertAudioCallSokcetname,
                        audioCallFrom: audioCallFrom
                    };
                    socket.emit('audio call to expert', data);
                    publisher.publishVideo(false);
                }
            });



        },
    	(err) => err.response.json().then(({errors})=> {
            console.log('**** createAudioSession error ****'+ JSON.stringify(errors) );
        })
    )
  }


  componentDidMount() {
    var slug = this.props.params.slug;
    axios.get(`${API_URL}/getExpertDetail/${slug}`)
		  .then(res => {
		    const expert = res.data[0];
        this.setState({firstName : res.data[0].profile.firstName });
        this.setState({lastName : res.data[0].profile.lastName });
        this.setState({expertEmail : res.data[0].email });
        this.setState({onlineStatus : res.data[0].onlineStatus });
		    this.setState({
		      expert,
		      loading: false,
		      error: null
		    });
		  })
		  .catch(err => {
		    // Something went wrong. Save the error in state and re-render.
		    this.setState({
		      loading: false,
		      error: err
		    });
	  	});

      $(document).ready(function(){
        jQuery("#send_email_form").validate({
          rules: {
               email: { required: true,email: true },
               message: { required: true }
          },
          messages: {
               email: { required: "Please enter this field" },
               message:{ required: "Please enter this field" }
          }
        });
        jQuery("#send_text_form").validate({
          rules: {
               email: { required: true,email: true },
               message: { required: true }
          },
          messages: {
               email: { required: "Please enter this field" },
               message:{ required: "Please enter this field" }
          }
        });
      });
	}

  renderLoading() {
    return <img className="loader-center" src="/src/public/img/ajax-loader.gif"/>;
  }

  renderError() {
    if(this.state.expert == undefined){
      return (
        <div id="experts-list" className="experts-list section-padding">
          <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ol className="breadcrumb">
                          <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
                          <li className="breadcrumb-item active">{this.props.params.category}</li>
                        </ol>
                        <div id="center">
                          <div id="pageTitle">
                              <div className="title">{this.props.params.category}</div>
                              <div className="alert-danger alert">Alas, No expert found in this category!</div>
                          </div>
                        </div>
                    </div>
                </div>
          </div>
        </div>
      );
    }else{
      return (
        <div id="experts-list" className="experts-list section-padding">
          <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ol className="breadcrumb">
                          <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
                          <li className="breadcrumb-item active">{this.props.params.category}</li>
                        </ol>
                        <div id="center">
                          <div id="pageTitle">
                              <div className="title">{this.props.params.category}</div>
                                <div className="alert-danger alert">Uh oh: {this.state.error.message}</div>
                          </div>
                        </div>
                    </div>
                </div>
          </div>
        </div>
      );
    }
  }

  getOnlineStatus(onlineStatus){
    if(onlineStatus === "ONLINE"){
      return "user-online fa fa-circle";
    }else{
      return "user-offline fa fa-circle";
    }
  }

  getOnlineStatusTitle(onlineStatus){
    if(onlineStatus === "ONLINE"){
      return "Online";
    }else{
      return "Offline";
    }
  }

  /*Function called before redirecting user to session page to check valid user access*/
  startSessionCheck(){

    const currentUser = cookie.load('user');
    const expertEmail = this.state.expertEmail;
    const expertSlug = this.props.params.slug;
    const userEmail = currentUser.email;
    const userRole = currentUser.role;
    const userSlug = currentUser.slug;

    /*case 1: when logged in user is not expert and role is equal to User */
    if( userEmail !== expertEmail && userRole !== "Expert" ){
        this.props.checkBeforeSessionStart({'expertEmail' : expertEmail,'userEmail': userEmail}).then(
        	(response)=>{
            console.log(JSON.stringify(response));
            if(response.session !== null){
              if(response.session.stripePaymentStatus == "succeeded"){
                window.location.href = `${CLIENT_ROOT_URL}/mysession/`+this.props.params.slug;
              }else{
                this.setState({ modalMessageNotification : "Something went wrong, please contact website admin."});
              }
            }else{
              $('.notification-modal').trigger('click');
            }
        	},
        	(err) => err.response.json().then(({errors})=> {
            console.log('errors: '+JSON.stringify(errors));
       	  })
        )
    }else if( ( userEmail === expertEmail && userRole === "Expert") && (expertSlug === userSlug) ){
        /*case 2: when logged in user is expert and role is equal to Expert, then no need for payment process */
        window.location.href = `${CLIENT_ROOT_URL}/mysession/`+this.props.params.slug;
    }else{
        this.setState({showModal: true});
    }
  }

  renderPosts() {
    const currentUser = cookie.load('user');
    /*if(currentUser.role == "Expert"){
      this.setState({sessionBtnText : "Start Session" });
    }else if(currentUser.role == "User"){
      this.setState({sessionBtnText : "Join Session" });
    }else{
      this.setState({sessionBtnText : "Join Session" });
    }
    console.log('sessionBtnText: '+this.state.sessionBtnText);
    */
    if(this.state.error) {
      return this.renderError();
    }
    const { handleSubmit } = this.props;
    return (
    <div id="view-experts" className="view-experts">
      {/* modal to show notifications to unauthorized user */}
      <Modal className="modal-container"
        show={this.state.showModal}
        onHide={this.close}
        animation={true}
        bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.state.modalMessageNotAuthorized}</Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* modal to show notifications to unauthorized user */}
      <div className="container">
         <div className="row">
             <ol className="breadcrumb">
               <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
               <li className="breadcrumb-item"><IndexLink to={`/list/${this.props.params.category}`}>{this.props.params.category}</IndexLink></li>
               <li className="breadcrumb-item active">{this.props.params.slug}</li>
             </ol>
         </div>
      </div>
      <div className="expert-list-wrap">
        <div className="container">
           <div className="row">
              <div className="expert-list-inner-wrap">
                 <div className="col-sm-12">
                    <div className="expert-detail-wrap">
                       <div className="row">
                          <div className="col-md-3 col-sm-4">
                             <div className="expert-img">
                                <img src="/src/public/img/profile.png"/>
                                <i data-toggle="title" title={this.getOnlineStatusTitle(this.state.onlineStatus)} className={this.getOnlineStatus(this.state.onlineStatus)} aria-hidden="true"></i>
                             </div>
                             <ul className="Action_icon">
                               <li>
                                 {currentUser ? <Link data-toggle="tooltip" title="Start Session Test" onClick={this.startSessionCheck.bind(this)} className="Start-Session"></Link> : <div><Link title="Start Session" to="javascript:void(0)" data-toggle="modal" data-target="#loginModal" className="Start-Session"></Link><LoginModal modalId="loginModal" modalMessage="Please login to start session"/></div> }
                               </li>
                               <li><Link title="Send E-Mail" data-toggle="modal" data-target="#myModalEmail" className="Send_E-Mail"> Send E-Mail</Link></li>
                               <li><Link title="Send Text Message" data-toggle="modal" data-target="#myModalTextMessage" className="Send-Text-Message"> Send Text Message</Link></li>
                               <li><Link data-toggle="tooltip" title="Download Resume" className="Download-Resume"> Download Resume</Link></li>
                               <li>
                                  { currentUser ? <Link title="Audio Call"  onClick={this.callNowButtonClick.bind(this)} className="Audio-Call">  Audio Call </Link> : <Link title="Audio Call" to="javascript:void(0)" data-toggle="modal" data-target="#myModalAudio" className="Audio-Call"> Audio Call</Link>}
                               </li>
                       
                               {/* <li>{ !this.state.startAudioRecording ? <Link title="Start Audio Recording" onClick={ this.startAudioRecording.bind(this) } className="start-audio-recording btn btn-success"> Start Recording </Link> :  <Link title="Stop Audio Recording" onClick={ this.stopAudioRecording.bind(this) } className="stop-audio-recording btn btn-danger"> Stop Recording </Link> }       </li> */}
                             </ul>
                             <div>
                               <Link title="Start Session" to="javascript:void(0)" data-toggle="modal" className="notification-modal" data-target="#notificationModal"></Link>
                               { currentUser ? <NotificationModal userEmail={currentUser.email} expertSlug={this.props.params.slug} modalId="notificationModal" modalMessage={this.state.modalMessageNotification}/> : "" }
                             </div>
                          </div>
	                       <div id="publisherAudio"></div>
                               <div id="expertSubscriberAudio"></div>
                          <div className="col-md-9 col-sm-8">
                             <div className="profile-detail">
                                <div className="name">
                                   <dl className="dl-horizontal">
                                      <div className="profile-bor-detail">
                                         <dt>Name</dt>
                                         <dd>
                                         <div className="text-left-detail">{this.state.firstName} {this.state.lastName}</div>
                                         <div style={{'float':'right','text-transform':'capitalize'}} className="text-right label label-primary"><i className="fa fa-bars" aria-hidden="true"></i> {this.props.params.category}</div>
                                         </dd>
                                      </div>
                                      <div className="profile-bor-detail">
                                         <dt>Area of expertise</dt>
                                         <dd>{this.state.expert.expertCategories}</dd>
                                      </div>
                                      <div className="profile-bor-detail">
                                         <dt>Years of expertise</dt>
                                         <dd>{this.state.expert.yearsexpertise}</dd>
                                      </div>
                                      <div className="profile-bor-detail">
                                         <dt>Focus of expertise</dt>
                                         <dd>{this.state.expert.expertFocusExpertise}</dd>
                                      </div>
                                      <div className="profile-bor-detail">
                                         <dt>Rates</dt>
                                         <dd>{this.state.expert.expertRates}</dd>
                                      </div>
                                      <div className="profile-bor-detail">
                                         <dt>Rating</dt>
                                         <dd>{this.state.expert.expertRating} <i className="fa fa-star" aria-hidden="true"></i></dd>
                                      </div>
                                      <div className="profile-bor-detail">
                                          <dt>About Expert </dt>
                                          <dd>{this.state.expert.userBio}</dd>
                                      </div>
                                   </dl>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <ExpertReviews/>
               </div>
            </div>
        </div>
      </div>{/* expert-list-wrap end */}


          {/* modal for audio call start here */}
          <div id="myModalAudio" className="modal fade continueshoppingmodal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">×</button>
                    <h4 className="modal-title">Message</h4>
                </div>
                <div className="modal-body text-center">
                  <div className="alert alert-danger">Please login to place audio call</div>
                </div>
                <div className="modal-footer text-center">
                  <div className="bootstrap-dialog-footer">
                    <div className="bootstrap-dialog-footer-buttons text-center">
                      <div className="form-group">
                        <button type="button" className="btn btn-primary" data-dismiss="modal">Dismiss</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
         {/* modal for audio call end here */}

         {/* myModalEmail for email start here */}
          <div id="myModalEmail" className="modal fade continueshoppingmodal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                   <button type="button" className="close" data-dismiss="modal">×</button>
                   <h4 className="modal-title">Send Email</h4>
                </div>
                <form id="send_email_form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                <div className="modal-body">
                  <p className="text-center"> Shoot email message to expert </p>
                  <table className="table table-hover">
                     <tbody>
                         <tr>
                             <div dangerouslySetInnerHTML={{__html: this.state.responseEmailMsg}}></div>
                             <div className="row form-group">
                               <div className="col-md-12">
                                 <label>Your Email</label>
                                 <Field name="email" component={renderField} type="email" />
                               </div>
                             </div>
                             <div className="row form-group">
                               <div className="col-md-12">
                                 <label>Your Message</label>
                                 <Field name="message" rows="3" component={renderTextarea} type="text" />
                               </div>
                             </div>
                         </tr>
                     </tbody>
                  </table>{/*end of table*/}
                </div>{/*end of modal body*/}
                <div className="modal-footer">
                  <div className="bootstrap-dialog-footer">
                    <div className="bootstrap-dialog-footer-buttons text-center">
                      <div className="form-group">
                        <button type="submit" className="btn btn-primary">Send Email</button>
                        &nbsp;
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
                </form>
              </div>
            </div>
          </div> {/* myModalEmail for email end here */}

          {/* myModalTextMessage for email start here */}
           <div id="myModalTextMessage" className="modal fade continueshoppingmodal" role="dialog">
             <div className="modal-dialog">
               <div className="modal-content">
                 <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">×</button>
                    <h4 className="modal-title">Send Text Message</h4>
                 </div>
                 <form id="send_text_form" onSubmit={handleSubmit(this.handleTextMessageFormSubmit.bind(this))}>
                 <div className="modal-body">
                   <p className="text-center"> Shoot text message to expert </p>
                   <table className="table table-hover">
                      <tbody>
                          <tr>
                              {/* text message form start */}
                                <div dangerouslySetInnerHTML={{__html: this.state.responseTextMsg}} />
                                <div className="row form-group">
                                  <div className="col-md-12">
                                    <label>Your Email</label>
                                    <Field name="text_email" component={renderField} type="email" />
                                    <Field name="text_expert_email" value={this.state.expertEmail} type="hidden" component={renderFieldHidden}/>
                                    {/*}<input type="email" name="text_expert_email" type="hidden" value={this.state.expertEmail}/>{*/}
                                  </div>
                                </div>
                                <div className="row form-group">
                                  <div className="col-md-12">
                                    <label>Your Message</label>
                                    <Field name="text_message" rows="3" component={renderTextarea} type="text" />
                                  </div>
                                </div>
                              {/* text message form end */}
                          </tr>
                      </tbody>
                   </table>{/*end of table*/}
                 </div>{/*end of modal body*/}
                 <div className="modal-footer">
                   <div className="bootstrap-dialog-footer">
                     <div className="bootstrap-dialog-footer-buttons text-center">
                       <div className="form-group">
                         <button type="submit" className="btn btn-primary">Send Text Message</button>
                         &nbsp;
                         <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                       </div>
                     </div>
                   </div>
                 </div>
                 </form>
               </div>
             </div>
           </div> {/* myModalTextMessage end here */}
     </div>
    );
  }

  /*** Render the component. */
  render() {
    return (
      <div>
        {this.state.loading ?
          this.renderLoading()
          : this.renderPosts()}
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

export default connect(mapStateToProps, { sendEmail, sendTextMessage, checkBeforeSessionStart, createAudioSession })(form(ViewExpert));
