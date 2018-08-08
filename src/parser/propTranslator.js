import _ from 'lodash';

const commonTranslators = {
  sketch:{
    abstract:{
      color:(o)=>{ return {
        a:o.alpha,
        r:parseInt(o.red * 255),
        g:parseInt(o.green * 255),
        b:parseInt(o.blue * 255),
      }}
    },
  },
  abstract:{
    css:{
      int2px:(v)=>{
        return v + 'px';
      },
      color:(o)=>{
        return `rgba(${o.r},${o.g},${o.b},${o.a})`;
      }
    },
  }
}

const router = {
  sketch:{
    abstract:{
      width:{
       prop: 'width',
       translate: (v) => { return v },
      },
      height:{
        prop:'height',
        translate:(v) => { return v },
      },
      x:{
        prop:'x',
        translate:(v) => { return v },
      },
      y:{
        prop:'y',
        translate:(v) => { return v },
      },
      border:{
       thickness:{
         prop:'border-width',
         translate:(v) => { return v },
       },
       color:{
         prop:'border-color',
         translate:commonTranslators.sketch.abstract.color,
       },
       radius:{
         prop:'border-radius',
         translate:(v) => { return v },
       },
       style:{
         prop:'border-style',
         translate:(v) => { return v},
       }
      },
      rotation:{
        prop:'transform-rotation',
        translate:(v) => { return v },
      },
      // shadow:{
      //   offsetX:{
      //     prop:'shadow-offset-x',
      //     translate:(v) => { return v },
      //   },
      //   offsetY:{
      //     prop:'shadow-offset-y',
      //     translate:(v) => { return v }
      //   },
      //   blurRadius:{
      //     prop:'shadow-blur',
      //     translate:(v) => { return v },
      //   },
      //   spread:{
      //     prop:'shadow-spread',
      //     translate:(v) => { return v },
      //   },
      //   color:{
      //     prop:'shadow-color',
      //     translate:(v) => { return v },
      //   },
      // },
      fontSize:{
        prop:'font-size',
        translate:(v) => { return v },
      },
      fontFamily:{
        prop:'font-family',
        translate:(v) => { return v },
      },
      color:{
        prop:'font-color',
        translate:commonTranslators.sketch.abstract.color,
      },
      backgroundColor:{
        prop:'background',
        translate:commonTranslators.sketch.abstract.color,
      },
      fill:{
        prop:'fill',
        translate:commonTranslators.sketch.abstract.color,
      },
    }
  },
  //this is reversed as the CSS needs the final prop first
  abstract:{
    css:{
      'width':{
       prop: 'width',
       translate: commonTranslators.abstract.css.int2px,
      },
      'height':{
        prop:'height',
        translate:commonTranslators.abstract.css.int2px,
      },
      'x':{
        prop:'left',
        translate:commonTranslators.abstract.css.int2px,
      },
      'y':{
        prop:'top',
        translate:commonTranslators.abstract.css.int2px,
      },
      fill:{
        prop:'fill',
        translate:commonTranslators.abstract.css.color
      },
      'border-width':{
        prop:'border-width',
        translate:commonTranslators.abstract.css.int2px,
      },
      'border-color':{
        prop:'border-color',
        translate:commonTranslators.abstract.css.color,
      },
      'border-style':{
        prop:'border-style',
        translate:(v)=>{return v},
      },
      'border-radius':{
        prop:'border-radius',
        translate:(corners) => {
          let str = ``;
          corners.map(corner=>{
            str += commonTranslators.abstract.css.int2px(corner)
            str += ` `;
          })
          return str;
        }
      },
    }
  }
}

const convertProps = (from,to,prop,val) => {
  if(typeof prop === 'string'){
    return {[router[from][to][prop].prop]:
            router[from][to][prop].translate(val)}
  }
  else if(Array.isArray(prop)){
    let props = router[from][to];
    prop.map(p=>{
      props = props[p];
    });
    return {[props.prop]:props.translate(val)}
  }
}

const pickEnabledProp = (props) => {
  let results = props.filter((prop)=>{return prop.isEnabled})
  if(results.length === 1){
    return results[0]
  }
  return undefined
}

const translateAbstractData = (to,data) => {
  let allProps = {};
  _.forEach(data,(val,prop)=>{
    allProps[router['abstract'][to][prop].prop] = router['abstract'][to][prop].translate(val)
  })
  return allProps;
}

const translateSketchData = (to,data) => {
  let allProps = {};
  const addProp = (prop,val) => {
    _.merge(allProps,convertProps('sketch',to,prop,val));
  }
  if(data.frame){
    let f = data.frame;
    addProp('height',f.height);
    addProp('width',f.width);
    addProp('x',f.x);
    addProp('y',f.y);
  }
  if(data.style){
    let s = data.style;
    if(s.borders){
      let eProp = pickEnabledProp(s.borders);
      if(eProp){
        addProp(['border','thickness'],eProp.thickness);
        addProp(['border','color'],eProp.color);
        addProp(['border','style'],'solid');
      }
    }
    if(s.fills){
      let eProp = pickEnabledProp(s.fills);
      if(eProp){
        addProp('fill',eProp.color)
      }
    }
    //continue this
  }

  //add border radius for rectangular shapes
  //the border also exists for non-rectangular shapes
  //come back to this later

  // if(data.points && data.points.length === 4){
  //   let points = data.points;
  //   let cornerRadii = points.map((p)=>{return p.cornerRadius})
  // }

  return allProps
}


export const translatePropData = (from,to,data) => {
  switch(from){
    case 'sketch':
      return translateSketchData(to,data);
    case 'abstract':
      return translateAbstractData(to,data);
    default:
      return {}
  }
}
