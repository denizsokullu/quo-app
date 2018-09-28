//types of sketch components
//rectangle
//oval
//shapeGroup
//group -> contains stuff
//

import _ from 'underscore'
import bplist from 'bplist'

const pathElements = ['triangle','shapePath'];

export class AbstractComponent{
  constructor(data,siblings){

    this.pageName = data.name;
    this.frame = data.frame;
    this.id = data.do_objectID
    this._class = data._class;

    if(data.style){
      this.style = data.style;
    }

    if(siblings){
      //remove the id of the element itself from the siblings
      let siblingSelfIndex = siblings.indexOf(this.id);
      if( siblingSelfIndex > -1){
        siblings.splice(siblingSelfIndex,1);
      }
      this.siblings = siblings;
    }
    else{
      this.siblings = []
    }

    //Define grouping state for the component
    this.isGroupObject = false;

    if(this.isArtboard || this.isGroup){
      this.isGroupObject = true;
    }
    //

    this.interactions = {
      clicked:false
    }

    //assign shape class to those that have children shapeGroups
    if(this._class === 'group' && this.areChildrenAllShapeGroups(data)){
      this._class = 'shape'
    }

    this.initDynamicProperties();

    if(this._class === 'bitmap'){
      this._class = 'image';
      this.imageURL = data.image._ref;
    }

    //check the inner layer element of a shapeGroup to get the type.
    if(this.isShape){
      //shape group

      this.shapeData = data.layers.map((shape)=>{
        let obj = {};

        obj.style = this.generateStyle(shape);
        let outerStyle = this.generateStyle(shape);

        obj.frame = shape.frame;
        //path group
        obj.paths = shape.layers.map((path)=>{
          let innerObj = {};

          innerObj.style = this.generateStyle(path);
          if(outerStyle.fill){
            innerObj.style.fill = outerStyle.fill;
          }
          if(outerStyle.border){
              innerObj.style.border = outerStyle.border;
          }
          innerObj.frame = path.frame;
          innerObj.points = path.points

          let frame = path.frame;

          innerObj.points.map(point =>{
            point.point = this.extractPoints(point.point,frame);
            point.curveFrom = this.extractPoints(point.curveFrom,frame);
            point.curveTo = this.extractPoints(point.curveTo,frame)
          })

          let edges = [];

          innerObj.points.map((point,index) => {
            //close the last edge
            if(index === innerObj.points.length - 1 && index !== 0){
              edges.push({p1:point,p2:innerObj.points[0]});
            }
            //connect a point with the next point
            else{
              edges.push({p1:point,p2:innerObj.points[index+1]});
            }
          })

          innerObj.edges = edges;

          return innerObj;
        })

        if(data.layers[0].style.fills){
          data.style = this.setIfExists(['fills','border','stroke','strokeWidth'],data.layers[0].style, data.style)
        }
        else{
          data.style = this.setIfExists(['fills','border','stroke','strokeWidth'],data.layers[1].style, data.style)
        }

        //the style attributes are located in the child of the svg so we
        //need to provide them to the parent


        //currently haven't thought of a better way for this
        return obj

      });

      this.createCSS(data);

    }

    //Text needs styling too, therefore call the styling in it.
    if(this.isText){
      let rawTextData = data.attributedString;

          this.textData = {}
          //These are constant array slots dedicated for text content & stlying information
          this.textData.text = rawTextData.string;

          //setting it in the dynamicProps

          this.setPropertyOfEditStates('textString',rawTextData.string);

          let attributes = rawTextData.attributes['0'].attributes;
          let colorAttr = attributes.MSAttributedStringColorAttribute
          let fontAttr = attributes.MSAttributedStringFontAttribute

          this.textData.fontSize = fontAttr.attributes.size;
          this.textData.fontName = fontAttr.attributes.name;
          // Add more style options later
          //
          let r = parseInt(parseFloat(colorAttr.red) * 255)
          let g = parseInt(parseFloat(colorAttr.green) * 255)
          let b = parseInt(parseFloat(colorAttr.blue) * 255)
          let a = parseFloat(colorAttr.alpha);
          //
          this.textData.color = {r:r,g:g,b:b,a:a};

      this.createCSS(data);

    }

    else{
      this.createCSS(data);
    }

  }

  setIfExists(properties,src,dest){
    properties.map(property=>{
      if(src[property]) dest[property] = src[property];
    })
    return dest;
  }

  setPropertyOfEditStates(property,val){
    let editStates = ['none','pressed','hover','focused'];
    editStates.map(state=>{
      this.editStates[state][property] = val;
    })
  }

  extractPoints(point,frame){
    return point.replace(/[{}]/g, '').replace(/\s/g, '').split(',').map(parseFloat).map((p,i)=>{
      if(i === 0) return parseFloat(parseFloat((p * frame.width) + frame.x).toFixed(4));
      if(i === 1) return parseFloat(parseFloat((p * frame.height) + frame.y).toFixed(4));
    });
  }

  get isArtboard(){
    return this._class === 'artboard';
  }

  get isGroup(){
    return this._class === 'group';
  }

  get isShape(){
    return this._class === 'shape';
  }

  get isImage(){
    return this._class === 'image';
  }

  get isText(){
    return this._class === 'text';
  }

  areChildrenAllShapeGroups(data){
    return  _.reduce(data.layers,(prev,cur)=>{
        return cur._class === 'shapeGroup' && prev
      },true);
  }

  initDynamicProperties(){
    let dynamicProps;
    if(this.isShape){
      dynamicProps = {
        active:false,
        style:{},
      }
    }
    else if(this.isText){
      dynamicProps = {
        active:false,
        style:{},
        textString:''
      }
    }
    else{
      dynamicProps = {
        active:false,
        style:{},
      }
    }
    this.editStates = {
      current:'none',
      none:{...dynamicProps},
      hover:{...dynamicProps},
      pressed:{...dynamicProps},
      focused:{...dynamicProps},
    }
    //activate the none state as the current styling
    this.swapState('none');
  }

  createCSS(data){
    this.setPropertyOfEditStates('style',this.generateStyle(data));
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

  gerenateTextData(data){

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
        if (this.isShape) {
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
          let points = innerEl.points
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
        if(pathElements.includes(this.shapeType)){
          this.path = data.layers[0].path;
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
