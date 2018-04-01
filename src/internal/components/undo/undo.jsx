import React from 'react';
import {connect} from 'react-redux';
import { ActionCreators } from 'redux-undo';



class UndoButton extends React.Component{
  constructor(props){
    super(props);
    this.state = this.props
    this.undoAction = this.undoAction.bind(this)
  }
  undoAction(){
    // console.log(parent);
    // console.log(this);
    const { dispatch } = this.props;
    dispatch(ActionCreators.undo());
  }
  render(){
    return(
      <button className='undoButton' onClick={this.undoAction}>UNDO</button>
    )
  }
}

export default connect()(UndoButton)
