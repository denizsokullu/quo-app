import React from 'react';
import { StyleCard } from '../styleCard';
import SliderCore from '../../inputElements/slider/sliderCore';
import TextInput from '../../inputElements/textInput/textInput';
import ColorPicker from '../../inputElements/colorPicker';
import { SketchPicker } from 'react-color';
import {connect} from 'react-redux';

import { COMPONENT_STYLE_CHANGE } from '../../../redux/actions';


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
    if(selection.editStates){
      let propertyName = selection._class === 'shape' ? 'fill' : 'backgroundColor';
      let color = (selection.editStates[selection.editStates.current]
                  .style[propertyName]
                  .split('(')[1].split(')')[0].split(',')
                  .map((color,i)=>{
        if(i === 3){
          return parseFloat(color)
        }
        return parseInt(color,10)
      }))

      return {
        r:parseInt(color[0],10),
        g:parseInt(color[1],10),
        b:parseInt(color[2],10),
        a:color[3],
      }
    }
    else{
      return {r:'0',g:'0',b:'0',a:'0'}
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({color:this.getColor(nextProps.selection), selection:nextProps.selection, editStates:nextProps.editStates});
  }

  handleChange = (color) => {

    const { dispatch } = this.props
    let c = this.state.color
    let colorArr = [color.rgb.r - c.r ,color.rgb.g - c.g, color.rgb.b - c.b ,0]
    this.setState({ color: color.rgb })
    this.dispatchEvent(colorArr);

  };

  dispatchEvent(colorArr){
    const { dispatch } = this.props
    if(this.state.selection._class === 'shape'){
      dispatch(COMPONENT_STYLE_CHANGE('FILL_COLOR',{fillColor:colorArr,id:this.state.selection.id}))
    }
    else{
      dispatch(COMPONENT_STYLE_CHANGE('BG_COLOR',{bgColor:colorArr,id:this.state.selection.id}))
    }
  }

  handleSliderChange = (alpha) => {

    const { dispatch } = this.props
    let colorArr = [0,0,0, alpha / 100  - this.state.color.a ]

    this.dispatchEvent(colorArr);

    let color = {...this.state.color}
    color.a = alpha / 100;

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
          <SliderCore title='Opacity' step={1} min={0} max={100} value={parseInt(this.state.color.a*100,10)} handleOnChange={this.handleSliderChange}/>
          {/* <span className='opacity-text'>{parseInt(parseFloat(this.state.color.a)*100)}%</span> */}
          <TextInput title='' text={parseInt(parseFloat(this.state.color.a)*100,10)} type='percentage' after="%"/>
        </StyleCard>
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

function mapStateToProps(state) {

  let component = state.present.newAssets[state.present.currentPage].components[state.present.newSelection]

  return { selection:component, editState:state.present.editState}
}

export default connect(mapStateToProps)(Fill)
