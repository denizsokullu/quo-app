import React from 'react';

import { StyleCard } from '../styleCard';
import TextInput from '../../inputElements/textInput/textInput';

// import {COMPONENT_MOVE} from '../../../redux/actions';
import { getState } from '../../../redux/state';
import { getPropsOfSelection } from '../../../redux/helpers';
import {connect} from 'react-redux';

class Position extends React.Component{
  constructor(props){
    super(props);
    // this.state = {
    //   selection:props.selection,
    //   editState:props.editState
    // }
  }


  // componentWillReceiveProps(nextProps){
  //   this.setState({selection:nextProps.selection, editState:nextProps.editState});
  // }

  logPositionChange(val,title,isFinal){
    // if(isFinal){
    //   const { dispatch } = this.props;
    //   let msg = {id:this.state.selection.id};
    //   //initialize the delta
    //   msg = {...msg, x:0, y:0}
    //   if(title === 'Y'){
    //     msg = {...msg, y: parseInt(val) - parseInt(this.state.selection.editStates[this.state.editState].style.top.slice(0,-2))}
    //   }
    //   if(title === 'X'){
    //     msg = {...msg, x: parseInt(val) - parseInt(this.state.selection.editStates[this.state.editState].style.left.slice(0,-2))};
    //   }
    //   if(msg.x !== 0 || msg.y !== 0){
    //     dispatch(COMPONENT_MOVE(msg))
    //   }
    // }
  }

  render(){
    return(
      this.props.x && this.props.y ?
      <StyleCard title='Position'>
        <TextInput title='X' text={this.props.x} type='number' after="" onChange={this.logPositionChange.bind(this)}/>
        <TextInput title='Y' text={this.props.y} type='number' after="" onChange={this.logPositionChange.bind(this)}/>
      </StyleCard>
      :
      <StyleCard title='Position'>
        <TextInput title='X' text='0' type='number'/>
        <TextInput title='Y' text='0' type='number'/>
      </StyleCard>

    )
  }
}

export default connect( s => getPropsOfSelection(s,['x','y']))(Position)
