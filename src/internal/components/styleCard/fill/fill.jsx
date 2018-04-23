import React from 'react';
import { StyleCard } from '../styleCard';
import SliderCore from '../../inputElements/slider/sliderCore';
import TextInput from '../../inputElements/textInput/textInput';
import ColorPicker from '../../inputElements/colorPicker';
import { SketchPicker } from 'react-color';
import {connect} from 'react-redux';

class Fill extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      displayColorPicker:false,
      color:this.getColor(props.selection),
      selection:props.selection,
      editStates:props.editStates
    }
  }

  getColor(selection){
    if(selection.data){
      let color = selection.data.style.fills[0].color;
      return {r:parseInt(color.red*255),g:parseInt(color.green*255),b:parseInt(color.blue*255),a:color.alpha}
    }
    else{
      return {r:'0',g:'0',b:'0',a:'0'}
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({color:this.getColor(nextProps.selection), selection:nextProps.selection, editStates:nextProps.editStates});
  }

  handleChange = (color) => {
    this.setState({ color: color.rgb })
  };

  handleSliderChange = (alpha) => {
    let color = {...this.state.color}
    color.a = alpha/100;
    this.setState({color:color});
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };



  render(){
    return(
      <div>
        <StyleCard title='Fill'>
          <ColorPicker title='Color' color={this.state.color} handleClick={ this.handleClick }/>
          <SliderCore title='Opacity' step={1} min={0} max={100} value={parseInt(parseFloat(this.state.color.a)*100)} handleOnChange={this.handleSliderChange}/>
          {/* <span className='opacity-text'>{parseInt(parseFloat(this.state.color.a)*100)}%</span> */}
          <TextInput title='' text={parseInt(parseFloat(this.state.color.a)*100)} type='percentage' after="%"/>
        </StyleCard>
        {
          this.state.displayColorPicker
            ?
              <SketchPicker color={ this.state.color } onChange={ this.handleChange }/>
            :
          null
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {selection:state.present.selection,editState:state.present.editState}
}

export default connect(mapStateToProps)(Fill)
