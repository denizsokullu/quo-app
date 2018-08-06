import React, { Component } from 'react';
import { connect } from 'react-redux';

class LinksTab extends Component {
  render(){
    return (
      <div className='links-tab-wrapper'>
        this is the links tab
      </div>
    )
  }
}

LinksTab = connect()(LinksTab);

export default LinksTab
