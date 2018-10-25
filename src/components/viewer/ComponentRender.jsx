import _ from 'lodash';
import React from 'react';
import { compose } from 'redux';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import actions from 'quo-redux/actions';

import { translatePropData } from '../../parser/propTranslator';

import { getState } from 'quo-redux/state';

import SelectionFrame from '../selectionFrame';

import TextArea from '../inputElements/dynamicTextArea';

import CoreComponent from './components/CoreComponent';
import ImageComponent from './components/ImageComponent';
import ShapeComponent from './components/ShapeComponent';
import TextComponent from './components/TextComponent';
import { consolidateStreamedStyles } from 'styled-components';

import EditComponent from './EditComponent';

class ComponentRenderCore extends React.PureComponent {
  render = () => {
    switch(this.props.component.class){
      case 'shapeGroup':
        return (<ShapeComponent component={ this.props.component }></ShapeComponent>)
        break;
      case 'text':
        return (<TextComponent component={ this.props.component }></TextComponent>)
        break;
      default:
        const Wrapper = this.props.wrapper
        return (
          <React.Fragment>
            {
              this.props.component.children.map(id => {
                return (
                  <Wrapper
                    id={id}
                    key={id}
                  />
                )
              })
            }
          </React.Fragment>
        )
    }
  }
}

const mapStateToProps = (state,ownProps) => {

  let domain = getState(state,'domain');
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

const ComponentRender = connect(mapStateToProps)(ComponentRenderCore);

export default ComponentRender
