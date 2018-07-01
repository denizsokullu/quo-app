//types of sketch components
//rectangle
//oval
//shapeGroup
//group -> contains stuff
//

import _ from 'underscore'
import bplist from 'bplist'

const pathElements = ['triangle','shapePath'];

export class AbstractComponentSimple{
  constructor(data){

    this.pageName = data.name;
    this.frame = data.frame;
    this.id = data.do_objectID
    this._class = data._class;

    if(data.style){
      this.style = data.style;
    }


    //Define grouping state for the component
    this.isGroupObject = false;
    if(this.isArtboard || this.isGroup){
      this.isGroupObject = true;
    }

    this.interactions = {
      clicked:false
    }

    //check the inner layer element of a shapeGroup to get the type.
    if(this.isShape){
      if(data.layers.length > 0){
        this.shapeType = data.layers[0]._class;
        // console.log(data.layers[0]);
        if(pathElements.includes(this.shapeType)){
          this.path = data.layers[0].path;
          // console.log(this.path);
        }
      }
    }

    //Text needs styling too, therefore call the styling in it.
    if(this.isText){
      this.textData = data.attributedString.archivedAttributedString._archive;
      bplist.parseBuffer(Buffer.from(this.textData, 'base64'), (err, result) => {
        if (!err){
          let data = result[0].$objects;
          this.textData = {}
          //These are constant array slots dedicated for text content & stlying information
          this.textData.text = data[2];
          this.textData.fontSize = data[16];
          this.textData.fontName = data[17];
          let mapping = data[20];

          let rLoc = mapping['NS.objects'][0];
          let aLoc = mapping['NS.objects'][1];
          let bLoc = mapping['NS.objects'][2];
          let gLoc = mapping['NS.objects'][3];

          let r = parseInt(data[rLoc] * 255)
          let g = parseInt(data[gLoc] * 255)
          let b = parseInt(data[bLoc] * 255)
          let a = parseFloat(data[aLoc].toFixed(3));

          this.textData.color = {r:r,g:g,b:b,a:a};

        }
      this.createCSS(data);
      });
    }

    else{
      this.createCSS(data);
    }

    //store these as objects tbh!
    // if(data.layers){
    //   data.layers.map(layer=>{
    //     // if (!pathElements.includes(layer._class)){
    //       this.layers.push(new AbstractComponent(layer))
    //     // }
    //   })
    // }
    //and also have a flattened version at all times?

  }

  get isArtboard(){
    return this._class === 'artboard';
  }

  get isGroup(){
    return this._class === 'group';
  }

  get isShape(){
    return this._class === 'shapeGroup';
  }

  get isText(){
    return this._class === 'text';
  }

  createCSS(data){
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
    let a = color.alpha
    return `rgba(${r},${g},${b},${a})`
  }

  generateStyle(data){
    let frame = data.frame
    let position = {
      width: `${frame.width}px`,
      height: `${frame.height}px`,
      left: `${frame.x}px`,
      top: `${frame.y}px`,
    };
    //add padding for the stroke-width
    if (data.path && data.style) {
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

      ///////////
      // FILL
      ///////////

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

      //case for the artboard
      if(this.isArtboard && data.backgroundColor){
        let colorCSS = this.generateColor(data.backgroundColor);
        fill.backgroundColor = colorCSS;
      }

      ///////////
      // BORDER
      ///////////

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

      ///////////
      // BORDER RADIUS
      ///////////

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

      ///////////
      // TRANSFORM
      ///////////

      let transform = {}
      if(data.rotation){
        transform = { transform: `rotate(${-data.rotation}deg)`}
      }

      ///////////
      // BOX SHADOW
      ///////////

      let boxShadow = {}
      if(style.shadows && style.shadows[0].isEnabled){
        let shadow = style.shadows[0];
        let color = style.shadows[0].color;
        let colorCSS = this.generateColor(color);
        boxShadow = {boxShadow:`${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spread}px ${colorCSS}`}
      }

      ///////////
      // TEXT STYLING
      ///////////

      //Text styling
      let fontStyling = {}
      if(this._class === 'text'){
        fontStyling.fontSize = this.textData.fontSize
        fontStyling.fontFamily = `'${this.textData.fontName}',sans-serif`;
        let c = this.textData.color;
        console.log(c);
        fontStyling.color = `rgba{${c.r},${c.g},${c.b},${c.a}}`;
      }

      ///////////
      // MERGE STYLES
      ///////////

      styles = Object.assign({},
                            fill,
                            borderRadius,
                            border,
                            transform,
                            boxShadow,
                            fontStyling);
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
      return _.reduce(results,(objects,obj)=>{return (typeof obj === 'object' ? obj : objects)}, undefined);
    }
  }
}

export class AbstractComponent{
  constructor(data){

    this.pageName = data.name;
    this.frame = data.frame;
    this.id = data.do_objectID
    this._class = data._class;
    this.layers = [];
    if(data.style){
      this.style = data.style;
    }

    //check the inner layer element of a shapeGroup to get the type.
    if(this._class === 'shapeGroup'){
      if(data.layers.length > 0){
        this.shapeType = data.layers[0]._class;
        // console.log(data.layers[0]);
        if(pathElements.includes(this.shapeType)){
          this.path = data.layers[0].path;
          // console.log(this.path);
        }
      }
    }
    //Text needs styling too, therefore call the styling in it.
    if(this._class === 'text'){
      this.textData = data.attributedString.archivedAttributedString._archive;
      bplist.parseBuffer(Buffer.from(this.textData, 'base64'), (err, result) => {
        if (!err){
          let data = result[0].$objects;
          this.textData = {}
          //These are constant array slots dedicated for text content & stlying information
          this.textData.text = data[2];
          this.textData.fontSize = data[16];
          this.textData.fontName = data[17];

          let mapping = data[20];

          let rLoc = mapping['NS.objects'][0];
          let aLoc = mapping['NS.objects'][1];
          let bLoc = mapping['NS.objects'][2];
          let gLoc = mapping['NS.objects'][3];

          let r = parseInt(data[rLoc] * 255)
          let g = parseInt(data[gLoc] * 255)
          let b = parseInt(data[bLoc] * 255)
          let a = parseFloat(data[aLoc].toFixed(3));

          this.textData.color = {r:r,g:g,b:b,a:a};
        }
      this.createCSS(data);
      });
    }
    else{
      this.createCSS(data);
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

  createCSS(data){
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
    let a = color.alpha
    return `rgba(${r},${g},${b},${a})`
  }

  generateStyle(data){
    let frame = data.frame
    let position = {
      width: `${frame.width}px`,
      height: `${frame.height}px`,
      left: `${frame.x}px`,
      top: `${frame.y}px`,
    };
    //add padding for the stroke-width
    if (data.path && data.style) {
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

      //Text styling
      let fontStyling = {}
      if(this._class === 'text'){
        fontStyling.fontSize = this.textData.fontSize
        fontStyling.fontFamily = `'${this.textData.fontName}',sans-serif`;
        let c = this.textData.color;
        fontStyling.color = `rgba{${c.r},${c.g},${c.b},${c.a}}`;
      }

      styles = Object.assign({},
                            fill,
                            borderRadius,
                            border,
                            transform,
                            boxShadow,
                            fontStyling);
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

export function getComponent(component,id){
  if(component.id === id){
    return component
  }
  else{
    let results = component.layers.map(innerComponent => {
      return getComponent(innerComponent,id);
    })
    return _.reduce(results,(objects,obj)=>{return (typeof obj === 'object' ? obj : objects)},undefined);
  }
}
