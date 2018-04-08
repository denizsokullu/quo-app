import React from 'react';
import { StyleCard } from '../styleCard';
import SliderCore from '../../inputElements/slider/sliderCore'
import TextInput from '../../inputElements/textInput/textInput'
import {connect} from 'react-redux';

class Position extends React.Component{
  constructor(props){
    super(props);
    this.state = props.selection
  }
  componentWillReceiveProps(nextProps){
    this.setState(nextProps.selection,()=>{    console.log(nextProps,this.state);});

  }
  render(){
    return(
      this.state.data ?
      <StyleCard title='Position'>
        <TextInput title='X' text={this.state.data.frame.x} type='number'/>
        <TextInput title='Y' text={this.state.data.frame.y} type='number'/>
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
  return {selection:state.present.selection}
}

export default connect(mapStateToProps)(Position)
