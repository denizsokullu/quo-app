import _ from 'lodash';
import React from 'react';
import { compose } from 'redux';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import actions from 'quo-redux/actions';

import { translatePropData } from '../../parser/propTranslator';

import { getState } from 'quo-redux/state';

import TextArea from '../inputElements/dynamicTextArea';

import ComponentRender from './ComponentRender';

const makeEditComponent = (WrappedComponent, options) => {
  return class extends React.Component {
    createWrapperProps = () => {

      const componentClass = this.props.isParent ? 'parent' : this.props.component.class
      const className = `edit-component ${componentClass}-component`
      const id = `component-${this.props.component.id}`
      const style = this.getStyleProps();
      const onClick = this.onClick;

      return { 
               className,
               id, 
               style,
               onClick,
             }

    }

    getStyleProps = () => {
      if(this.props.isParent) return { ...this.props.style }
      const props = this.props.component.state.states.composite.props
      return translatePropData('abstract', 'css', _.pick(props,['width','height','x','y']));
    }

    onClick = (e) => {
      e.stopPropagation();
      this.selectComponent();
    }

    selectComponent(){
      const { dispatch } = this.props;
      dispatch(actions.COMPONENT_SELECT(this.props.component.id));
    }
    
    render = () => {
      const wrapperProps = this.createWrapperProps();
      return(
        <div {...wrapperProps} tabIndex='0'>
          <WrappedComponent {...this.props} wrapper={EditComponent}/>
        </div>
      )
    }
  }
}

// class ComponentRendererCore extends React.PureComponent {
//     constructor(props) {
//       super(props);
//       this.state = {
//         controller: props.controller,
//         clicked:false,
//         id:props.id,
//         draggable:true,
//         drag:{
//           start:{
//             x:0,
//             y:0
//           },
//           offset:{
//             x:0,
//             y:0
//           }
//         }
//       };
  
//       this.onClick = this.onClick.bind(this);
//       this.onMouseMove = this.onMouseMove.bind(this)
//       this.onMouseUp = this.onMouseUp.bind(this)
  
//     }
  
//     // TODO: Update this to check if component.interactions.clicked == true
//     isSelected(id){
//       return false;
//     }
  
//     getPosition(){
//       let frame = this.getStyle();
//       return {
//         x: parseInt(frame.left.slice(0,-2)),
//         y: parseInt(frame.top.slice(0,-2))
//       }
//     }
    
//     getStyle() {
  
//       if(this.props.isParent) return;
//       let props = this.props.component.state.states[this.props.component.state.current].props
//       let style = translatePropData('abstract','css',props)
  
//       return style
//     }
  
//     // edit feature
//     onClick(e){
//       if(!this.props.isParent){
//         // if(this.state.components._class === 'group'){
//         //   e.stopPropagation();
//         //   console.log('clicked on a grouped component')
//         //   return
//         // }
//         e.stopPropagation();
//         this.selectComponent();
  
//       }
  
//       //only group components selectable,
//       //if double clicked, it takes
  
//     }
//     // edit feature
//     selectComponent(){
//       const { dispatch } = this.props;
//       dispatch(actions.COMPONENT_SELECT(this.props.component.id));
//     }
//    // edit feature
//     onMouseDownHandler(e){
  
//       if(e.button !== 0) return
  
//       const ref = ReactDOM.findDOMNode(this.refs.handle);
//       const body = document.body;
//       const box = ref.getBoundingClientRect();
  
//       this.setState({
//         drag:{
//           start:{
//             x:e.pageX,
//             y:e.pageY
//           },
//           offset:this.state.drag.offset
//         }
//       });
  
//       document.addEventListener('mousemove', this.onMouseMove);
//       document.addEventListener('mouseup', this.onMouseUp);
  
//       e.preventDefault();
//       e.stopPropagation();
  
//     }
//     // edit feature
//     onMouseUp(e){
  
//       if(this.state.drag.offset.x !== 0 || this.state.drag.offset.y !== 0){
//         const { dispatch } = this.props;
//         dispatch(actions.COMPONENT_MOVE({...this.state.drag.offset,id:this.state.id}));
//       }
  
//       this.setState({
//         drag:{
//           ...this.state.drag,
//           offset:{
//             x:0,
//             y:0
//           }
//         }
//       })
  
//       document.removeEventListener('mousemove',this.onMouseMove);
//       document.removeEventListener('mouseup',this.onMouseUp);
//       e.preventDefault();
  
//     }
//     // edit feature
//     onMouseMove(e) {
  
//       const ref = ReactDOM.findDOMNode(this.refs.handle);
//       const body = document.body;
//       const box = ref.getBoundingClientRect();
  
//       const style = this.getStyle();
  
//       //including the scale of the viewer zoom
  
//       const scale = box.width / parseInt(style.width.slice(0,-2));
  
  
//       this.setState({
//         drag:{
//           offset:{
//             x:(this.state.drag.offset.x + (e.pageX - this.state.drag.start.x)* 1/scale),
//             y:(this.state.drag.offset.y + (e.pageY - this.state.drag.start.y)* 1/scale )
//           },
//           start:{
//             x:e.pageX,
//             y:e.pageY
//           },
//         }
//       })
  
//       e.preventDefault();
//     }
//     // edit feature
//     calcDragOffset(style){
  
//       let left = (parseInt(style.left.slice(0,-2)) + this.state.drag.offset.x) + 'px';
//       let top = (parseInt(style.top.slice(0,-2)) + this.state.drag.offset.y) + 'px';
//       return {left:left,top:top}
  
//     }
//     // edit feature
//     isNestedComponent(){
//       return (this.state.components._class === 'artboard' || this.state.components._class === 'group')
//     }
//     // edit feature
//     isSiblingSelected(){
//       return _.filter(this.siblings,this.isSelected).length > 0;
//     }
  
//     renderWrapper(content){
//       let style =  this.getStyle();
//       //Add in drag offset
//       if(!this.props.isParent){
//         style = {...style, ...this.calcDragOffset(style)}
//       }
  
//       else if(this.props.isParent){
//         style = {...this.props.style}
//       }
  
//       let selectedClass = this.isSelected() ? 'selected' : '';
  
//       //selected component just works normally
  
//       if(this.isSelected()){
//         return (
//           <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.props.component.class} ${selectedClass}`} id={this.props.component.id}
//             style={style}
//             onClick={this.onClick}
//             ref='handle'
//             onMouseDown={this.onMouseDownHandler.bind(this)}
//           >
//             { content }
//         </div>)
//       }
  
//       //artboard can be selected with 1 click always
  
//         // else if(this.state.component.class === 'artboard'){
//         //   return (
//         //     <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
//         //       style={style}
//         //       onClick={this.onClick}
//         //       ref='handle'
//         //       onMouseDown={this.onMouseDownHandler.bind(this)}
//         //     >
//         //       { content }
//         //   </div>)
//         // }
  
//       //group
  
//       //if the outermost group, can be selected with 1 click
//       //if inner, can be selected with 2 clicks
  
//       // else if(this.state.components._class === 'group' && this.props.selectable){
//       //   if(this.props.selectionType === 1){
//       //     return (
//       //       <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
//       //         style={style}
//       //         onClick={this.onClick}
//       //       >
//       //         { content }
//       //     </div>)
//       //   }
//       //   else if(this.props.selectionType === 2){
//       //     return (
//       //       <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
//       //         style={style}
//       //         onDoubleClick={this.onClick}
//       //       >
//       //         { content }
//       //     </div>)
//       //   }
//       //
//       // }
  
//       //any other component that is currently selectable
  
//       // else if(this.props.selectable){
//       //   if(this.props.selectionType === 1){
//       //     return (
//       //       <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
//       //         style={style}
//       //         onClick={this.onClick}
//       //       >
//       //         { content }
//       //     </div>)
//       //   }
//       //   else if(this.props.selectionType === 2){
//       //     //solved sibling selection
//       //     // console.log(this.isSiblingSelected(),this.state.selection,this.state.components.siblings);
//       //     return (
//       //       <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
//       //         style={style}
//       //         onDoubleClick={this.onClick}
//       //         onClick={(e)=>{e.stopPropagation()}}
//       //       >
//       //         { content }
//       //     </div>)
//       //   }
//       // }
  
//       //component isnt selectable
//       else{
//         return (
//           <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.props.component.class} ${selectedClass}`}
//             id={this.state.id}
//             style={style}
//             onClick={this.onClick}
//           >
//             { content }
//         </div>)
//       }
  
//     }
//     // edit feature
//     changeDrag(b){
//       this.setState({draggable:b});
//     }
  
//     render(){
  
//       switch(this.props.component.class){
//         case 'shapeGroup':
//           return this.renderWrapper(<ShapeComponent component={ this.props.component }></ShapeComponent>);
//           break;
//         case 'text':
//           return this.renderWrapper(<TextComponent component={this.props.component}></TextComponent>);
//           break;
//         default:
  
//       }
  
//       let parentContent = this.props.component.children.map(id => {
//         return (
//           <ComponentRenderer
//             id={id}
//             key={id}
//           />
//         )
//       });
  
//       let nonParentContent;
  
//       nonParentContent = this.props.component.children.map(id => {
//         return (
//           <ComponentRenderer
//             id={id}
//             key={id}
//           />
//         )
//       })
  
//       return ( this.props.isParent ? this.renderWrapper(parentContent) : this.renderWrapper(nonParentContent))
  
//     }
//   }
  

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

const EditComponent = connect(mapStateToProps)(makeEditComponent(ComponentRender))

export default EditComponent