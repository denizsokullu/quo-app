import AbstractGroup from './AbstractGroup';
import AbstractImage from './AbstractImage';
import AbstractPage from './AbstractPage';
import AbstractShape from './AbstractShape';
import AbstractText from './AbstractText';
import AbstractViewport from './AbstractViewport';

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

            //first traverses the tree to create children
            this.initChildren(data);
            //styling
            this.initStates(data);
            //linking
            this.initLinkingStructure();

            //move these into the subclasses

            if(this.is('shapeGroup')){
                this.initShapeProps(data);
            }

            else if(this.is('bitmap')){
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

            let diffProps = {}
            let coreProps = this.initStyleProps(data);
            let states = {
                'composite':{
                  props:{},
                  modifiers:['_base']
                },
                '_base':{...coreProps},
                'none':{...diffProps},
                'hover':{...diffProps},
                'pressed':{...diffProps},
                'focused':{...diffProps},
            }

            states.composite.props = PropCompositor.bakeProps(states.composite.modifiers.map(v => states[v]));

            this.state = {
                current:'composite',
                states
            }

        }

        initStyleProps(data){
            return translatePropData('sketch','abstract',data);
        }

        initLinkingStructure(){
            this.links = {

            }
            // links = {
            //   linkId:{
            //     trigger:{
            //       id:'id of the trigger component'
            //       method:'click'
            //     },
            //     targets:[
            //       {
            //         id:'id of the target component',
            //         change:[
            //           {
            //             type:'position,style-bg-color',
            //             value:'value of the property change'
            //             timing:{
            //               'props for timing go here'
            //             }
            //           },
            //         ]
            //       }
            //     ]
            //   },
            //   linkId...,
            //   linkId...,
            // }
        }

        //WRITE THESE
        initShapeProps(data){
            //add the code here
            this.layers = data.layers;
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

        static swapState(newState,state){
            state.states[state.current].active = false;
            state.states[newState].active = true;
            state.current = newState;
            return state;
        }

    }
}

initAbstractComponent();

export { AbstractComponent as default};
