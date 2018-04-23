import React from 'react';
import { StyleCard } from '../styleCard';
import SliderCore from '../../inputElements/slider/sliderCore'
import TextInput from '../../inputElements/textInput/textInput'
import { connect } from 'react-redux';
import { COMPONENT_RESIZE } from '../../../redux/actions';

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
      let msg = {component:{id:this.state.selection.id,editStates:this.state.selection.data.editStates}};
      if(title === 'W'){
        msg.data = {height:null,width:val}
        console.log(msg)
        dispatch(COMPONENT_RESIZE(msg));
      }
      if(title === 'H'){
        msg.data = {height:val,width:null};
        console.log(msg)
        dispatch(COMPONENT_RESIZE(msg));
      }
    }
  }

  render(){
    return(
      this.state.selection && this.state.selection.data ?
      <StyleCard title='Size'>
        <TextInput title='W' text={this.state.selection.data.editStates[this.state.editState].style.width.slice(0,-2)} type='number' after="" onChange={this.logSizeChange.bind(this)}/>
        <TextInput title='H' text={this.state.selection.data.editStates[this.state.editState].style.height.slice(0,-2)} type='number' after="" onChange={this.logSizeChange.bind(this)}/>
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
  return {selection:state.present.selection,editState:state.present.editState}
}

export default connect(mapStateToProps)(Size)
