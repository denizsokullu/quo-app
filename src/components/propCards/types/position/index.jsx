import React from 'react';
import {connect} from 'react-redux';

import { getState } from 'quo-redux/state';
import { getPropsOfSelection } from 'quo-redux/helpers';
import actions from 'quo-redux/actions';

import Base from '../base';
import TextInput from 'ui-components/inputElements/textInput/textInput';

class Position extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      x:0,
      y:0
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      x:nextProps.x,
      y:nextProps.y
    })
  }

  updateX(val,title,isFinal){
    //set the state and update
    this.setState({x:parseInt(val)},()=>{
      if (isFinal) this.dispatchUpdate()
    });
  }

  updateY(val,title,isFinal){
    this.setState({y:parseInt(val)},()=>{
      if (isFinal) this.dispatchUpdate()
    });
  }

  dispatchUpdate(){
    const { dispatch } = this.props;
    dispatch(actions.UPDATE_COMPONENT_PROPS({ id: this.props.id, props: { x:this.state.x, y:this.state.y }}));
  }

  render(){
    return(
      this.props.x && this.props.y ?
      <Base title='Position'>
        <TextInput title='X' text={this.state.x} type='number' after="" onChange={this.updateX.bind(this)}/>
        <TextInput title='Y' text={this.state.y} type='number' after="" onChange={this.updateY.bind(this)}/>
      </Base>
      :
      <Base title='Position'>
        <TextInput title='X' text='0' type='number'/>
        <TextInput title='Y' text='0' type='number'/>
      </Base>

    )
  }
}

export default connect( s => getPropsOfSelection(s,['x','y']))(Position)
