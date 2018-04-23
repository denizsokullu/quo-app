import React from 'react';
import { StyleCard } from '../styleCard';
import SliderCore from '../../inputElements/slider/sliderCore'
import TextInput from '../../inputElements/textInput/textInput'
import {connect} from 'react-redux';
import {COMPONENT_MOVE} from '../../../redux/actions';



class Position extends React.Component{
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

  logPositionChange(val,title,isFinal){
    if(isFinal){
      const { dispatch } = this.props;
      let msg = {component:{id:this.state.selection.id,editStates:this.state.selection.data.editStates}};
      if(title === 'Y'){
        msg.data = {x:this.state.selection.data.editStates[this.state.editState].style.left.slice(0,-2),y:val}
        dispatch(COMPONENT_MOVE(msg));
      }
      if(title === 'X'){
        msg.data = {x:val,y:this.state.selection.data.editStates[this.state.editState].style.top.slice(0,-2)};
        dispatch(COMPONENT_MOVE(msg));
      }
    }
  }

  render(){
    return(
      this.state.selection && this.state.selection.data ?
      <StyleCard title='Position'>
        <TextInput title='X' text={this.state.selection.data.editStates[this.state.editState].style.left.slice(0,-2)} type='number' after="" onChange={this.logPositionChange.bind(this)}/>
        <TextInput title='Y' text={this.state.selection.data.editStates[this.state.editState].style.top.slice(0,-2)} type='number' after="" onChange={this.logPositionChange.bind(this)}/>
      </StyleCard>
      :
      <StyleCard title='Position'>
        <TextInput title='X' text='-' type='number'/>
        <TextInput title='Y' text='-' type='number'/>
      </StyleCard>

    )
  }
}

function mapStateToProps(state) {
  return {selection:state.present.selection,editState:state.present.editState}
}

export default connect(mapStateToProps)(Position)
