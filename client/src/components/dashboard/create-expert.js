import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import cookie from 'react-cookie';
import { protectedTest } from '../../actions/auth';
import { createExpert } from '../../actions/expert';
import ReactDOM from 'react-dom';

const form = reduxForm({
  form: 'register'
});
const renderField = field => (
  <div>
    <input type="text" required className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderEmailField = field => (
  <div>
    <input type="email" required className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderTextarea = field => (
  <div>
    <textarea required rows="3" className="form-control" {...field.input} ></textarea>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderBioField = field => (
  <div>
    <input type="email" required placeholder="Your email here" className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderFieldyearsexpertise = field => (
  <div>
    <select required  name="yearsexpertise" className="form-control" {...field.input} >
      <option value="">Select</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderFieldexpertCategories = field => (
  <div>
    <select required  name="expertCategories" className="form-control" {...field.input} >
      <option value="">Select</option>
      <option value="accounting">Accounting</option>
      <option value="accounting-finance">Accounting-finance</option>
      <option value="blogging">Blogging</option>
      <option value="graphic-design">Graphic-design</option>
      <option value="bass">bass</option>
    </select>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);

class CreateExpert extends Component {
  constructor(props) {
    super(props);
    this.state = {responseMsg:""};
    this.props.protectedTest();
  }

  clearInput() {
    $( 'form' ).each(function(){
        this.reset();
    });
  }

  breadcrumb(){
    return(
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
        <li className="breadcrumb-item">Create Expert</li>
      </ol>
    );
  }

  isRole(roleToCheck, toRender) {
    const userRole = cookie.load('user').role;
    if (userRole == roleToCheck) {
      return toRender;
    }
    return false;
  }

  adminMenu() {
    return (
      <ul className="nav nav-sidebar" id="menu">
          <li>
              <a href="javascript:void(0)" data-target="#item1" data-toggle="collapse"><i className="fa fa-list"></i> <span className="collapse in hidden-xs">Users Management <span className="caret"></span></span></a>
              <ul className="nav nav-stacked collapse" id="item1">
                  <li><Link to="#">List Users</Link></li>
                  <li><Link to="/dashboard/create-expert">Create Expert</Link></li>
              </ul>
          </li>
          <li>
              <a href="javascript:void(0)" data-target="#item2" data-toggle="collapse"><i className="fa fa-list"></i> <span className="collapse in hidden-xs">Session Management <span className="caret"></span></span></a>
              <ul className="nav nav-stacked collapse" id="item2">
                  <li><Link to="#">List Active Sessions</Link></li>
              </ul>
          </li>
      </ul>
    );
  }

  handleFormSubmit(formProps) {
    console.log('formProps: '+JSON.stringify(formProps));

    this.props.createExpert(formProps).then(
      (response)=>{
        if(response.error){
            this.setState({responseMsg : "<div class='alert alert-danger text-center'>"+response.error+"</div>"});
            //this.clearInput();
            $(".form-control").val("");
            $( 'form' ).each(function(){
                this.reset();
            });
        }else{
          this.setState({responseMsg : "<div class='alert alert-success text-center'>"+response.message+"</div>"});
          //this.clearInput();
          $(".form-control").val("");
          $( 'form' ).each(function(){
              this.reset();
          });
        }
      },
      (err) => err.response.json().then(({errors})=> {
        this.setState({responseMsg : "<div class='alert alert-danger text-center'>"+errors+"</div>"});
      })
    )
  }

  render() {

    const { handleSubmit } = this.props;

    return (
      <div className="session-page">
        <div className="container">
          <div className="row">
            {this.breadcrumb()}
            <div className="wrapper-sidebar-page">
              <div className="row row-offcanvas row-offcanvas-left">
                  <div className="column col-sm-3 col-xs-1 sidebar-offcanvas" id="sidebar">
                  {this.isRole('Admin', this.adminMenu())}
                  </div>
                  <div className="column col-sm-9 col-xs-11" id="main">
                  <div id="pageTitle">
                    <div className="title">Create Expert</div>
                  </div>
                  {/* form begin here */ }
                  <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                    <div dangerouslySetInnerHTML={{__html: this.state.responseMsg}} />
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>First Name</label>
                        <Field name="firstName" component={renderField} type="text" />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Last Name</label>
                        <Field name="lastName" component={renderField} type="text" />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-12">
                        <label>Email</label>
                        <Field name="email" component={renderEmailField} type="email" />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-12">
                        <label>Password</label>
                        <Field name="password" component={renderField} type="text" />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-12">
                        <label>Bio</label>
                        <Field name="userBio" rows="3" component={renderTextarea} type="text" />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-4 form-group">
                        <label>Hourly Rate</label>
                        <Field name="expertRates" component={renderField} type="number" min="1" max="10"/>/$
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Categories</label>
                        <Field name="expertCategories" component={renderFieldexpertCategories} type="select" />
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Contact Number</label>
                        <Field name="expertContact" component={renderField} type="number"/>
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-4 form-group">
                        <label>Rating</label>
                        <Field name="expertRating" component={renderField} type="number" min="1" max="10"/>
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Focus of Expertise</label>
                        <Field name="expertFocusExpertise" component={renderField} type="text"/>
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Years of Expertise</label>
                        <Field name="yearsexpertise" component={renderFieldyearsexpertise} type="select" />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-12">
                        <button type="submit" className="btn btn-primary">Submit</button>
                        &nbsp;<button className="btn btn-default" onClick = {this.clearInput}>Reset</button>
                      </div>
                    </div>
                  </form>
                  { /* form end here */ }
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
export default connect(mapStateToProps, { protectedTest, createExpert })(form(CreateExpert));
