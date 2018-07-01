import React from 'react'

import { ButtonCore } from '../buttons/buttons';
import { connect } from 'react-redux';
import { DATABASE_ACTION } from '../../redux/actions';

class TopBar extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      windowName : this.props.windowName
    }
    this.clearViewer = this.clearViewer.bind(this);
    this.pushProject = this.pushProject.bind(this);
  }
  clearViewer(){
    const { dispatch } = this.props;
    dispatch(DATABASE_ACTION('CLEAR_VIEWER',{}))
  }
  pushProject(){
    const { dispatch } = this.props;
    dispatch(DATABASE_ACTION('PUSH_PROJECT',{}))
  }

  render(){
    return (
      <div className='top-bar'>
        <ButtonCore title='Clear Artboard' onClick={this.clearViewer}/>
        <ButtonCore title='Push Project' onClick={this.pushProject}/>
        <ButtonCore title='Clear Artboard' onClick={this.clearViewer}/>
      </div>
    )
  }
}

export default connect()(TopBar);
