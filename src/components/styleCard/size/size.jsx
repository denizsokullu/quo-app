import React from 'react';
import { StyleCard } from '../styleCard';
import TextInput from '../../inputElements/textInput/textInput';
import { connect } from 'react-redux';
// import { COMPONENT_RESIZE, COMPONENT_STYLE_CHANGE } from '../../../redux/actions';

import { getPropsOfSelection } from '../../../redux/helpers';

class Size extends React.Component{
  logSizeChange(val,title,isFinal){
    // if(isFinal){
    //   const { dispatch } = this.props;
    //   let msg = { id:this.state.selection.id, w:0, h:0};
    //   if(title === 'W'){
    //     msg.w = parseInt(val) - parseInt(this.state.selection.editStates[this.state.editState].style.width.slice(0,-2))
    //   }
    //   if(title === 'H'){
    //     msg.h = parseInt(val) - parseInt(this.state.selection.editStates[this.state.editState].style.height.slice(0,-2))
    //   }
    //   if(msg.w !== 0 || msg.h !== 0){
    //     dispatch(COMPONENT_RESIZE(msg));
    //     // dispatch(COMPONENT_STYLE_CHANGE('BOX_SHADOW',{boxShadow:[5,5,5,5,[0,0,0,1]],id:this.state.selection.id}));
    //   }
    // }
  }

  render(){
    return(
      this.props.width && this.props.height ?
      <StyleCard title='Size'>
        <TextInput title='W' text={this.props.width} type='number' after="" onChange={this.logSizeChange.bind(this)}/>
        <TextInput title='H' text={this.props.height} type='number' after="" onChange={this.logSizeChange.bind(this)}/>
      </StyleCard>
      :
      <StyleCard title='Size'>
        <TextInput title='W' text='0' type='number'/>
        <TextInput title='H' text='0' type='number'/>
      </StyleCard>

    )
  }
}

export default connect( s => getPropsOfSelection(s,['width','height']))(Size)
