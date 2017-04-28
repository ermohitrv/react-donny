import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { protectedTest } from '../../../actions/auth';

import {getUsersList} from '../../../actions/admin'

import SidebarMenuAdmin from '../sidebar-admin';
import SidebarMenuExpert from '../sidebar-expert';
import SidebarMenuUser from '../sidebar-user';


class UsersList extends Component {
  constructor(props) {
    super(props);
    this.state={
    	users:[]
    },
    this.props.protectedTest();
  }


  adminMenu() {
    return (
      <SidebarMenuAdmin/>
    );
  }
  breadcrumb(){
    return(
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
        <li className="breadcrumb-item">Users List</li>
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
  componentWillMount(){
  	console.log("HERE");

  	try{
      	this.props.getUsersList().then(
      		(response)=>{
      			console.log("Success");
      			console.log(response.user)
      			this.setState({users:response.user})
  			},
      		(err) => err.response.json().then(({errors})=> {
				console.log("err");
  			})
  		);
  	}catch(e){console.log('exception '+e);}

  	/*this.props.getUsersList().then(
  			(response)=>{
  				console.log("Success")
  			},
  			(err)=>{
  				console.log("err")
  			}
  		)*/
  }


  	render() {
    	return (

      <div className="session-page">
        <div className="container">
          <div className="row">
            {this.breadcrumb()}
            <div className="wrapper-sidebar-page">
              <div className="row row-offcanvas row-offcanvas-left">
                  {this.isRole('Admin', this.adminMenu())}
{/*                  {this.isRole('Expert', this.expertMenu())}
                  {this.isRole('User', this.userMenu())}*/}
                  <div className="column col-sm-9 col-xs-11" id="main">
                      <div id="pageTitle">
                        <div className="title">User List</div>
                      </div>
                      <p>{this.props.content}</p>
                      <div>
                      {console.log("HERE IN RENDER")}
                      		{console.log(this.state.users[0])}
							<table>
							  <tr>
							    <th style={{"width":50+"%"}}>First Name</th>
							    <th style={{"width":50+"%"}}>Second Name</th>
							    <th style={{"width":70+"%"}}>Email</th>
							    <th style={{"width":50+"%"}}>Role</th>
							    <th style={{"width":50+"%"}}>Status</th>
							    <th style={{"width":50+"%"}}>Permission</th>
							  </tr>
                      		  {this.state.users && this.state.users!==null && this.state.users!==undefined ? this.state.users.map((user, index) => <TableRow index={index} data={user} />):"y"}
							</table>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    		)

	}



}

class TableRow extends React.Component{
	render(){

		{console.log(this.props.data)}
		{console.log('*** this.props.index *** '+this.props.index)}

		// debugger
		return(
			<tr>

				<td><h4>{this.props.data.profile.firstName}</h4></td>
				<td><h4>{this.props.data.profile.lastName}</h4></td>
				<td><h4>{this.props.data.email}</h4></td>
				<td><h4>{this.props.data.role}</h4></td>
				<td>{this.props.key && this.props.key!==null && this.props.key%2==0?"x":"y"}</td>
				<td><h4 style={{color:"red"}}>X</h4></td>
			</tr>
			)
	}
}

function mapStateToProps(state) {
  return { content: state.auth.content };
}

export default connect(mapStateToProps, {protectedTest, getUsersList})(UsersList);