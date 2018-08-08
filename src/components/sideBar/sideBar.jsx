import React, { Component } from 'react';

import Resizable from '../../packages/resizable/resizable';

import { connect } from 'react-redux';

import _ from 'underscore';

// Import all the cards

import ComponentStates from '../componentStates/componentStates';

import { ButtonCore } from '../buttons/buttons';

import Fill from '../styleCard/fill/fill';

import Border from '../styleCard/border/border';

import Shadow from '../styleCard/shadow/shadow';

import Blur from '../styleCard/blur/blur';

import Scale from '../styleCard/scale/scale';

import Position from '../styleCard/position/position';

import Size from '../styleCard/size/size';

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

import { UPDATE_SIDEBAR_TAB, RESIZE_SIDEBAR } from '../../redux/actions';
import { getState } from '../../redux/state';

import AssetsTab from './assets/assets';
import LinksTab from './links';

class StylesContent extends React.Component{
  //the styles content should be aware of what component is selected
  constructor(props){
    super(props);
  }
  renderContent(){
    switch(this.props.selection._class){
      case 'artboard':
        return(
          <React.Fragment>
            <Position/>
            <Size/>
            <Fill/>
          </React.Fragment>
        )
        case 'group':
          return(
            <React.Fragment>
              <Position/>
            </React.Fragment>
          )
        case 'text':
          return(
            <React.Fragment>
              <Position/>
              <Size/>
            </React.Fragment>
          )
        case 'shape':
          return(
            <React.Fragment>
              <Position/>
              <Size/>
              <Fill/>
            </React.Fragment>
          )
        default:
          return(
            <React.Fragment>
              <Position/>
              <Size/>
              <Fill/>
              <Border/>
              <Shadow/>
              <Blur/>
              <Scale/>
              <CopyState/>
              <Movement/>
            </React.Fragment>
          )
    }
  }
  render(){
    return (
      <div className='styles-content'>
        {
          this.renderContent()
        }
      </div>
    )
  }
}

class ActionsContent extends React.Component{
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
  render(){
    return (
      <div className='links-content'>

        <Fill/>
        <Border/>
      </div>
    )
  }
}

class SideBarLeft extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options : props.tabs,
      components : {assets:AssetsTab, layers:AssetsTab, globalLinks:AssetsTab},
      icons : {assets:WebAssetIcon, layers:LayersIcon, globalLinks:LinkIcon },
      width:230,
      height:'100%',
    }

    this.onClickNav = this.onClickNav.bind(this);
    this.dispatchResize = this.dispatchResize.bind(this);

  }

  dispatchResize(width){
    width = parseInt(width.slice(0,-2));
    const { dispatch } = this.props;
    dispatch(RESIZE_SIDEBAR({target:'left', width }));
  }

  onClickNav(e) {
    if(e.currentTarget.id !== this.props.selected){
      const { dispatch } = this.props;
      dispatch(UPDATE_SIDEBAR_TAB({target:'left',selected:e.currentTarget.id}));
    }
  }

  render(){
    const CurrentComponent = this.state.components[this.props.selected];
    return(
      <Resizable height='100%' width={`${this.state.width}px`} minWidth='230' onResize={this.dispatchResize}>
          <div className={`sidebar-container sidebar-left`}>
            <CurrentComponent/>
          </div>
          <div className='interaction-nav left-nav'>
            {
              this.state.options.map((icon,key)=>{
                let selected = this.props.selected === icon ? 'selected-icon' : '';
                let CurrentIcon = this.state.icons[icon];
                return (
                  <div className={`nav-el ${selected}`} onClick={this.onClickNav} id={icon} key={key}>
                    <CurrentIcon/>
                  </div>
                )
              })
            }
          </div>
        {/* </div> */}
      </Resizable>
      )
  }
}

class SideBarRight extends Component {

  constructor(props) {

    super(props);

    this.state = {
      options : props.tabs,
      components : {styles:LinksTab, links:LinksTab, interactions:LinksTab},
      icons : {styles:ColorLensIcon, links:FlashOnIcon, interactions:GamesIcon},
      selectedComponent : props.selection
    }

    this.onClickNav = this.onClickNav.bind(this);

  }

  onClickNav(e) {
    if(e.currentTarget.id !== this.props.selected){
      const { dispatch } = this.props;
      dispatch(UPDATE_SIDEBAR_TAB({target:'right',selected:e.currentTarget.id}));
    }
  }

  onClickAddToArr() {

  }

  // {/* <ComponentStates/> */}
  // {/* <MiniPreview/> */}
  // {/* <ButtonCore className='add-to-arrangement' title='Add to Arrangement' onClick={this.onClickAddToArr}/> */}

  render() {
    const CurrentComponent = this.state.components[this.props.selected];
    return (
      <div className='sidebar-wrapper'>
        <div className={`sidebar-container sidebar-right`}>
            <CurrentComponent/>
        </div>
        <div className='interaction-nav right-nav'>
          {
            this.state.options.map((icon,key)=>{
              let selected = this.props.selected === icon ? 'selected-icon' : '';
              let CurrentIcon = this.state.icons[icon];
              return (
                <div className={`nav-el ${selected}`} onClick={this.onClickNav} id={icon} key={key}>
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

function mapStateToPropsRight(state) {

  let ui = getState(state,'ui');
  return { ...ui.sidebars.right }
}

function mapStateToPropsLeft(state) {
  let ui = getState(state,'ui')
  return { ...ui.sidebars.left }
}

SideBarRight = connect(mapStateToPropsRight)(SideBarRight)
SideBarLeft = connect(mapStateToPropsLeft)(SideBarLeft)

export { SideBarLeft, SideBarRight }
