import React from 'react';
import { StyleCard } from '../styleCard';
import TextInput from '../../inputElements/textInput/textInput';
import { connect } from 'react-redux';
import { COMPONENT_RESIZE, COMPONENT_STYLE_CHANGE } from '../../../redux/actions';

class Size extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selection:props.selection,
      editState:props.editState
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({selection:nextProps.selection,editState:nextProps.editState});
  }

  logSizeChange(val,title,isFinal){
    if(isFinal){
      const { dispatch } = this.props;
      let msg = { id:this.state.selection.id, w:0, h:0};
      if(title === 'W'){
        msg.w = parseInt(val) - parseInt(this.state.selection.editStates[this.state.editState].style.width.slice(0,-2))
      }
      if(title === 'H'){
        msg.h = parseInt(val) - parseInt(this.state.selection.editStates[this.state.editState].style.height.slice(0,-2))
      }
      if(msg.w !== 0 || msg.h !== 0){
        dispatch(COMPONENT_RESIZE(msg));
        // dispatch(COMPONENT_STYLE_CHANGE('BOX_SHADOW',{boxShadow:[5,5,5,5,[0,0,0,1]],id:this.state.selection.id}));
      }
    }
  }

  render(){
    return(
      this.state.selection !== '' ?
      <StyleCard title='Size'>
        <TextInput title='W' text={this.state.selection.editStates[this.state.editState].style.width.slice(0,-2)} type='number' after="" onChange={this.logSizeChange.bind(this)}/>
        <TextInput title='H' text={this.state.selection.editStates[this.state.editState].style.height.slice(0,-2)} type='number' after="" onChange={this.logSizeChange.bind(this)}/>
      </StyleCard>
      :
      <StyleCard title='Size'>
        <TextInput title='W' text='-' type='number'/>
        <TextInput title='H' text='-' type='number'/>
      </StyleCard>

    )
  }
}

function mapStateToProps(state) {

  let component = state.present.newAssets[state.present.currentPage].components[state.present.newSelection]

  return { selection:component, editState:state.present.editState}
}

export default connect(mapStateToProps)(Size)
