import React, { Component } from 'react';
import HeaderTemplate from './template/header';
import FooterTemplate from './template/footer';

class App extends Component {
  render() {
    return (
      <div>
        <HeaderTemplate logo="Donnys List" />
          {this.props.children}
        <FooterTemplate />
      </div>
    );
  }
}

export default App;
