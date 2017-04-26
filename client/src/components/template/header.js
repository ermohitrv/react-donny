import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import cookie from 'react-cookie';
import $ from 'jquery';

import * as actions from '../../actions/messaging';
import ExpertAudioCall from './expert-audio-call';

const socket = actions.socket;

const currentUser = cookie.load('user');
//console.log('currentUser: '+JSON.stringify(currentUser));

class HeaderTemplate extends Component {
  renderLinks() {

    if (this.props.authenticated) {
      return [
        <li key={`${1}header`}>
          <Link to="/"><i className="fa fa-home"></i> Home</Link>
        </li>,
        <li key={`${2}header`}>
            {/*}<Link to="dashboard">Dashboard( {currentUser.role} - {currentUser.slug} )</Link>{*/}
          <div className="dropdown">
              <a data-toggle="dropdown" className="dropdown-toggle" href="javascript:void()" aria-expanded="true">
                <span className="name"><i className="fa fa-user"></i> {currentUser.firstName} {currentUser.lastName}({currentUser.role})</span>
                <b className="caret"></b>
              </a>
              <ul className="dropdown-menu">
                 <div className="log-arrow-up"></div>
                 <li><Link href="/mysession-list"><i className="fa fa-desktop"></i> my sessions</Link></li>
                 { currentUser.role == 'Expert' ?   <li><Link href="/recordings"><i className="fa fa-microphone"></i> Recordings </Link></li> : '' }
                 <li><Link href="/profile"><i className="fa fa-user"></i> profile</Link></li>
                 <li><Link to="/update-profile"><i className="fa fa-suitcase" title="Update Profile"></i> update profile</Link></li>
                 <li><Link to="logout"><i className="fa fa-key" ></i> logout</Link></li>
              </ul>
            </div>
        </li>
      ];
    } else {
      return [
        // Unauthenticated navigation
        <li key={1}>
          <Link to="/">Home</Link>
        </li>,
        <li key={2}>
          <Link to="login">Login</Link>
        </li>,
        <li key={3}>
          <Link to="register">Signup</Link>
        </li>,
      ];
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-collapse">
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <div className="logo-tag"> <IndexLink className="navbar-brand" to="/">Donny's list</IndexLink>
                <span className="navbar-caption">connecting people to learn online.</span>
              </div>
            </div>
            <div className="collapse navbar-collapse" id="nav-collapse">
              <ul className="nav navbar-nav navbar-right">
                {this.renderLinks()}
              </ul>
            </div>
          </div>
        </nav>

        {/* modal for expert to notify audio call  */}
          <ExpertAudioCall email={ currentUser ?  currentUser.email : '' } />
         {/* modal for expert to notify audio call  */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps)(HeaderTemplate);
