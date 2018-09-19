import React from 'react';
import CoreComponent from './CoreComponent';
import { translatePropData } from '../../../parser/propTranslator';

class ShapeComponent extends CoreComponent{

  constructor(props){
    super(props);
    this.code = [];
  }
  getTheLastPathAdded(){
    return this.code[this.code.length - 1];
  }
  createNewPath(){
    this.code.push('');
  }
  addToPath(str){
    this.code[this.code.length-1] += str;
  }
  isLine(edge){
    return !edge.p1.hasCurveFrom && !edge.p2.hasCurveTo
  }
  isCurve(edge){
    return edge.p1.hasCurveFrom || edge.p2.hasCurveTo
  }
  isSmoothCurve(edge){
    return edge.p2.curveMode === 2
  }
  getControlPoints(edge,frame){
    return [edge.p1.curveFrom,edge.p2.curveTo];
  }

  convertPoint(point,frame){
    let newPoint = {...point}
    newPoint.point = this.extractPoints(point.point,frame)
    newPoint.curveFrom = this.extractPoints(point.curveFrom,frame)
    newPoint.curveTo = this.extractPoints(point.curveTo,frame)
    return newPoint
  }

  createPointTuples(points,frame,isClosed){
    let pointTuples = [];
    points.map((point,index)=>{
      //Edge case for non closed shapes
      if(index === points.length - 1 && !isClosed){
        return;
      }

      let edge = {}
      edge.p1 = this.convertPoint(point,frame)

      //last point wraps around
      if(index === points.length - 1){
        edge.p2 = this.convertPoint(points[0],frame);
      }

      else{
        edge.p2 = this.convertPoint(points[index+1],frame)
      }

      pointTuples.push(edge);

    })
    return pointTuples;
  }
  createPathCode(data){

    let frame = data.frame
    let pointTuples = this.createPointTuples(data.points,data.frame,data.isClosed)
    let edges = [];

    pointTuples.map((edge,i) => {

      //create a starting point
      if(i == 0){
        //add M
        this.addToPath(this.createM(edge.p1.point));
      }

      //add a curve
      if(this.isCurve(edge)){
        let controlPoints = this.getControlPoints(edge);
        let endPoint = edge.p2.point
        this.addToPath(this.createC(controlPoints[0],controlPoints[1],endPoint));
        //if the second point is a mirrored bezier curve
        //add an s-curve
        if(this.isSmoothCurve(edge)){
          this.addToPath(this.createS(controlPoints[1],endPoint));
        }
      }

      //add a line
      else if(this.isLine(edge)){
        this.addToPath(this.createL(edge.p2.point));
      }

      //add a Z to close off
      if(i === pointTuples.length - 1){
        this.addToPath(this.createZ());
      }

    });

  }

  extractPoints(point,frame){
    return point.replace(/[{}]/g, '').replace(/\s/g, '').split(',').map(parseFloat).map((p,i)=>{
      if(i === 0) return parseFloat(parseFloat((p * frame.width) + frame.x).toFixed(4));
      if(i === 1) return parseFloat(parseFloat((p * frame.height) + frame.y).toFixed(4));
    });
  }

  p2s(points){
    return `${points[0]} ${points[1]}`;
  }
  createM(points){
    return `M ${this.p2s(points)} `
  }
  createL(points){
    return `L ${this.p2s(points)} `
  }
  createC(curveFrom,curveTo,points){
    return `C ${this.p2s(curveFrom)} ${this.p2s(curveTo)} ${this.p2s(points)} `
  }
  createS(curveFrom,endPoint){
    return `S ${this.p2s(curveFrom)} ${this.p2s(endPoint)} `
  }
  createZ(){
    return 'Z '
  }
  calculatePath(shape,index){
    this.createNewPath();
    this.createPathCode(shape);
    return this.getTheLastPathAdded();
  }

  getCurrentProps(obj){
    return obj.state.states[obj.state.current].props
  }

  getDimensionsCSS(props){
    return translatePropData('abstract','css',{height:props.height,width:props.width});
  }

  getStyleCSS(props){
    return translatePropData('abstract','css',{fill:props.fill});
  }

  render(){
    const props = this.getCurrentProps(this.props.component);

    const style = this.getStyleCSS(props);
    const dimensions = this.getDimensionsCSS(props);

    const paths = this.props.component.layers.map((s,i)=> this.calculatePath(s,i)).join('');

    return(
      <svg style={{position:'absolute',...dimensions,...style}}>
        <path d={paths}/>
      </svg>
    )
  }
}

export default ShapeComponent
