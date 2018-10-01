import _ from 'underscore';
import React from 'react';
import {connect} from 'react-redux';
import keydown from 'react-keydown';

import actions from '../../redux/actions';

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
      dispatch(actions.KEY_UP(e));
    }
  }

  // @keydown('cmd+shift+z')
  // dispatchRedo(e){
  //   const { dispatch } = this.props
  //   dispatch(ActionCreators.redo());
  //   e.preventDefault();
  // }
  //
  // @keydown('cmd+z')
  // dispatchUndo(e){
  //   e.preventDefault();
  //   if(!this.state.keyDown){
  //     const { dispatch } = this.props
  //     dispatch(ActionCreators.undo());
  //     this.setState({keyDown:true})
  //   }
  // }

  @keydown('cmd+s')
  dispatchSave(e){
    e.preventDefault();
  }

  render() {
    return (
      <div className='main-container' tabIndex='0' onKeyUp={this.keyReleased} >
        {this.props.children}
      </div>
    )
  }

  @keydown('space')
  dragEnable(e){
    if(!this.state.keyDown){
      const { dispatch } = this.props
      this.setState({keyDown:true},()=>{
        dispatch(actions.KEY_DOWN(e));
      })
    }
  }

  @keydown('esc')
  dispatchDeselectComponent(e){
    e.preventDefault();
    if(!this.state.keyDown){
      const { dispatch } = this.props
      this.setState({keyDown:true},()=>{
        dispatch(actions.KEY_DOWN(e));
        dispatch(actions.COMPONENT_SELECT(''));
      })
    }
  }


}

export default connect()(KeyController);
