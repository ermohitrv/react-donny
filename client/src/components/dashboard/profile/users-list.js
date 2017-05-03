import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { protectedTest } from '../../../actions/auth';

import {getUsersList} from '../../../actions/admin'

import SidebarMenuAdmin from '../sidebar-admin';
import SidebarMenuExpert from '../sidebar-expert';
import SidebarMenuUser from '../sidebar-user';

import {BanMe, UnBanMe} from "../../../actions/admin"


class UsersList extends Component {
  constructor(props) {
    super(props);
    this.state={
    	users:[],
      SuccessMessage:""
    },
    this.props.protectedTest();
    this.BanMe = this.BanMe.bind(this);
    this.UnBanMe = this.UnBanMe.bind(this);
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
  	// console.log("HERE");

  	try{
      	this.props.getUsersList().then(
      		(response)=>{
      			// console.log("Success");
      			// console.log(response.user)
      			this.setState({users:response.user})
  			},
      		(err) => err.response.json().then(({errors})=> {
				// console.log("err");
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
  BanMe(e){
  	e.preventDefault()
  	// console.log(e.target)
  	// console.log(e.target.value)
  	var id = e.target.value
    var confirm=false
    var confirm2= false
    if (id==null || id==undefined || id==""){
      // console.log(e.target.parentNode)
      // console.log("******")
      // console.log(e.target.parentNode.value)
      id = e.target.parentNode.value
      confirm2=true
    }
    else{
      confirm=true
    }

  	// console.log(id)
    var confirm
  	this.props.BanMe(id).then(
  			(response)=>{
  				if(response.SuccessMessage && response.SuccessMessage!==null && response.SuccessMessage!=undefined){
  					// location.reload()
            if(response.state && response.state!==null && response.state!=undefined && response.state=="Banned"){
              this.setState({SuccessMessage:response.SuccessMessage})
            }
            else{
                this.setState({SuccessMessage:response.SuccessMessage})
            }
            
            // e.target.parentNode.html="f"
  				}
  			}

  		)
    // console.log("c"+confirm)
    // console.log(confirm2)
    if(confirm && confirm!=null && confirm!=undefined && confirm==true && confirm!=""){
      // console.log("***********")
      // console.log(e.target.children[0].style)
      if(e.target.children[0].style.color=="red"){
        e.target.children[0].style.color="green"
        // console.log(e.target.parentNode.parentNode.children[4].children[0].innerHTML="No")
        e.target.parentNode.parentNode.children[4].children[0].innerHTML="No"
      }
      else{
        e.target.children[0].style.color="red"
        // console.log(e.target.parentNode.parentNode.children[4].children[0].innerHTML="Yes")
        e.target.parentNode.parentNode.children[4].children[0].innerHTML="Yes"
      }
      // console.log("***** TRUE")
      // e.target.parentNode.innerHTML ="<button onClick=this.UnBanMe.bind(this); value="+id+"><h4 style='color:green'>X</h4></button>"
      // confirm=false
    }
    if(confirm2 && confirm2!=null && confirm2!=undefined && confirm2==true && confirm2!=""){
      // console.log("***123** FALSE")
      // console.log(e.target.style.color)
      if(e.target.style.color=="red"){
        // console.log("coloring green")
        e.target.style.color="green"
        // console.log(e.target.parentNode.parentNode.parentNode.children[4].children.innerHTML="No")
        e.target.parentNode.parentNode.parentNode.children[4].children[0].innerHTML="No"
      }
      else{
        e.target.style.color="red"
        e.target.parentNode.parentNode.parentNode.children[4].children[0].innerHTML="Yes"
        // console.log("coloring red")
      }
      // e.target.parentNode.innerHTML ="<button onClick=this.UnBanMe.bind(this) value="+id+"><h4 style='color:green'>X</h4></button>"
      // confirm=false
    }
  }
  UnBanMe(e){
  	e.preventDefault()
  	// console.log(e.target)
  	// console.log(e.target.value)
  	var id = e.target.value
    if (id==null || id==undefined || id==""){
      // console.log(e.target.parentNode)
      // console.log("******")
      // console.log(e.target.parentNode.value)
      id = e.target.parentNode.value
    }

  	// console.log(id)

  	this.props.UnBanMe(id).then(
  			(response)=>{
  				if(response.SuccessMessage && response.SuccessMessage!==null && response.SuccessMessage!=undefined){
  					// location.reload()
           this.setState({SuccessMessage:"Successfully Un-Baned The User"}) 
  				}
  			}

  		)
  }


  	render() {
      const successM=(
          <div className="alert alert-success">
            {this.state.SuccessMessage}
          </div>

        )
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
                        {this.state.SuccessMessage && this.state.SuccessMessage!=null && this.state.SuccessMessage!=undefined && this.state.SuccessMessage!=""? successM:""}
                      </div>
                      <p>{this.props.content}</p>
                      <div>
                      {/*console.log("HERE IN RENDER")*/}
                      {/*console.log(this.state.users[0])*/}
        							<table>
        							  <tr>
        							    <th style={{"width":20+"%","paddingLeft":10+"px"}}>First Name</th>
        							    <th style={{"width":20+"%"}}>Second Name</th>
        							    <th style={{"width":40+"%"}}>Email</th>
        							    <th style={{"width":10+"%"}}>Role</th>
        							    <th style={{"width":50+"%"}}>Enabled</th>
        							    <th style={{"width":50+"%"}}>Action</th>
        							  </tr>
                              		  {this.state.users && this.state.users!==null && this.state.users!==undefined ? this.state.users.map((user, index) => <TableRow index={index} data={user} BanMe={this.BanMe} UnBanMe={this.UnBanMe} />):"y"}
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
				<td>{this.props.data.enableAccount===true? <button className="btn " style={{borderColor: "white", height: 50+"px",width: 72+"px"}} onClick={this.props.BanMe} value={this.props.data._id}><h4 value={this.props.data._id} style={{color:"red"}}>X</h4></button>:<button className="btn " style={{borderColor: "white", height: 50+"px",width: 72+"px"}} onClick={this.props.BanMe} value={this.props.data._id}><h4 style={{color:"green"}}>X</h4></button>}</td>
			</tr>
			)
	}
}
function mapStateToProps(state) {
  return { content: state.auth.content };
}

export default connect(mapStateToProps, {protectedTest, getUsersList, BanMe, UnBanMe})(UsersList);