import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from '../../actions/index';
import { Field, reduxForm } from 'redux-form';
import { sendEmail, isLoggedIn } from '../../actions/expert';
import axios from 'axios';
import $ from 'jquery'
import cookie from 'react-cookie';

const form = reduxForm({
  form: 'register'
});

const renderField = field => (
  <div>
    <input required placeholder="Your email here" className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderTextarea = field => (
  <div>
    <textarea required rows="3" placeholder="Your message here" className="form-control" {...field.input} ></textarea>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);

class ExpertsListingPage extends Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    this.state = {
      category :"",
      responseMsg: "",
      isUserLoggedIn: "",
      posts: [],
      //loading: false,
      error: null
    };



    $(document).ready(function(){
      jQuery(document).on('click','.show_message_form',function(){
        $('#msg-form').toggleClass('displayNone');
      });
    });
  }

  handleFormSubmit(formProps) {
    this.props.sendEmail(formProps).then(
    	(response)=>{
        this.setState({responseMsg : response.message})
    	},
    	(err) => err.response.json().then(({errors})=> {
     		this.setState({responseMsg : errors})
     	})
    )
  }

  componentDidMount() {
    var category = this.props.params.category;
    // Remove the 'www.' to cause a CORS error (and see the error state)
    axios.get(`${API_URL}/getExpertsListing/${category}`)
      .then(res => {
        // Transform the raw data by extracting the nested posts
        const posts = res.data;
        const category = res.data.name;
        // Clear any errors, and turn off the loading indiciator.
        this.setState({
          posts,
          category,
          //loading: false,
          error: null
        });
      })
      .catch(err => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          //: false,
          category:'',
          error: err
        });
      });
  }

  render() {
    return <img className="loader-center" src="/src/public/img/ajax-loader.gif"/>;
  }

  renderError() {
    if(this.state.posts == undefined){
      return (<div className="alert-danger alert">Alas, No expert found in this category!</div>);
    }else{
      return (<div className="alert-danger alert">Uh oh: {this.state.error.message}</div>);
    }
  }

  getStars(rating) {
    var size = Math.max(0, (Math.min(5, rating))) * 16;
    return Object.assign(
      {width:size}
    );
  }

  renderSessionHyperlink(slug){
    const currentUser = cookie.load('user');
    console.log('currentUser: '+JSON.stringify(currentUser));
    if (currentUser === []){
    //if (currentUser != undefined) {
      console.log('if');
      return (
        <Link to={`/expert/${this.props.params.category}/${slug}`} className="btn-strt-session btn btn-primary pull-right">Start Session</Link>
      );
    }else{
      console.log('else');
      return (
        <button type="button" data-toggle="modal" data-target="#myModal" className="btn-strt-session btn btn-primary pull-right">Start Session</button>
      );
    }
  }

  getOnlineStatus(onlineStatus){
    if(onlineStatus === "ONLINE"){
      return "user-online-o fa fa-circle";
    }else{
      return "user-offline-o fa fa-circle";
    }
  }

  getOnlineStatusTitle(onlineStatus){
    if(onlineStatus === "ONLINE"){
      return "Online";
    }else{
      return "Offline";
    }
  }

  render() {

    const { handleSubmit } = this.props;

    if(this.state.error) {
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
                              {this.renderError()}
                          </div>
                        </div>
                    </div>
                </div>
          </div>
        </div>
      )
    }

    return (
         <div id="experts-list" className="experts-list">
           <div className="expertise-tab-wrap">
             <div className="expertise-inner">
                <div className="container">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
                      <li className="breadcrumb-item active">{this.props.params.category}</li>
                    </ol>
                    <div id="pageTitle">
                        <div className="title">{this.props.params.category}</div>
                        <div className="small">Select any one of the experts below to view their profile</div>
                    </div><br></br>
                    <ul className="nav nav-tabs" role="tablist">
                      <li role="presentation" className="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Latest</a></li>
                      <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Top Rated</a></li>
                      <li role="presentation"><a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">My Favorites</a></li>
                    </ul>
                   <div className="tab-content">
                      <div role="tabpanel" className="tab-pane active" id="home">
                         <div className="expertise-all-detail-wrap">
                             {this.state.posts.map(post =>
                            <div className="expertise-detail-only">
                               <div className="row">
                                  <div className="col-sm-8">
                                     <div className="row">
                                        <div className="col-sm-2">
                                           <div className="img-exper">
                                              <img src="/src/public/img/pro1.png"/>
                                           </div>
                                        </div>
                                        <div className="col-sm-10">
                                           <div className="person-per-info">
                                              <Link to={`/expert/${this.props.params.category}/${post.slug}`}><h2>{post.profile.firstName} {post.profile.lastName} <i title={this.getOnlineStatusTitle(post.onlineStatus)} className={this.getOnlineStatus(post.onlineStatus)} aria-hidden="true"></i></h2> </Link>
                                              <p>About expert: {post.userBio}</p>
                                              <p>Area of expertise: {post.expertCategories}</p>
                                              <p>Focus of expertise: {post.expertFocusExpertise}</p>
                                              <p>Years of expertise: {post.yearsexpertise}</p>
                                              <p>Rates: {post.expertRates} <span>★</span></p>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="col-sm-4">
                                     <div className="stars-review">
                                       <span className="stars right">
                                           <span style={this.getStars(post.rating)}></span>
                                       </span>
                                     </div>
                                     <div className="btn-expertise">
                                       <Link to={`/expert/${this.props.params.category}/${post.slug}`} className="btn-strt-session btn btn-primary pull-right">Start Session</Link>
                                       {/*}{this.renderSessionHyperlink(post.slug)}{*/}
                                     </div>
                                  </div>
                               </div>
                            </div>
                            )}
                         </div>
                      </div>
                      <div role="tabpanel" className="tab-pane" id="profile">
                         <div className="expertise-all-detail-wrap">
                          <div className="alert alert-danger">No expert found in this section!</div>
                         </div>
                      </div>
                      <div role="tabpanel" className="tab-pane" id="messages">
                         <div className="expertise-all-detail-wrap">
                          <div className="alert alert-danger">No expert found in this section!</div>
                         </div>
                      </div>
                      <div role="tabpanel" className="tab-pane" id="settings">
                         <div className="expertise-all-detail-wrap">
                          <div className="alert alert-danger">No expert found in this section!</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div id="myModal" className="modal fade continueshoppingmodal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                  <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">×</button>
                      <h4 className="modal-title">Start Session</h4>
                  </div>
                  <div className="modal-body">
                    <p className="text-center">Please <Link to="/login">login</Link> to initiate the session!</p>
                    <p className="text-center"> OR </p>
                    <p className="text-center"> Shoot email message to expert </p>
                      <div>
                        <table className="table table-hover">
                          <tbody>
                              <tr>
                                  { /* form begin here */ }
                                  <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                                    {this.state.responseMsg}
                                    <div className="row form-group">
                                      <div className="col-md-12">
                                        <label>Email</label>
                                        <Field name="email" component={renderField} type="text" />
                                      </div>
                                    </div>
                                    <div className="row form-group">
                                      <div className="col-md-12">
                                        <label>Message</label>
                                        <Field name="message" rows="3" component={renderTextarea} type="text" />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <button type="submit" className="btn btn-primary">Send Email</button>
                                      &nbsp;
                                      <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                    </div>
                                  </form>
                                  { /* form end here */ }
                              </tr>
                            </tbody>
                          </table>
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
    message: state.auth.message,
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, { sendEmail, isLoggedIn })(form(ExpertsListingPage));


//export default ExpertsListingPage;
