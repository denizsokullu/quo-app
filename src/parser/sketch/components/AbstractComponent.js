import AbstractGroup from './AbstractGroup';
import AbstractImage from './AbstractImage';
import AbstractPage from './AbstractPage';
import AbstractShape from './AbstractShape';
import AbstractText from './AbstractText';
import AbstractViewport from './AbstractViewport';

import ComponentState from 'parser/ComponentState';

import { translatePropData } from '../../propTranslator';
import { PropCompositor } from 'quo-redux/helpers';

var AbstractComponent;

//Workaround to solve the circular-dependency in es6.
//https://stackoverflow.com/questions/38841469/how-to-fix-this-es6-module-circular-dependency

export function initAbstractComponent(){
    if (AbstractComponent) return;

    AbstractComponent = class AbstractComponent {

        constructor(data){
            this.initCoreProps(data);
            //add support for siblings (LATER))
        }

        initCoreProps(data){

            this.name = data.name;
            this.id = data.do_objectID;
            this.class = data._class;

            this.snapshot = '';

            //first traverses the tree to create children
            this.initChildren(data);
            //styling
            this.initStates(data);
            //linking
            this.initLinkingStructure();

            //move these into the subclasses

            if(this.is('bitmap')){
              this.initImageProps(data);
            }
        }

        //initially create a tree,
        //then remove the children data,
        //replace it with just the id
        //and add it to top layer.
        initChildren(data){
            //init the children array.
            this.children = [];
            //if it is a leaf component, return
            if(!data.layers) return;

            data.layers.map( component => {
                let abstractChild;
                //Special case for artboards that are
                //contained by a page
                if(this.is('page') && component._class === 'artboard'){
                    abstractChild = new AbstractViewport(component);
                    this.children.push(abstractChild);
                }
                else{
                    switch(component._class){
                        case 'star':
                        case 'polygon':
                        case 'triangle':
                        case 'oval':
                        case 'rectangle':
                        case 'shapeGroup':
                          abstractChild = new AbstractShape(component);
                          this.children.push(abstractChild);
                        break;
                        case 'text':
                          abstractChild = new AbstractText(component);
                          this.children.push(abstractChild);
                        break;

                        case 'artboard':
                        break;

                        case 'shapePath':
                        break;

                        default:
                          abstractChild = new AbstractComponent(component);
                          this.children.push(abstractChild);

                    }
                }
            })
        }
  
        
        initStates(data){

            let base = new ComponentState('base', [], [], this.initStyleProps(data), 0);
            let hover = new ComponentState('hover', ['onMouseEnter'], ['onMouseLeave'],{}, 1);
            let pressed = new ComponentState('pressed', ['onMouseDown'], ['onMouseUp'],{}, 1);
            let focused = new ComponentState('focused', ['onFocus'], ['onBlur'], {}, 1);

            let states = {
                'composite':{
                  props:{},
                  modifiers:[base.id]
                },
                [base.id]:base,
                [hover.id]:hover,
                [pressed.id]:pressed,
                [focused.id]:focused,
            }

            states.composite.props = PropCompositor.bakeProps(states.composite.modifiers.map(v => states[v].props));

            this.state = {
                current:'composite',
                states
            }

        }

        initStyleProps(data){
            return translatePropData('sketch','abstract',data);
        }

        initLinkingStructure () {
            this.links = {
                triggers: {
                    onMouseEnter: [],
                    onMouseDown: [],
                    onFocus: [],
                },
                disables: {
                    onMouseLeave: [],
                    onMouseUp: [],
                    onBlur: [],
                },
                targetStateIds: {}
            }
        }

        initImageProps(data){
            this.changeClassTo('image');
            this.imageURL = data.image._ref;
        }
        ///////////////////

        //Helpers

        is(c){
            return this.class === c;
        }

        changeClassTo(newClass){
            this.class = newClass;
        }

    }
}

// components => these are everything u have created a rendering of?
// assets => everything you have brought in and translated
// tabs => looks at the components, and finds the components to use in that tab.
// tab does not contain any actual component, just a list of all the ids, and the children to start from?



initAbstractComponent();

export { AbstractComponent as default};
