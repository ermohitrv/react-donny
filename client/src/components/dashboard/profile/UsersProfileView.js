// UsersProfileView
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { protectedTest } from '../../../actions/auth';

import {getTheUserInformation, AdminUpdateExpert} from '../../../actions/admin'

import SidebarMenuAdmin from '../sidebar-admin';
import SidebarMenuExpert from '../sidebar-expert';
import SidebarMenuUser from '../sidebar-user';

import classnames from 'classnames'

class UsersProfileView extends Component {
	constructor(props){
		super(props)
		this.state={
			successmessage:"",
			errorMessage:'',

			firstName:"",
			lastName:"",
			email:"",
			password:"",           //remove it
			userBio:"",
			expertRates:"",
			expertCategories:"",
			expertContact:"",
			expertRating:"",
			expertFocusExpertise:"",
			yearsexpertise:"",
			errors:{},


		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentWillMount(){
		// console.log("Hi Component")
		if(this.props && this.props!==null && this.props!==undefined && this.props.params && this.props.params!==null && this.props.params!==undefined && this.props.params!==""){
			// console.log("EXISTS")
			var id=this.props.params
			this.props.getTheUserInformation(id).then(
					(response)=>{
						// console.log("$$$$$$$$$$$$");
						this.setState({"firstName":response.user.profile.firstName,"lastName":response.user.profile.lastName, email:response.user.email})
						this.setState({"userBio":response.user.userBio,expertRates:response.user.expertRates, expertCategories:response.user.expertCategories})
						this.setState({"expertContact": response.user.contact, "expertRating":response.user.expertRating, expertFocusExpertise:response.user.expertFocusExpertise})
						this.setState({"yearsexpertise":response.user.yearsexpertise, password:response.user.password})
					},
					(err)=>{
						// console.log("$$$$werwerwerw$$$$$$$$")
						this.setState({ errorMessage:"Sorry Couldn't get Information"})
					}
				);
			
		}
		// this.setState({successmessage:"Succes"})
		// console.log(JSON.stringify(this))
	}
	componentDidMount(){
		// console.log("Hi Did")
		// console.log(JSON.stringify(this))
		// if(this.props.params){
		// 	console.log("EXISTS")
		// }
		// this.setState({successmessage:"Succes"})
		// console.log(JSON.stringify(this))
	}
	handleSubmit(e){
		e.preventDefault();
		// console.log("Submitted")
		// console.log(this.state.firstName)
		let errors={}
			if(this.state.firstName==="" || this.state.firstName==undefined || this.state.firstName.trim()==="" ) errors.firstName="First Name cant be empty"
			if(this.state.lastName==="" || this.state.lastName==undefined || this.state.lastName.trim()==="" ) errors.lastName="Last Name cant be empty"
			if(this.state.email===""|| this.state.email==undefined ) errors.this.state.firstName="Email cant be empty"
			if(this.state.password==="" || this.state.password==undefined ||this.state.password.trim()==="" ) errors.password="Password cant be empty"
			if(this.state.userBio==="" || this.state.userBio==undefined ||this.state.userBio.trim()==="") errors.userBio="User Bio cant be empty"
			if(this.state.expertRates===""|| this.state.expertRates==undefined ) errors.expertRates="Expert Rates cant be empty"
			if(this.state.expertCategories==="" || this.state.expertCategories==undefined ) errors.expertCategories="Categories cant be empty"
			if(this.state.expertContact==="" || this.state.expertContact==undefined ) errors.expertContact="Contact cant be empty"
			if(this.state.expertRating==="" || this.state.expertRating==undefined ) errors.expertRating="Ratings cant be empty"
			if(this.state.expertFocusExpertise==="" || this.state.expertFocusExpertise==undefined || this.state.expertFocusExpertise.trim()==="") errors.expertFocusExpertise="Focus Expertise cant be empty"
			if(this.state.yearsexpertise===""|| this.state.yearsexpertise==undefined || this.state.yearsexpertise.trim()==="") errors.yearsexpertise="Experience cant be empty"

		this.setState({ errors })
		// console.log(errors)

		const isValid = Object.keys(errors).length===0
		if(isValid)
		{
			// console.log("Yes its valid")
			const {email,firstName,lastName,password,userBio,expertRates,expertCategories,expertContact,expertRating,expertFocusExpertise,yearsexpertise} = this.state
			// console.log(this.state)
			// console.log(lastName)
			// console.log(userBio)
			// console.log(expertRates)
			// console.log(expertCategories)

			this.props.AdminUpdateExpert({email,firstName,lastName, password,userBio,expertRates,expertCategories,expertContact,expertRating,expertFocusExpertise,yearsexpertise}).then(
					(response)=>{
						// console.log("Succes")
						this.setState({successmessage:"Successfully Updated"})
					},
					(err)=>{
						// console.log("Failure")
					}


				)
		}

	}
	handleChange = (e)=>{
		// console.log(e.target.value)
		if(!!this.state.errors[e.target.name]){
			let errors = Object.assign({}, this.state.errors)

			delete errors[e.target.name]
			this.setState({
				[e.target.name] : e.target.value,
				errors
			});
		}
		else{
			this.setState({[e.target.name]: e.target.value})
		}
	}
	  breadcrumb(){
    return(
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
        <li className="breadcrumb-item">Update This Expert</li>
      </ol>
    );
  }
    adminMenu() {
    return (
      <SidebarMenuAdmin/>
    );
  }
    isRole(roleToCheck, toRender) {
    const userRole = cookie.load('user').role;
    if (userRole == roleToCheck) {
      return toRender;
    }
    return false;
  }
	render(){

		return(

      <div className="session-page">
        <div className="container">
          <div className="row">
            {this.breadcrumb()}
            <div className="wrapper-sidebar-page">
              <div className="row row-offcanvas row-offcanvas-left">
              {this.isRole('Admin', this.adminMenu())}
                  <div className="column col-sm-9 col-xs-11" id="main">
                  <div id="pageTitle">
                    <div className="title">Update Expert</div>
                    {this.state.successmessage && this.state.successmessage!==null && this.state.successmessage!==undefined && this.state.successmessage!="" && <div className="alert alert-success">{this.state.successmessage}  </div>}
                  </div>


                  <form id="create_expert" onSubmit={this.handleSubmit}>
                    <div dangerouslySetInnerHTML={{__html: this.state.responseMsg}} />
                    <div className="row">
                      <div  className={classnames('col-md-6 form-group', {"has-error":!!this.state.errors.semail})}>
                        <label>First Name</label>
                        <input name="firstName" className="form-control" value={this.state.firstName} onChange={this.handleChange} type="text" />
                        <span className="error">{this.state.errors.firstName} </span>
                      </div>
                      <div className={classnames('col-md-6 form-group', {"has-error":!!this.state.errors.semail})}>
                        <label>Last Name</label>
                        <input name="lastName" className="form-control" value={this.state.lastName} onChange={this.handleChange} type="text" />
                        <span className="error">{this.state.errors.lastName} </span>
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-12">
                        <label>Email</label>
                        <input name="email" readOnly className="form-control" value={this.state.email} type="email" />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-12">
                        <label>Password</label>
                        <input type="password" name="password" className="form-control" value={this.state.password} onChange={this.handleChange} type="text" />
                      	<span className="error">{this.state.errors.password} </span>
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-12">
                        <label>Bio</label>
                        <input name="userBio" className="form-control" rows="3" value={this.state.userBio} onChange={this.handleChange} type="text" />
                        <span className="error">{this.state.errors.userBio} </span>
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-4 form-group">
                        <label>Hourly Rate</label>
                        <input name="expertRates" className="form-control" value={this.state.expertRates} onChange={this.handleChange} type="number" min="1" max="10"/>
                      	<span className="error">{this.state.errors.expertRates} </span>
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Categories</label>
                        {/*<input name="expertCategories" className="form-control" value={this.state.expertCategories} type="select" />*/}
				    <select name="expertCategories" className="form-control" value={this.state.expertCategories} onChange={this.handleChange}>
				      <option  value="">Select</option>
				     <option   value="accounting">Accounting</option>
				      <option  value="accounting-finance">Accounting-finance</option>
				      <option  value="blogging">Blogging</option>
				      <option  value="graphic-design">Graphic-design</option>
				      <option  value="bass">bass</option>

				    </select>
				    <span className="error">{this.state.errors.expertCategories} </span>
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Contact Number</label>
                        <input name="expertContact" className="form-control" value={this.state.expertContact} onChange={this.handleChange} type="number"/>
                      	<span className="error">{this.state.errors.expertContact} </span>
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-4 form-group">
                        <label>Rating</label>
                        <input name="expertRating" className="form-control" value={this.state.expertRating} onChange={this.handleChange} type="number" min="1" max="10"/>
                      	<span className="error">{this.state.errors.expertRating} </span>
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Focus of Expertise</label>
                        <input name="expertFocusExpertise" className="form-control" value={this.state.expertFocusExpertise} onChange={this.handleChange} type="text"/>
                      	<span className="error">{this.state.errors.expertFocusExpertise} </span>
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Years of Expertise</label>
                        <input name="yearsexpertise" className="form-control" value={this.state.yearsexpertise} onChange={this.handleChange} type="select" />
                      	<span className="error">{this.state.errors.yearsexpertise} </span>
                      </div>
              
                    </div>
            
                    <div className="row form-group">
                    
{/*                        <div className="col-md-4 form-group">
                        <label>Facebook</label>
                        <Field name="facebookLink" value={renderUrlField} type="url"/>
                      </div>
              
                      <div className="col-md-4 form-group">
                        <label>Twitter</label>
                        <Field name="twitterLink" value={renderUrlField} type="url"/>
                      </div>
              
                      <div className="col-md-4 form-group">
                        <label>Instagram</label>
                        <Field name="instagramLink" value={renderUrlField} type="url"/>
                      </div>*/}
              
                    </div>
            
{/*                    <div className="row form-group">
                        <div className="col-md-4 form-group">
                        <label>Linkedin</label>
                        <Field name="linkedinLink" value={renderUrlField} type="url"/>
                      </div>
              
                      <div className="col-md-4 form-group">
                        <label>snapchat</label>
                        <Field name="snapchatLink" value={renderUrlField} type="url"/>
                      </div>
                    </div>*/}
            
            
                    <div className="row form-group">
                      <div className="col-md-12">
                        <button type="submit" className="btn btn-primary">Submit</button>
                        &nbsp;<button className="btn btn-default" onClick = {this.clearInput}>Reset</button>
                      </div>
                    </div>
                  </form>














                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>








			)


	}




}

function mapStateToProps(state) {
  return { content: state.auth.content };
}

export default connect(mapStateToProps, {getTheUserInformation, AdminUpdateExpert})(UsersProfileView);