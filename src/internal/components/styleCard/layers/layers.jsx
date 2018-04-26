import React from 'react';
import {connect} from 'react-redux';

//Component Imports
import { LayerCard } from '../styleCard';
import TextInput from '../../inputElements/textInput/textInput';

import CloseIcon from 'material-ui-icons/Close';
import FolderIcon from 'material-ui-icons/Folder';
import FolderOpenIcon from 'material-ui-icons/FolderOpen';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from 'material-ui-icons/KeyboardArrowDown';



class ContentPagesCard extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      pages: [
        'page1',
        'page2',
        'page3'
      ]
    }
  }

  removePage(){

  }

  render(){
    return(
      <LayerCard title='Content Pages'>
        {this.state.pages.map((page)=>{
          return <Page text={page}/>
        })}
      </LayerCard>
    )
  }
}

class LayersCard extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      pages: [
        'page1',
        'page2',
        'page3'
      ]
    }
  }

  removePage(){

  }

  render(){
    return(
      <LayerCard title='Content Pages'>
        {this.state.pages.map((page)=>{
          return <Page text={page}/>
        })}
      </LayerCard>
    )
  }
}

class Page extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text:this.props.text
    }
    this.onChange = this.onChange.bind(this);
  }
  onChange(newText){
    this.setState({text:newText});
  }
  render(){
    return (
      <div className='page-name'>
        <TextInput text={this.props.text} onChange={this.onChange} noTitle />
        <span onClick={this.props.removePage}>
          <CloseIcon/>
        </span>
      </div>
    )
  }



}

class Layers extends React.Component {
  constructor(props){
    super(props);
    //if there are pages, select the layers of it.
    if(props.data){
      this.state = {data:props.data.layers}
    }
    //if there are no pages just keep the data undefined.
    else{
      this.state = {data:props.data}
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data){
      this.setState({data:nextProps.data.layers});
    }
    else{
      this.setState({data:nextProps.data})
    }
  }

  renderLayers(){

    //if there are no pages selected
    if(!this.state.data){
      return null
    }

    //if there are artboards & other shapes
    let artboards = Object.keys(this.state.data);

    return (
      //loop through the artboards & possible other shapes
      artboards.map( (key,index) => {

        let obj = this.state.data[key];
        let isLast = artboards.length == index + 1;

        return (
          <Layer layer={obj} depth={0} isLast={isLast} key={index}/>
        )
    })
    )

  }

  render(){
    return(
      <div className='layers-content'>
        { this.renderLayers() }
      </div>
    )
  }

}

class Layer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      layer:props.layer,
      isHidden:false,
      //change this
      isGroup:props.layer.components ? true : false,
      isLocked:false,
      isMinimized:true
    }
    this.handleMinimizeChange = this.handleMinimizeChange.bind(this);
  }

  handleMinimizeChange(){
    this.setState({isMinimized:!this.state.isMinimized},()=>{
      console.log(this.isMinimized);
    });
  }

  renderLayerStructure(){
    // console.log(this.state.layer,!this.state.isGroup,this.props.isLast)

    let isLast = !this.state.isGroup && this.props.isLast ? 'last-el' : ''
    let isSingle = !this.state.isGroup && this.props.hasSiblingGroup ? 'single-el' : '';

    return(
      <div className='layer'>
        <div className={`main-layer-block ${isLast} ${isSingle}`} tabIndex="0" >

          {/* Depth Padding Element */}
          {this.renderDepthBlocks()}


          {/* Main content for the layer */}

          {
            this.state.isGroup ? this.state.isMinimized ?
              <span className='folder-icon'>
                <FolderIcon/>
              </span>
            :
            <span className='folder-icon'>
              <FolderOpenIcon/>
            </span>
            :
            null
          }

          <TextInput text={this.state.layer.name} onChange={this.onChange} noTitle />

          {/* Minimize Button */}

          { this.state.isGroup ?
            <span className='minimize-icon' onClick={this.handleMinimizeChange}>
              {this.state.isMinimized ?
                <KeyboardArrowRightIcon/>
              :
              <KeyboardArrowDownIcon/>
              }
            </span>
          : null
          }

        </div>
        {
          this.renderChildren()
        }
      </div>
    )
  }

  renderChildren(){

    // If it's the innermost component, ignore the
    // task and return null for it's children.

    if(!this.state.layer.components){
      return null;
    }

    const isLastBool = this.state.isGroup && this.props.isLast
    const isMinimized = this.state.isMinimized ? 'child-minimized' : '';

    const children = this.state.layer.components;
    const childrenKeys = Object.keys(children);

    return(

      <div className={`child-layer-block ${isMinimized}`}>
        {
          childrenKeys.map((key,index) => {

            // To figure out which layer is the last on the window,
            // keep track of this.

            let isLast = (childrenKeys.length == index + 1) && isLastBool;
            let innerLayer = children[key];

            return(
              <Layer layer={innerLayer} depth={this.props.depth+1} isLast={isLast} key={index}/>
            )

          })
        }
      </div>
    )
  }
  renderDepthBlocks(){
    return [...Array(this.props.depth)].map((val,index)=>{
      return (<div className='depth-padding' key={index}></div>)
    })
  }
  render(){
    let isGroup = this.state.isGroup ? 'group-container' : 'single-container'
    return(
      <div className={`${isGroup}`}>
        {
          this.renderLayerStructure()
        }
      </div>
    )
  }


}

function mapStateToProps(state) {
  return {data: state.present.newAssets[state.present.currentPage]}
}

Layers = connect(mapStateToProps)(Layers)
export { Page, Layers }
