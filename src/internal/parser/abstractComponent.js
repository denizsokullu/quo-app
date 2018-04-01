//types of sketch components
//rectangle
//oval
//shapeGroup
//group -> contains stuff
//
//
import _ from 'underscore'

const pathElements = ['triangle','shapePath'];

export default class AbstractComponent{
  constructor(data){

    this.pageName = data.name;
    this.frame = data.frame;
    this.id = data.do_objectID
    this._class = data._class;
    this.layers = [];
    this.style = data.style;
    this.css = this.generateStyle(data);
    this.editStates = {
      current:'none',
      none:{
        active:true,
        style:this.css,
      },
      hover:{
        active:false,
        style:this.css,
      },
      pressed:{
        active:false,
        style:this.css,
      },
      focused:{
        active:false,
        style:this.css,
      }
    }
    console.log(data)
    console.log(this.css)

    //check the inner layer element of a shapeGroup to get the type.
    if(this._class == 'shapeGroup'){
      if(data.layers.length > 0){
        this.shapeType = data.layers[0]._class;
        // console.log(data.layers[0]);
        if(pathElements.includes(this.shapeType)){
          this.path = data.layers[0].path;
          // console.log(this.path);
        }
      }
    }
    if(this._class == 'text'){
      this.textData = data.attributedString.archivedAttributedString._archive;
    }
    //store these as objects tbh!
    if(data.layers){
      data.layers.map(layer=>{
        // if (!pathElements.includes(layer._class)){
          this.layers.push(new AbstractComponent(layer))
        // }
      })
    }
    //and also have a flattened version at all times?
  }

  swapState(target){
    this.editStates[this.editStates.current].active = false;
    this.editStates.current = target;
    this.editStates[target].active = true;
    this.css = this.editStates[target].style;
  }

  generateColor(color){
    let r = parseInt(color.red * 255)
    let g = parseInt(color.green * 255)
    let b = parseInt(color.blue * 255)
    let a = parseInt(color.alpha * 255)
    return `rgba(${r},${g},${b},${a})`
  }

  generateStyle(data){
    let frame = data.frame
    let position = {
      width: `${frame.width}px`,
      height: `${frame.height}px`,
    };
    //add padding for the stroke-width
    if (data.path && data.style) {
      console.log(data)
      const thickness = data.style.borders
        ? data.style.borders[0].thickness
        : 0;
      const padding = thickness / 2;
      position = {
        width: `${frame.width + padding}px`,
        height: `${frame.height + padding}px`,
        paddingLeft: `${padding}px`,
        paddingTop: `${padding}px`
      };
    }
    let styles = {};
    if (data.style) {
      let style = data.style
      //currently picks the first fill
      let fill = {}
      if (style.fills) {
        let color = style.fills[0].color
        let colorCSS = this.generateColor(color);
        if (data.path) {
          fill.fill = colorCSS;
        } else {
          fill.backgroundColor = colorCSS;
        }
      }
      let border = {}
      if (style.borders && style.borders[0].isEnabled) {
        let color = style.borders[0].color
        let colorCSS = this.generateColor(color);
        //apply svg styling
        if (data.path) {
          border.stroke = colorCSS
          border.strokeWidth = `${style.borders[0].thickness}px`;
        } else {
          let color = colorCSS
          let thickness = `${style.borders[0].thickness}px`;
          border.border = `${thickness} solid ${color}`;
        }
      }
      //oval styling
      let borderRadius = {}
      //border radius on rectangles
      if(data._class === 'shapeGroup'){
        let innerEl = data.layers[0];
        if (innerEl._class === 'rectangle'){
          let points = innerEl.path.points
          borderRadius = {
            borderRadius: `${points[0].cornerRadius}px ${points[1].cornerRadius}px ${points[2].cornerRadius}px ${points[3].cornerRadius}px`
          }
        }
        else if(innerEl._class === 'oval'){
          borderRadius = {
            borderRadius: `50%`
          }
        }
      }
      //rotation
      let transform = {}
      if(data.rotation){
        transform = { transform: `rotate(${-data.rotation}deg)`}
      }

      let boxShadow = {}
      if(style.shadows && style.shadows[0].isEnabled){
        let shadow = style.shadows[0];
        let color = style.shadows[0].color;
        let colorCSS = this.generateColor(color);
        boxShadow = {boxShadow:`${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spread}px ${colorCSS}`}
      }

      styles = Object.assign({},
                            fill,
                            borderRadius,
                            border,
                            transform,
                            boxShadow);
    }
    return ({
        ...position,
        ...styles
      })

  }
  getComponent(id){
    if(this.id === id){
      return this;
    }
    else{
      let results = this.layers.map(component=>{
        return component.getComponent(id);
      })
      return _.reduce(results,(objects,obj)=>{return (typeof obj === 'object' ? obj : objects)},undefined);
    }
  }
}
