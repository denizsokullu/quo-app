import React from 'react'

import { ButtonCore } from '../buttons/buttons';
import { connect } from 'react-redux';
import { getState } from 'quo-redux/state';
import { getSelectionFirstID, getComponentFromCurrentTab } from 'quo-redux/helpers';
import actions from 'quo-redux/actions';
import HorizontalOptionGroup from 'ui-components/inputElements/horizontalOptionGroup';

class TopBar extends React.Component {
  setAppMode = (mode) => {
    const { dispatch } = this.props;
    if(this.props.appMode === mode) return;
    dispatch(actions.SET_APP_MODE(mode));
  }

  render(){
    let editSelected = this.props.appMode === 'EDIT'
    let previewSelected = this.props.appMode === 'PREVIEW'
    return (
      <div className='top-bar'>
        <ButtonCore title='App Mode: EDIT' selected={editSelected} onClick={() => this.setAppMode('EDIT')}/>
        <ButtonCore title='App Mode: PREVIEW' selected={previewSelected} onClick={() => this.setAppMode('PREVIEW')}/>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  let { appMode } = getState(state, 'app');
  return { appMode };
}
export default connect(mapStateToProps)(TopBar);
