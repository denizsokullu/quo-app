import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { getState } from 'quo-redux/state';
import { LayerCard } from '../../styleCard/styleCard';
import _ from 'lodash';

import HorizontalOptionGroup from 'ui-components/inputElements/horizontalOptionGroup';
import actions from 'quo-redux/actions';

import { SnapshotContainer, convertSnapshotToImage } from 'ui-components/snapshotComponent';

class AssetsTab extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentTab:'static',
      filetype:'sketch',
    }
    this.updateTab = this.updateTab.bind(this)
  }

  updateTab(newTab){
    this.setState({currentTab:newTab})
  }

  render(){
    return (
      <div className='assets-tab-wrapper'>
        <HorizontalOptionGroup
          options={
            [
              {text:'Static',callback:()=>{this.updateTab('static')}},
              {text:'Reactive',callback:()=>{this.updateTab('reactive')}}
            ]
          }
        />
        {
          this.state.currentTab === 'static'
          ?
          <AssetsViewer assets={this.props.assets[this.state.filetype]} components={this.props.components}/>
          :
          null
        }
      </div>
    )
  }
}

class AssetsViewer extends Component {
  constructor(props){
    super(props);
    let pages = this.assignPages(props.assets);
    let selected = undefined;
    if(pages.length > 0){
      selected = pages[0];
    }
    this.state = {
      pages:pages,
      selected:selected,
    }
    this.onPageChange = this.onPageChange.bind(this);
  }

  assignPages(pages){
    return Object.keys(pages).map( page =>{
      return { id:pages[page].id, name:pages[page].name }
    })
  }

  componentWillReceiveProps(nextProps){
    if(!_.isEmpty(nextProps.assets)){
      let pages = this.assignPages(nextProps.assets);
      if(!this.state.selected) this.setState({selected:pages[0]})
      this.setState({pages:pages})
    }
  }

  onPageChange(page){
    this.setState({selected:page});
  }

  renderFirstDepthComponents(){

    if(!this.state.selected){
      return(
        <div className='no-assets'>
          No assets found
        </div>
      )
    }

    //find all the artboards
    let allArtboards = [];

    _.mapValues(this.props.assets,(pages) => {
     allArtboards =  _.union(allArtboards, pages.children);
    })

    let artboardIDs = this.props.assets[this.state.selected.id].children;

    
    //search all the first depth components

    let firstDepthComponents = artboardIDs.map( artboardID =>{
      //get the children of the artboard;
      let components = this.props.assets[this.state.selected.id].components
      let artboard = components[artboardID];
      return artboard.children.map( childID => {
        return components[childID]
      })
    })

    let flattenedfirstDepthComponents = [];

    firstDepthComponents.map(components => {
      components.map(component => {
        flattenedfirstDepthComponents.push(component);
      })
    })

    firstDepthComponents = flattenedfirstDepthComponents;

    return (
      <div className='asset-preview-table'>
        {
          Object.keys(firstDepthComponents).map((o,i)=>{
            let component = firstDepthComponents[o]
            return <AssetPreview key={i} component={component} page={this.state.selected.id} filetype='sketch' source='assets' title={`${component.name}`}/>
          })
        }
      </div>
    )
  }

  render(){
    return (
      <div className='assets-library-wrapper'>
        <div className='card-header'>
          Sketch Pages
        </div>
        <div className='card-body'>
          {
            this.state.pages.map((page,i)=>{
              return(
                <div className={`page ${page.id === this.state.selected.id ? 'selected' : ''}`} key={i} onClick={()=>{this.onPageChange(page)}}>{page.name}</div>
              )
            })
          }
        </div>
        <div className='assets-preview-wrapper'>
          {
            this.renderFirstDepthComponents()
          }
        </div>
      </div>
    )
  }
}

class AssetPreview extends Component {
  constructor(props){
    super(props);
    this.state = {
      draggable: false,
      dragImage: null,
      dragImageNode: null,
    }
  }
  addAssetToEditor = () => {
    const { dispatch } = this.props;
    dispatch(actions.ADD_COMPONENT({source:this.props.source,
                            filetype:this.props.filetype,
                            page:this.props.page,
                            component:this.props.component}));
  }

  onRender = (image) => {
    this.setState({dragImage:image})
  }

  onDragStart = (e) => {

    let img = new Image();

    this.setState({
      draggable:true,
      dragImageNode: img,
    });

    img.src = this.state.dragImage;
    document.body.appendChild(img);
    e.dataTransfer.setData("text/plain", this.props.component.id);
    e.dataTransfer.setDragImage(img, 0, 0);
    return false
  }

  onDragEnd = () => {
    this.setState({draggable:false});
    if(this.state.dragImageNode) this.state.dragImageNode.remove();
  }

  render = () => {
    let source = {
      location: this.props.source,
      filetype: this.props.filetype,
      page: this.props.page,
    }

    return (
      <div className={`asset-preview-wrapper ${this.props.filetype}-asset`} onDoubleClick={this.addAssetToEditor}>
        <div className='asset-preview-title'>
          {this.props.title}
        </div>
        <div 
          className={`asset-preview-image ${this.state.draggable ? 'draggable' : ''}`}
          draggable
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          <SnapshotContainer source={source} component={this.props.component} onRender={this.onRender} />
        </div>
      </div>
    )
  }
}

AssetPreview = connect()(AssetPreview)

const mapStateToProps = (state) => {
  return {
    assets:state.domain.assets,
    components:state.domain.components
  }
}

export default connect(mapStateToProps)(AssetsTab);
