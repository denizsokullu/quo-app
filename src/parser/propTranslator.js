import _ from 'lodash';

const commonTranslators = {
  id:(v)=>{return v},
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
       prop:'width',
       translate:commonTranslators.id,
      },
      height:{
        prop:'height',
        translate:commonTranslators.id,
      },
      x:{
        prop:'x',
        translate:commonTranslators.id,
      },
      y:{
        prop:'y',
        translate:commonTranslators.id,
      },
      border:{
       thickness:{
         parent:'border',
         prop:'width',
         translate:commonTranslators.id,
       },
       color:{
         parent:'border',
         prop:'color',
         translate:commonTranslators.sketch.abstract.color,
       },
       radius:{
         parent:'border',
         prop:'radius',
         translate:commonTranslators.id,
       },
       style:{
         parent:'border',
         prop:'style',
         translate:commonTranslators.id,
       }
      },
      rotation:{
        parent:'transform',
        prop:'rotation',
        translate:commonTranslators.id,
      },
      shadow:{
        offsetX:{
          parent:'shadow',
          prop:'offset-x',
          translate:commonTranslators.id,
        },
        offsetY:{
          parent:'shadow',
          prop:'offset-y',
          translate:commonTranslators.id
        },
        blurRadius:{
          parent:'shadow',
          prop:'blur',
          translate:commonTranslators.id,
        },
        spread:{
          parent:'shadow',
          prop:'spread',
          translate:commonTranslators.id,
        },
        color:{
          parent:'shadow',
          prop:'color',
          translate:commonTranslators.sketch.abstract.color,
        },
      },
      fontSize:{
        prop:'font size',
        translate:commonTranslators.id,
      },
      fontFamily:{
        prop:'font family',
        translate:commonTranslators.id,
      },
      color:{
        prop:'font color',
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
      border:{
        prop:'border',
        translate:(v)=>{
          let returnObj = {}
          if(v.thickness && v.color && v.style){
            returnObj['border'] = `${commonTranslators.abstract.css.int2px(v.thickness)} ${v.style} ${commonTranslators.abstract.css.color(v.color)}`
          }
          //add border-radius here later;
          return returnObj
        }
      },
      // 'border-width':{
      //   prop:'border-width',
      //   translate:commonTranslators.abstract.css.int2px,
      // },
      // 'border-color':{
      //   prop:'border-color',
      //   translate:commonTranslators.abstract.css.color,
      // },
      // 'border-style':{
      //   prop:'border-style',
      //   translate:(v)=>{return v},
      // },
      // 'border-radius':{
      //   prop:'border-radius',
      //   translate:(corners) => {
      //     let str = ``;
      //     corners.map(corner=>{
      //       str += commonTranslators.abstract.css.int2px(corner)
      //       str += ` `;
      //     })
      //     return str;
      //   }
      // },
    }
  }
}



const convertProps = (from,to,prop,val) => {

  let path = router[from][to]
  let propObj = {...path};

  //find the property obj by going through the list
  prop.split(' ').map(p=>{
    propObj = propObj[p];
  });

  //if it is a nested value
  if(propObj.parent){
    let newNode = {};
    newNode[propObj.parent] = {}
    newNode[propObj.parent][propObj.prop] = propObj.translate(val);
    return newNode
  }

  //if its alone
  return { [propObj.prop]:propObj.translate(val) }

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
    //if there are inner values corresponding
    let res = router['abstract'][to][prop].translate(val)
    //if it's a single css rule add it alone
    if(typeof res === 'string'){
      allProps[router['abstract'][to][prop].prop] = res;
    }
    //if it's multiple css rules, merge them all
    else{
      _.merge(allProps,router['abstract'][to][prop].translate(val))
    }
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
        addProp('border thickness',eProp.thickness);
        addProp('border color',eProp.color);
        addProp('border style','solid');
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
