import React from 'react';
import { StyleCard } from '../styleCard';
import SliderCore from '../../inputElements/slider/sliderCore'
import TextInput from '../../inputElements/textInput/textInput'

export default class Movement extends React.Component{
  render(){
    return(
      <StyleCard title='Movement'>
        <SliderCore title='Amount' step={0.1} min={0} max={5} value={1}/>
        <TextInput title='X' text='1' type='number'/>
        <TextInput title='Y' text='1' type='number'/>
      </StyleCard>
    )
  }
}
