import React from 'react';
import CoreComponent from './CoreComponent';
import { translatePropData } from '../../../parser/propTranslator';

class ShapeComponent extends CoreComponent{

  getCurrentProps(obj){
    return obj.state.states[obj.state.current].props
  }

  getDimensionsCSS(props){
    return translatePropData('abstract','css',{height:props.height,width:props.width});
  }

  getStyleCSS(props){
    return translatePropData('abstract','css',{fill: props.fill});
  }

  render(){

    const props = this.getCurrentProps(this.props.component);
    const style = this.getStyleCSS(props);
    const dimensions = this.getDimensionsCSS(props);

    return(
      <svg style={{position:'absolute',...dimensions,...style}}>
        <path d={this.props.component.pathData}/>
      </svg>
    )
  }
}

export default ShapeComponent
