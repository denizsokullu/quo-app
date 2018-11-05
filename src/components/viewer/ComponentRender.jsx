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

class ComponentRenderCore extends React.PureComponent {
  render = () => {
    switch(this.props.component.class){
      case 'shape':
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
                    source={this.props.source}
                  />
                )
              })
            }
          </React.Fragment>
        )
    }
  }
}

export default ComponentRenderCore
