import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { getState } from 'quo-redux/state';
import { LayerCard } from '../../styleCard/styleCard';
import _ from 'lodash';

import HorizontalOptionGroup from '../../inputElements/horizontalOptionGroup';
import actions from '../../../redux/actions';

import SnapshotComponent, { convertSnapshot, computeRatio } from 'ui-components/viewer/SnapshotComponent';

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
    //find all the artboards
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
        !_.isEmpty(firstDepthComponents) ?
          <div className='asset-preview-table'>
            {
              Object.keys(firstDepthComponents).map((o,i)=>{
                let component = firstDepthComponents[o]
                return <AssetPreview key={i} component={component} page={this.state.selected.id} filetype='sketch' source='assets' title={`${component.name}`}/>
              })
            }
          </div>
        :
         <div className='no-assets'>
           Drop your assets here
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
            this.state.selected ? this.renderFirstDepthComponents() : null
          }
        </div>
      </div>
    )
  }
}

class AssetPreview extends Component {
  constructor(props){
    super(props);
    this.addAssetToEditor = this.addAssetToEditor.bind(this);
    console.log(this.props.component);
    this.state = {}
  }
  addAssetToEditor(){
    const { dispatch } = this.props;
    dispatch(actions.ADD_COMPONENT({source:this.props.source,
                            filetype:this.props.filetype,
                            page:this.props.page,
                            component:this.props.component}));
  }
  componentDidMount(){
    let preview = ReactDOM.findDOMNode(this);
    let container = preview.querySelector('.asset-preview-image')
    let containerDimensions = container.getBoundingClientRect();

    let cDimensions = {
      w: containerDimensions.width,
      h: containerDimensions.height
    }

    let snapshot = document.getElementById(`snapshot-${this.props.component.id}`);

    let eDimensions = {
      w: this.props.component.state.states.composite.props.width,
      h: this.props.component.state.states.composite.props.height
    } 

    let suitableDimensions = computeRatio(eDimensions, cDimensions);

    let ratio = suitableDimensions.w / eDimensions.w;

    if(ratio > 1) ratio = 1;

    // let targetWidth = Math.min(suitableDimensions.w,eDimensions.w);
    // let targetHeight = Math.min(suitableDimensions.h,eDimensions.h);
    let targetDimensions = suitableDimensions;

    if( eDimensions.w < cDimensions.w && eDimensions.h < cDimensions.h ){
      targetDimensions = eDimensions;
    }

    let data = convertSnapshot(snapshot, targetDimensions.w, targetDimensions.h);

    // console.log(this.props.component.name, suitableDimensions,eDimensions,ratio)

    this.setState({snapshotData:data, ratio:ratio});

    // let containerDimensions = 

    // let resizeRatio = {x:size.w/style.width,y:size.h/style.height}
  }
  render(){
    let source = {
      location: this.props.source,
      filetype: this.props.filetype,
      page: this.props.page,
    }

    return (
      <div className={`asset-preview-wrapper ${this.props.filetype}-asset`} onDoubleClick={this.addAssetToEditor}>
        <div className='asset-preview-title'>{this.props.title}</div>
        <div className='asset-preview-image'>
        {
          this.state.snapshotData ? 
            <img src={this.state.snapshotData} 
            // style={{
            //   transform:`scale(${this.state.ratio})`
            //  }}
             />
          :
          <SnapshotComponent source={source} id={this.props.component.id} assets/>
        }
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
