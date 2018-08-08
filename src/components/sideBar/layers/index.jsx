import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getState } from '../../../redux/state';
import { CHANGE_ACTIVE_TAB, NEW_TAB } from '../../../redux/actions';
import _ from 'lodash';

import { VerticalListCard } from '../../card';


class LayersTab extends Component {
  render(){
    return (
      <div className='layers-tab-wrapper'>
        <PagesViewer pages={this.props.tabs.allTabs} selected={this.props.tabs.activeTab}/>
      </div>
    )
  }
}

class PagesViewer extends Component {
  constructor(props){
    super(props);
    // let tabs = this.assignPages(props.allTabs);
    // let selected = undefined;
    // if(pages.length > 0){
    //   selected = pages[0];
    // }
    // this.state = {
    //   pages:pages,
    //   selected:selected,
    //   fakeAssets:new Array(30).fill(0),
    // }
    this.changeActiveTab = this.changeActiveTab.bind(this);
    this.createNewTab = this.createNewTab.bind(this);
  }

  // assignPages(pages){
  //   return Object.keys(pages).map( page =>{
  //     return { id:pages[page].id, name:pages[page].name }
  //   })
  // }

  // componentWillReceiveProps(nextProps){
  //   if(!_.isEmpty(nextProps.assets)){
  //     let pages = this.assignPages(nextProps.assets);
  //     if(!this.state.selected) this.setState({selected:pages[0]})
  //     this.setState({pages:pages})
  //   }
  // }

  // onPageChange(page){
  //   this.setState({selected:page});
  // }

  // renderFirstDepthComponents(){
  //   //find all the artboards
  //   let artboardIDs = this.props.assets[this.state.selected.id].children;
  //   //search all the first depth components
  //
  //   let firstDepthComponents = artboardIDs.map( artboardID =>{
  //     //get the children of the artboard;
  //     let components = this.props.assets[this.state.selected.id].components
  //     let artboard = components[artboardID];
  //     return artboard.children.map( childID => {
  //       return components[childID]
  //     })
  //   })
  //
  //   let flattenedfirstDepthComponents = [];
  //
  //   firstDepthComponents.map(components => {
  //     components.map(component => {
  //       flattenedfirstDepthComponents.push(component);
  //     })
  //   })
  //
  //   firstDepthComponents = flattenedfirstDepthComponents;
  //
  //   return (
  //       !_.isEmpty(firstDepthComponents) ?
  //         <div className='asset-preview-table'>
  //           {
  //             Object.keys(firstDepthComponents).map((o,i)=>{
  //               let component = firstDepthComponents[o]
  //               return <AssetPreview key={i} component={component} page={this.state.selected.id} filetype='sketch' source='assets' title={`${component.name}`}/>
  //             })
  //           }
  //         </div>
  //       :
  //        <div className='no-assets'>
  //          No artboards with assets found
  //        </div>
  //   )
  // }

  changeActiveTab(v){
    //only fire if different
    if(v.id !== this.props.selected){
      const { dispatch } = this.props;
      dispatch(CHANGE_ACTIVE_TAB({id:v.id}));
    }
  }

  createNewTab(){
    //only fire if different
    const { dispatch } = this.props;
    dispatch(NEW_TAB());
  }


  render(){
    let isCollapsed = _.isEmpty(this.props.pages)
    return (
      <div className='layers-page-viewer-wrapper'>
        <VerticalListCard
          collapsed={isCollapsed}
          title='Project Pages'
          headerIcon={
            <div>
            +
            </div>
          }
          values={_.values(this.props.pages)}
          selected={this.props.selected}
          onOptionClick={this.changeActiveTab}
          onHeaderIconClick={this.createNewTab}
        />
        {/* <div className='card-body'>
          {
            this.state.pages.map((page,i)=>{
              return(
                <div className={`page ${page.id === this.state.selected.id ? 'selected' : ''}`} key={i} onClick={()=>{this.onPageChange(page)}}>{page.name}</div>
              )
            })
          }
        </div> */}
        {/* <div className='assets-preview-wrapper'>
          {
            this.state.selected ? this.renderFirstDepthComponents() : null
          }
        </div> */}
      </div>
    )
  }
}



const mapStateToProps = (state) => {
  let domain = {...getState(state,'domain')}
  return {
    tabs:domain.tabs,
  }
}

PagesViewer = connect()(PagesViewer)

export default connect(mapStateToProps)(LayersTab);
