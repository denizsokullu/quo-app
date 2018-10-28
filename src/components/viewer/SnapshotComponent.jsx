import _ from 'lodash';
import React from 'react';
import { compose } from 'redux';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import actions from 'quo-redux/actions';

import { translatePropData } from '../../parser/propTranslator';

import { getState } from 'quo-redux/state';

import ComponentRender from '../viewer/ComponentRender';

const makeSnapshotComponent = (WrappedComponent, options) => {
  return class extends React.Component {
    createWrapperProps = () => {
      const id = `snapshot-${this.props.component.id}`
      const style = this.getStyleProps();

      return { 
               id, 
               style,
             }

    }

    getStyleProps = () => {
      if(this.props.isParent) return { ...this.props.style }
      const props = this.props.component.state.states.composite.props
      return translatePropData('abstract', 'css', _.pick(props,['width','height','x','y']));
    }
    
    render = () => {
      const wrapperProps = this.createWrapperProps();
      return(
        <div {...wrapperProps}>
          <WrappedComponent {...this.props} wrapper={SnapshotComponent}/>
        </div>
      )
    }
  }
}

const computeRatio = (element,container) => {

  let c = container
  let e = element

  let rInner = e.w/e.h;
  let rContainer = c.w / c.h;

  return rContainer > rInner ? { w: parseInt(e.w * c.h / e.h), h: parseInt(c.h) } : { w: parseInt(c.w), h: parseInt(e.h * c.w / e.w) }

}

const convertSnapshot = (origElem, width, height, left, top) => {

  left = (left || 0);
  top = (top || 0);

  var elem = origElem.cloneNode(true);

  // unfortunately, SVG can only eat well formed XHTML
  elem.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

  // serialize the DOM node to a String
  var serialized = new XMLSerializer().serializeToString(elem);

  // Create well formed data URL with our DOM string wrapped in SVG
  return "data:image/svg+xml," +
    "<svg xmlns='http://www.w3.org/2000/svg' width='" + ((width || origElem.offsetWidth) + left) + "' height='" + ((height || origElem.offsetHeight) + top) + "'>" +
      "<foreignObject width='100%' height='100%' x='" + left + "' y='" + top + "'>" +
      serialized +
      "</foreignObject>" +
    "</svg>";
  // return dataUri
  // create new, actual image
  // var img = new Image();
  // img.src = dataUri;
  // when loaded, fire onload callback with actual image node
  // img.onload = function() {
  //   if(callback) {
  //     callback.call(this, this);
  //   }
  // };

}

const mapStateToProps = (state,ownProps) => {
  let domain = getState(state,'domain');
  if(ownProps.source){
    let source = ownProps.source
    let components = domain[source.location][source.filetype][source.page].components
    return { component: components[ownProps.id] }
  }
  else{
    //tab root is the parent component
    let tabRoot = domain.tabs.allTabs[domain.tabs.activeTab]
    //return the tabRoot
    if(ownProps.isParent){
      return {
        component:tabRoot,
      }
    }
  
    //return the component
    else{
      let component = tabRoot.components[ownProps.id];
      return {
        component:component,
      }
    }
  }
}

const SnapshotComponent = connect(mapStateToProps)(makeSnapshotComponent(ComponentRender))

export default SnapshotComponent

export { convertSnapshot, computeRatio }