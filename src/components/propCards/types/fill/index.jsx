import React from 'react';
import { connect } from 'react-redux';
import actions from 'quo-redux/actions';

import PropCardWrapper from '../PropCardWrapper';

import SliderCore from 'ui-components/inputElements/slider/sliderCore';
import TextInput from 'ui-components/inputElements/textInput/textInput';
import ColorPicker from 'ui-components/inputElements/colorPicker';

import { SketchPicker } from 'react-color';
import PropCard from '../PropCardWrapper';

class Fill extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      displayColorPicker:false,
      color: this.props.fill || this.props.backgroundColor || { r: 0, g:0, b:0, a:0 }
    }
  }

  getProp = () => {
    return (this.props.fill ? 'fill' : 'backgroundColor')
  }

  handleChange = (color) => {
    this.setState({ color: color.rgb }, ()=>{
      this.props.update({[this.getProp()]:this.state.color})
    });
  };

  handleSliderChange = (alpha) => {
    let color = {...this.state.color}
    color.a = alpha / 100;
    this.setState({color:color}, ()=>{
      this.props.update({[this.getProp()]:this.state.color})
    });
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  render(){
    return(
      <div>
        <PropCardWrapper title='Fill'>

           <ColorPicker title='Color' color={ this.state.color } handleClick={ this.handleClick }/>
           <SliderCore title='Opacity' step={1} min={0} max={100} value={parseInt(this.state.color.a * 100)} handleOnChange={this.handleSliderChange}/>
          <TextInput title='' text={parseInt(this.state.color.a * 100)} type='percentage' after="%"/>
        </PropCardWrapper>
        {
          this.state.displayColorPicker
            ?
              <SketchPicker color={ this.state.color } onChange={ this.handleChange.bind(this) }/>
            :
          null
        }

      </div>
    )
  }
}

export default connect()(Fill)
