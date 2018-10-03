import React from 'react'

import { ButtonCore } from '../buttons/buttons';
import { connect } from 'react-redux';
import { getState } from 'quo-redux/state';
import { getSelectionFirstID, getComponentFromCurrentTab } from 'quo-redux/helpers';
import { DATABASE_ACTION, TEST_TIMEOUT } from 'quo-redux/actions';
import HorizontalOptionGroup from 'ui-components/inputElements/horizontalOptionGroup';

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
        {/* { this.props.stateModifiers ?
          <div style={{width:'500px'}}>
          <HorizontalOptionGroup
            options={this.props.stateModifiers.map(e => { return { text:e} })}
          />
        </div> : null
        } */}
        {/* <ButtonCore title='Clear Artboard' onClick={this.clearViewer}/> */}
        {/* <ButtonCore title='Push Project' onClick={this.pushProject}/> */}
        {/* <ButtonCore title='Clear Artboard' onClick={this.clearViewer}/> */}
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  // let domain = getState(state,'domain');
  // let component = getComponentFromCurrentTab(domain.tabs,getSelectionFirstID(state));
  // if(!component) return {};
  // return {
  //   stateModifiers:component.state.states.composite.modifiers
  // }
  return {};
}
export default connect(mapStateToProps)(TopBar);
