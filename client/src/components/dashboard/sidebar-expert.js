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
        </ul>
      </div>
    );
  }
}

export default SidebarMenuExpert;
