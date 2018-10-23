import React from 'react';
import { connect } from 'react-redux';

import Base from '../PropCardWrapper';
import TextInput from 'ui-components/inputElements/textInput/textInput';
import { getPropsOfSelection } from 'quo-redux/helpers';

class Size extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      w: this.props.width,
      h: this.props.height
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      w: this.props.width,
      h: this.props.height
    })
  }

  updateW(val,title,isFinal){
    //set the state and update
    this.setState({w:parseInt(val)},()=>{
      if (isFinal) this.props.update({width:this.state.w})
    });
  }

  updateH(val,title,isFinal){
    this.setState({h:parseInt(val)},()=>{
      if (isFinal) this.props.update({height:this.state.h})
    });
  }

  render(){
    return(
      this.props.width && this.props.height ?
      <Base title='Size'>
        <TextInput title='W' text={this.state.w} type='number' after="" onChange={this.updateW.bind(this)}/>
        <TextInput title='H' text={this.state.h} type='number' after="" onChange={this.updateH.bind(this)}/>
      </Base>
      :
      <Base title='Size'>
        <TextInput title='W' text='0' type='number'/>
        <TextInput title='H' text='0' type='number'/>
      </Base>

    )
  }
}

export default Size