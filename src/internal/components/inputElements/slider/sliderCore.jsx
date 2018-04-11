import React from 'react';
import 'react-rangeslider/lib/index.css';
import Slider from 'react-rangeslider';

export default class SliderCore extends React.Component{

  constructor(props, context) {
    super(props, context)

    //required props
    //min max, steps

    this.state = {
      //change this later
      value: this.props.value
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({value:nextProps.value})
  }

  handleOnChange = (value) => {
    this.setState({
      value: +parseFloat(value).toFixed(2)
    })
    this.props.handleOnChange(value);
  }

  render(){
    let { value } = this.state
    return(
      <div className='slider'>
        <Slider
          step={this.props.step}
          min={this.props.min}
          max={this.props.max}
          value={this.state.value}
          onChange={this.handleOnChange}
        />
        <div className='slider-title'>{this.props.title}</div>
      </div>
    )
  }

}
