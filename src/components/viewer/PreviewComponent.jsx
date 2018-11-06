import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import actions from 'quo-redux/actions';
import { getState } from 'quo-redux/state';

import { translatePropData } from 'parser/propTranslator';

// Core Rendering of the component
import ComponentRender from './ComponentRender';


const makePreviewComponent = (WrappedComponent, options) => {
    return class extends React.Component {
      stopPropagation = f => e => {
        e.stopPropagation();
        return f(e)
      }
      findStates(trigger, type){
        let states = _.omit(this.props.component.state.states, 'composite');
        return _.values(_.pickBy(states, state => state[type].includes(trigger)));
      }
      addLinkStates(event){
        const { dispatch } = this.props;
        let links = this.props.component.links.triggers[event];
        if(!links) return;
        links.forEach( id => {
          let linkId = this.props.component.links.targetStateIds[id];
          dispatch(actions.ADD_STATE_TO_COMPOSITE({id:id, state:{ id:linkId }}))
        })
      }
      removeLinkStates(event){
        const { dispatch } = this.props;
        let links = this.props.component.links.disables[event];
        if(!links) return;
        links.forEach( id => {
          let linkId = this.props.component.links.targetStateIds[id];
          dispatch(actions.REMOVE_STATE_FROM_COMPOSITE({id:id, state:{ id:linkId }}))
        })
      }
      addStates(id,states){
        const { dispatch } = this.props;
        states.forEach(s => {
          dispatch(actions.ADD_STATE_TO_COMPOSITE({id:id, state:s}))
        })
      }
      removeStates(id,states){
        const { dispatch } = this.props;
        states.forEach(s => {
          dispatch(actions.REMOVE_STATE_FROM_COMPOSITE({id:id, state:s}))
        })
      }
      handleStates(event){
        this.addStates(this.props.component.id, this.findStates(event,'ins'));
        this.removeStates(this.props.component.id, this.findStates(event,'outs'));
        this.addLinkStates(event);
        this.removeLinkStates(event);
      }
      onMouseDown(e){
        this.handleStates('onMouseDown');
        //apply onMouseDown states
        //fire actions to trigger any state changes in other components
      }
      onMouseUp(e){
        this.handleStates('onMouseUp');
      }
      onMouseEnter(e){
        this.handleStates('onMouseEnter');
      }
      onMouseLeave(e){
        this.handleStates('onMouseLeave');
      }
      onBlur(e){
        this.handleStates('onBlur');
      }
      onFocus(e){
        this.handleStates('onFocus');
      }

      getStyleProps = () => {
        if(this.props.isParent) return { ...this.props.style }
        const props = this.props.component.state.states.composite.props
        return translatePropData('abstract', 'css', _.pick(props,['width','height','x','y']));
      }

      createMouseEventListeners = () => {
        if (this.props.isParent) return {};
        return _.mapValues({
          onMouseDown: this.onMouseDown,
          onMouseUp: this.onMouseUp,
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave,
          onFocus: this.onFocus,
          onBlur: this.onBlur,
        }, f => this.stopPropagation(f.bind(this)));
      }

      createWrapperProps = () => {
  
        const componentClass = this.props.isParent ? 'parent' : this.props.component.class
        const className = `preview-component ${componentClass}-component`
        const id = `component-${this.props.component.id}`
        const style = this.getStyleProps();
        const mouseEventListeners = this.createMouseEventListeners();
  
        return { 
                  className,
                  id, 
                  style,
                  ...mouseEventListeners,
                }
  
      }
      
      render(){
        const wrapperProps = this.createWrapperProps();
        return(
          <div {...wrapperProps} tabIndex='0'>
            <WrappedComponent {...this.props} wrapper={PreviewComponent}/>
          </div>
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

  const PreviewComponent = connect(mapStateToProps)(makePreviewComponent(ComponentRender))

  export default PreviewComponent