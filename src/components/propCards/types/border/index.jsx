import React from 'react';
import Base from '../base';
import SliderCore from '../../../inputElements/slider/sliderCore'

export default class Border extends React.Component{
  render(){
    return(
      <Base title='Border'>
        <SliderCore title='Amount' step={0.1} min={0} max={5} value={1}/>
      </Base>
    )
  }
}
