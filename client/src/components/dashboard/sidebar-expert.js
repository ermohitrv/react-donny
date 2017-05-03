'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

class SidebarMenuExpert extends Component {
  render() {
    return (
      <div className="column col-sm-3 col-xs-1 sidebar-offcanvas" id="sidebar">
        <span className="sidebar-caption">Expert Controlls</span>
        <ul className="nav nav-sidebar" id="menu">
          <li><Link to="/profile/edit"><i className="glyphicon glyphicon-list-alt"></i> <span className="collapse in hidden-xs"> Edit Profile</span></Link></li>
          <li><Link to="/dashboard/inbox"><i className="glyphicon glyphicon-list-alt"></i> <span className="collapse in hidden-xs"> Inbox</span></Link></li>
          <li><Link to="/dashboard/session-reviews"><i className="fa fa-commenting-o" aria-hidden="true"></i> session reviews</Link></li>
          <li><Link to="/mysession-list"><i className="fa fa-desktop"></i> sessions history</Link></li>
        </ul>
      </div>
    );
  }
}

export default SidebarMenuExpert;
