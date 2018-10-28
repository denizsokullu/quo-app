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

export const router = {
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
      backgroundColor:{
        prop:'background',
        translate:commonTranslators.sketch.abstract.color,
      },
      fill:{
        prop:'fill',
        translate: commonTranslators.sketch.abstract.color,
      },
      textString:{
        prop:'textString',
        translate:commonTranslators.id,
      },
      fontColor: {
        prop:'font-color',
        translate: commonTranslators.sketch.abstract.color,
      },
      fontFamily: {
        prop: 'font-family',
        translate: commonTranslators.id,
      },
      fontSize: {
        prop: 'font-size',
        translate:commonTranslators.id,
      }
      //
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
        translate:(v)=>{
          return {
            'fill': `rgb(${v.r},${v.g},${v.b})`,
            'fillOpacity': `${v.a}`
          }
        }
      },
      textString:{
        disallow:true
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
      'font-color': {
        prop:'color',
        translate: commonTranslators.abstract.css.color,
      },
      'font-family': {
        prop: 'font-family',
        translate: (v) => `"${v}", sans-serif`,
      },
      'font-size': {
        prop: 'font-size',
        translate: commonTranslators.abstract.css.int2px,
      }
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
    },
    textProps:{
      textString:{
        prop:'textString',
        translate:commonTranslators.id
      }
    }
  }
}
