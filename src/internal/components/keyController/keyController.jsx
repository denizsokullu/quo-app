import _ from 'underscore';
import React from 'react';
import {connect} from 'react-redux';
import keydown, { Keys} from 'react-keydown';

// import Draggable from 'react-draggable';
// import {bindActionCreators} from 'redux';
// import ComponentRenderer from './componentRenderer';
import {KEY_UP,KEY_DOWN} from '../../redux/actions';

import { ActionCreators } from 'redux-undo';

class KeyController extends React.Component {
  constructor(props) {
    super(props);
    this.keyReleased = this.keyReleased.bind(this);
    this.state = {
      keyDown:false
    }
    // this.onWheel = this.onWheel.bind(this);
  }

  keyReleased(e){
    this.setState({keyDown:false});
    if(e.keyCode === 32){
      const { dispatch } = this.props
      dispatch(KEY_UP(e));
    }
  }

  @keydown('cmd+shift+z')
  dispatchRedo(e){
    const { dispatch } = this.props
    dispatch(ActionCreators.redo());
    e.preventDefault();
  }

  @keydown('cmd+z')
  dispatchUndo(e){
    e.preventDefault();
    if(!this.state.keyDown){
      const { dispatch } = this.props
      dispatch(ActionCreators.undo());
      this.setState({keyDown:true})
    }
  }

  @keydown('cmd+s')
  dispatchSave(e){
    e.preventDefault();
  }

  render() {
    return (
      <div className='main-container' tabIndex='0' onKeyUp={this.keyReleased} onWheel={this.onWheel}>
        {this.props.children}
      </div>
    )
  }

  @keydown('space')
  dragEnable(e){
    e.preventDefault();
    if(!this.state.keyDown){
      const { dispatch } = this.props
      this.setState({keyDown:true},()=>{
        dispatch(KEY_DOWN(e));
      })
    }
  }


}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(KeyController);
