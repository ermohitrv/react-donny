import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { protectedTest } from '../../actions/auth';
import SidebarMenuAdmin from './sidebar-admin';
import SidebarMenuExpert from './sidebar-expert';
import SidebarMenuUser from './sidebar-user';


import { GetActiveSessions } from '../../actions/admin';



class AdminSessionList extends Component {
  constructor(props) {
    super(props);
    this.state={
    	users:[],
      
    }
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
  	console.log("1")
  }
  componentDidMount(){
  	console.log("2")
  	this.props.GetActiveSessions().then(
  			(response)=>{
  				console.log(response)
  				console.log(response.AllUsers)
  				this.setState({users:response.AllUsers})
  				console.log("Success")
  			},
  			(err)=>{
  				console.log("Failure")
  			}

  		)
  }






	render(){
		const userList=(
				<div>
					        		<table>
        							  <tr>
        							    <th style={{"width":20+"%","paddingLeft":10+"px"}}>First Name</th>
        							    <th style={{"width":20+"%"}}>Second Name</th>
        							    <th style={{"width":40+"%"}}>Email</th>
        							    <th style={{"width":10+"%"}}>Role</th>
        							    <th style={{"width":50+"%"}}>Enabled</th>
        							    <th style={{"width":50+"%"}}>Action</th>
        							  </tr>
        							  {this.state.users.map((user, i) => <TableRow index={i} data={user} s={this.state} />)}
        							</table>
					
				</div>
			)
		const empty=(
				<div>
					Nop
				</div>
			)

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
			                        <div className="title">Session List</div>
			                        
			                      </div>
			                      <p>{this.props.content}</p>

					                  	{this.state.users && this.state.users!==null && this.state.users!==undefined ? userList:empty}

			                  </div>









		              </div>
		            </div>
		          </div>
		        </div>
		      </div>

			);
	}
}

class TableRow extends React.Component {
	// console.log("_-___----____-----_____------_______-_ "+this.props)
	render(){
		var color =function(x){
			// console.log(x)
			var color
			{x && x!==null && x%2==0 || x===0? color=  "#c6c6c6":color = "white"}
			return color
		}

		{/*console.log(this.props.data)*/}
		{/*console.log(this.props.data.enableAccount)*/}
		{/*console.log('*** this.props.index *** '+this.props.index)*/}

		// debugger
		return(
			<tr style={{background:color(this.props.index)}}>

				<td><h4 style={{"paddingLeft":10+"px"}}>{this.props.data.profile.firstName}</h4></td>
				<td><h4>{this.props.data.role && this.props.data.role!=null && this.props.data.role!=undefined && this.props.data.role==="Expert"?<a href={"/dashboard/userslist/"+this.props.data._id}>{this.props.data.profile.lastName}</a>:this.props.data.profile.lastName}</h4></td>
				<td><h4>{this.props.data.email}</h4></td>
				<td><h4>{this.props.data.role}</h4></td>
				<td><h4>{this.props.data.enableAccount===true? "Yes":"No"}</h4></td>
				<td>{this.props.data.enableAccount===true? <button className="btn " disabled style={{borderColor: "white", height: 50+"px",width: 72+"px"}} onClick={this.props.BanMe} value={this.props.data._id}><h4 value={this.props.data._id} style={{color:"red"}}>X</h4></button>:<button className="btn " style={{borderColor: "white", height: 50+"px",width: 72+"px"}} onClick={this.props.BanMe} value={this.props.data._id}><h4 style={{color:"green"}}>X</h4></button>}</td>
			</tr>
			)
	}
}


function mapStateToProps(state) {
  return { content: state.auth.content };
}
export default connect(mapStateToProps, {protectedTest, GetActiveSessions})(AdminSessionList);