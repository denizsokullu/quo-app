import React from 'react';
import Base from '../base';
import SliderCore from '../../../inputElements/slider/sliderCore'
import TextInput from '../../../inputElements/textInput/textInput'

export default class Shadow extends React.Component{
  render(){
    return(
      <Base title='Shadow'>
        <SliderCore title='Amount' step={0.1} min={0} max={5} value={1}/>
        {/* <TextInput title='x' text='1' type='number'/>
        <TextInput title='y' text='1' type='number'/> */}
        <TextInput title='blur' text='1' type='number'/>
        <TextInput title='spread' text='1' type='number'/>
      </Base>
    )
  }
}
