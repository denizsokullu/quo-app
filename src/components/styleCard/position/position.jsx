import React from 'react';
import { StyleCard } from '../styleCard';
import TextInput from '../../inputElements/textInput/textInput';
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
    this.setState({selection:nextProps.selection, editState:nextProps.editState});
  }

  logPositionChange(val,title,isFinal){
    if(isFinal){
      const { dispatch } = this.props;
      let msg = {id:this.state.selection.id};
      //initialize the delta
      msg = {...msg, x:0, y:0}
      if(title === 'Y'){
        msg = {...msg, y: parseInt(val) - parseInt(this.state.selection.editStates[this.state.editState].style.top.slice(0,-2))}
      }
      if(title === 'X'){
        msg = {...msg, x: parseInt(val) - parseInt(this.state.selection.editStates[this.state.editState].style.left.slice(0,-2))};
      }
      if(msg.x !== 0 || msg.y !== 0){
        dispatch(COMPONENT_MOVE(msg))
      }
    }
  }

  render(){
    return(
      this.state.selection !== '' ?
      <StyleCard title='Position'>
        <TextInput title='X' text={this.state.selection.editStates[this.state.editState].style.left.slice(0,-2)} type='number' after="" onChange={this.logPositionChange.bind(this)}/>
        <TextInput title='Y' text={this.state.selection.editStates[this.state.editState].style.top.slice(0,-2)} type='number' after="" onChange={this.logPositionChange.bind(this)}/>
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

  let component = state.present.newAssets[state.present.currentPage].components[state.present.newSelection]

  return { selection:component, editState:state.present.editState}

}

export default connect(mapStateToProps)(Position)
