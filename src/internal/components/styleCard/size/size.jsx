import React from 'react';
import { StyleCard } from '../styleCard';
import SliderCore from '../../inputElements/slider/sliderCore'
import TextInput from '../../inputElements/textInput/textInput'
import {connect} from 'react-redux';

class Size extends React.Component{
  constructor(props){
    super(props);
    this.state = props.selection
  }
  componentWillReceiveProps(nextProps){
    this.setState(nextProps.selection,()=>{    console.log(nextProps,this.state);});

  }
  render(){
    console.log(this.state.data);
    return(
      this.state.data ?
      <StyleCard title='Size'>
        <TextInput title='W' text={this.state.data.frame.width} type='number'/>
        <TextInput title='H' text={this.state.data.frame.height} type='number'/>
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
  return {selection:state.present.selection}
}

export default connect(mapStateToProps)(Size)
