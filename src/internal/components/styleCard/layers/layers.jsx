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
    this.state = {data:props.data};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data:nextProps.data})
  }

  renderLayers(){
    if(Object.keys(this.state.data).length > 0){
      return (
      Object.keys(this.state.data).map(key=>{
        let obj = this.state.data[key];
        return(
          obj.layers.map((layer,index)=>{
          let isLast = obj.layers.length == index + 1;
          return(
            <Layer layer={layer} depth={0} isLast={isLast} key={index}/>
            )
          })
        )
      })
      )
    }
    else{
      return null
    }


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
      isGroup:props.layer.layers ? true : false,
      isLocked:false,
      isMinimized:false
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

          <TextInput text={this.state.layer.pageName} onChange={this.onChange} noTitle />

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
    const isLastBool = this.state.isGroup && this.props.isLast
    const isMinimized = this.state.isMinimized ? 'child-minimized' : ''
    // console.log(isLastBool);
    return(
        this.state.layer.layers
        ?
          <div className={`child-layer-block ${isMinimized}`}>
            {
              this.state.layer.layers.map((innerLayer,index) => {

                let isLast = (this.state.layer.layers.length == index + 1) && isLastBool;

                return(
                  <Layer layer={innerLayer} depth={this.props.depth+1} isLast={isLast} key={index}/>
                )

              })
            }
          </div>
        :
          null

    )
  }
  renderDepthBlocks(){
    return [...Array(this.props.depth)].map(()=>{
      return (<div className='depth-padding'></div>)
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
  return {data: state.present.assets.data}
}

Layers = connect(mapStateToProps)(Layers)
export { Page, Layers }
