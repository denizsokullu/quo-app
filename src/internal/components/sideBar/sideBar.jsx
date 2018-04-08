import React, { Component } from 'react';

import Resizable from 're-resizable';

// Import all the cards

import ComponentStates from '../componentStates/componentStates';

import { ButtonCore } from '../buttons/buttons';

import Fill from '../styleCard/fill/fill';

import Border from '../styleCard/border/border';

import Shadow from '../styleCard/shadow/shadow';

import Blur from '../styleCard/blur/blur';

import Scale from '../styleCard/scale/scale';

import CopyState from '../styleCard/copyState/copyState';

import Movement from '../styleCard/movement/movement';

import MiniPreview from '../miniPreview/miniPreview';


import { ContentPagesCard, LayersCard } from '../styleCard/styleCard';

//Icons for the interaction-nav(right)

import GamesIcon from 'material-ui-icons/Games';
import FlashOnIcon from 'material-ui-icons/FlashOn';
import ColorLensIcon from 'material-ui-icons/ColorLens';

//Icons for the interaction-nav(left)

import LayersIcon from 'material-ui-icons/Layers';
import WebAssetIcon from 'material-ui-icons/WebAsset';
import LinkIcon from 'material-ui-icons/Link';

class SideBarLeft extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected : 'layers',
      icons : {assets:WebAssetIcon, layers:LayersIcon, globalLinks:LinkIcon},
      width:230,
      height:'100%'
    }

    this.onClickNav = this.onClickNav.bind(this);

  }

  onClickNav(e) {
    this.setState({selected:e.currentTarget.id});
  }

  render(){
    return(
      <Resizable
        className='resizable-wrapper'
        enable={{
          top:false,
          right:true,
          bottom:false,
          left:false,
          topRight:false,
          bottomRight:false,
          bottomLeft:false,
          topLeft:false
        }}
        minWidth='150'
        maxWidth='1000'
        size={{ width: this.state.width, height: this.state.height }}
        onResizeStop={(e, direction, ref, d) => {
          this.setState({
            width: this.state.width + d.width,
          },()=>{console.log(this.state.width)});
        }}
        // defaultSize={{
        //   width:'230',
        //   height:'100%',
        // }}
      >
        <div className='sidebar-wrapper sidebar-resizable'>
          <div className={`sidebar-container sidebar-left`}>
            <ContentPagesCard/>
            <LayersCard/>
          </div>
          <div className='interaction-nav left-nav'>
            {
              Object.keys(this.state.icons).map(icon=>{
                let selected = this.state.selected === icon ? 'selected-icon' : '';
                let CurrentIcon = this.state.icons[icon];
                return (
                  <div className={`nav-el ${selected}`} onClick={this.onClickNav} id={icon}>
                    <CurrentIcon/>
                  </div>
                )
              })
            }
          </div>
        </div>
      </Resizable>
      )
  }
}

class SideBarRight extends Component {

  constructor(props) {

    super(props);

    this.state = {
      selected : 'styles',
      options : ['styles','links','interactions'],
      components : {styles:StylesContent, links:LinksContent, interactions:ActionsContent},
      icons : {styles:ColorLensIcon, links:FlashOnIcon, interactions:GamesIcon}
    }

    this.onClickNav = this.onClickNav.bind(this);

  }

  onClickNav(e) {
    this.setState({selected:e.currentTarget.id});
  }

  onClickAddToArr() {
    console.log('Clicked add to arrangement...')
  }

  render() {
    const CurrentComponent = this.state.components[this.state.selected];
    return (
      <div className='sidebar-wrapper'>
        <div className={`sidebar-container sidebar-right`}>
          <ComponentStates/>
          <CurrentComponent/>
          <MiniPreview/>
          <ButtonCore className='add-to-arrangement' title='Add to Arrangement' onClick={this.onClickAddToArr()}/>
        </div>

        <div className = 'interaction-nav right-nav'>
          {
            this.state.options.map(icon=>{
              let selected = this.state.selected === icon ? 'selected-icon' : '';
              let CurrentIcon = this.state.icons[icon];
              return (
                <div className = {`nav-el ${selected}`} onClick={this.onClickNav} id={icon}>
                  <CurrentIcon/>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

class StylesContent extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className='styles-content'>
        <Fill/>
        <Border/>
        <Shadow/>
        <Blur/>
        <Scale/>
        <CopyState/>
        <Movement/>
      </div>
    )
  }
}

class ActionsContent extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className='actions-content'>
        <Shadow/>
        <Blur/>
        <Scale/>
        <CopyState/>
        <Movement/>
      </div>
    )
  }
}

class LinksContent extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className='links-content'>

        <Fill/>
        <Border/>
      </div>
    )
  }
}

export { SideBarLeft, SideBarRight }

// const mapStateToProps = (state, ownProps) => ({
//   geod: state.geod,
// })

// const mapDispatchToProps = {
//   activateGeod,
//   closeGeod,
// };

// const Sidebar = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(SideBarDOM);
