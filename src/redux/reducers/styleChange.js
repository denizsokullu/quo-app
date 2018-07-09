import { dc } from '../helpers';

function BOX_SHADOW(state,action){

  let style = getStyle(action.payload.component);

  let bsDelta = action.payload.boxShadow;
  let bsInit = style.boxShadow.split(' ');

  //x
  bsInit[0] = px2int(bsInit[0]);
  //y
  bsInit[1] = px2int(bsInit[1]);
  //blur
  bsInit[2] = px2int(bsInit[2]);
  //spread
  bsInit[3] = px2int(bsInit[3]);
  //color
  bsInit[4] = rgba2arr(bsInit[4])

  let newBS = bsInit.map((val,i)=>{
    if(i === 4){
      return arr2rgba(bsInit[i].map((val,j)=>{return bsDelta[i][j] + bsInit[i][j]}))
    }
    else{
      return int2px(bsInit[i] + bsDelta[i]);
    }
  }).join(' ');

  style = {...style, boxShadow:newBS}

  return style
}

function BG_COLOR(state,action){

  let style = getStyle(action.payload.component);

  let bgColorDelta = action.payload.bgColor;

  let bgColorInit = rgba2arr(style.backgroundColor);

  let newBgColor = arr2rgba(bgColorDelta.map( (val,index) => { return bgColorDelta[index] + bgColorInit[index] }));

  style = {...style, backgroundColor:newBgColor}

  return style
}

function FILL_COLOR(state,action){

  let style = getStyle(action.payload.component);

  let fillColorDelta = action.payload.fillColor;

  let fillColorInit = rgba2arr(style.fill);

  let newFillColor = arr2rgba(fillColorDelta.map( (val,index) => { return fillColorDelta[index] + fillColorInit[index] }));

  style = {...style, fill:newFillColor}

  return style

}

function getStyle(component){
  return component.editStates[component.editStates.current].style
}

function px2int(str){
  return parseInt(str.slice(0,-2))
}

function int2px(int){
  return int + 'px'
}

function rgba2arr(str){
  return str.split('(')[1].split(')')[0].split(',').map((color,i)=>{
    if(i === 3){
      return parseFloat(color)
    }
    else return parseInt(color,10)
  })
}

function arr2rgba(arr){
  return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
}

export { BOX_SHADOW, BG_COLOR, FILL_COLOR };
