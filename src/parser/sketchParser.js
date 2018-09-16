import _ from 'lodash';
import { translatePropData } from './propTranslator';

class AbstractComponent {

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
        this.initStates(data);
        this.initLinkingStructure();

        //class specific properties

        if(this.is('shapeGroup')){
            this.initShapeProps(data);
        }

        else if(this.is('text')){
            this.initTextProps(data);
        }

        else if(this.is('bitmap')){
            this.initImageProps(data);
        }

        //create all of the styling
        this.createStyling(data);

    }

    is(c){
        return this.class === c;
    }

    changeClassTo(newClass){
        this.class = newClass;
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
            switch(component._class){
                case 'artboard':
                    //only add the artboards/viewports that are under a page.
                    if(this.is('page')){
                        abstractChild = new AbstractViewport(component);
                        this.children.push(abstractChild);
                    }
                case 'shapeGroup':
                    abstractChild = new AbstractShape(component);
                    this.children.push(abstractChild);
                case 'shapePath':
                    break;
                default:
                    abstractChild = new AbstractComponent(component);
                    this.children.push(abstractChild);

            }

        })
    }

    initStates(data){

        let dynamicProps = {
            active:false,
            props:this.initStyleProps(data)
        }
        let states = {
            'none':{...dynamicProps},
            'hover':{...dynamicProps},
            'pressed':{...dynamicProps},
            'focused':{...dynamicProps},
        }

        this.state = {
            current:'none',
            states
        }

        this.state = AbstractComponent.swapState('none',this.state);

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

    static swapState(newState,state){
        state.states[state.current].active = false;
        state.states[newState].active = true;
        state.current = newState;
        return state;
    }

    //WRITE THESE
    initShapeProps(data){
        //add the code here
        this.layers = data.layers;
    }
    initTextProps(data){

    }
    initImageProps(data){
        this.changeClassTo('image');
        this.imageURL = data.image._ref;
    }
    createStyling(data){

    }
    /////////////////////

}

class AbstractPage extends AbstractComponent {
    constructor(data){
        super(data);
        this.initProps(data);
    }
    initProps(data){
        this.components = {}
        this.components = this.flattenChildren({id:this.id,children:this.children},{},true);
        this.children = this.children.map((c)=> c.id);
    }

    createSingleComponentObj(obj){
        let newObj = {};
        newObj[obj.id] = obj;
        return newObj;
    }

    flattenChildren(component,collector,isParent = false){

        if(!isParent){
            collector = _.merge(collector,this.createSingleComponentObj(component));
        }

        let childrenCollected = component.children.map( child => {
            return this.flattenChildren(child,{});
        })

        collector = childrenCollected.reduce(_.merge,collector);

        component.children = component.children.map( child => {
            return child.id;
        })

        return collector

    }

}

class AbstractViewport extends AbstractComponent {
    constructor(data){
        super(data);
    }
}

class AbstractGroup extends AbstractComponent {
    constructor(data){
        super(data);
    }
}

class AbstractShape extends AbstractComponent {
    constructor(data){
        super(data);
    }
}

class AbstractText extends AbstractComponent {
    constructor(data){
        super(data);
    }
}

class AbstractImage extends AbstractComponent {
    constructor(data){
        super(data);
    }
}




// class ShapeContent {
//   constructor(shape){
//     if(shape._class === 'shapePath'){
//       this.class = 'path';
//       this.points = shape.points;
//     }
//   }
// }
//
// class Shape extends ComponentCore{
//   constructor(data){
//     super(data);
//     this.class = 'shape';
//     this.shapes = data.layers.map((shapeComponent) => {
//       if(shapeComponent._class === 'shapeGroup' &&
//          shapeComponent.layers.length === 1)
//       {
//         return new ShapeContent(shapeComponent.layers[0]);
//       }
//       else{
//         return null
//       }
//     });
//     console.log(this.shapes);
//   }
//
// }
//
// class Component extends ComponentCore{
//   // NYI
// }
//
// class Group extends ComponentCore{
//   constructor(data){
//     super(data);
//     data.layers.map((component) => {
//       // checking shapes before the groups since
//       // the parent is always a group for shapes
//       if(areChildrenAllShapeGroups(component)){
//         let newShape = new Shape(component);
//         this.components[newShape.id] = newShape;
//       }
//       else if(component._class === 'group'){
//         let newGroup = new Group(component);
//         this.components[newGroup.id] = newGroup;
//       }
//       else{
//         let newComponent = new Component(component);
//         this.components[newComponent.id] = newComponent;
//       }
//     });
//   }
// }
//
// class Artboard extends ComponentCore{
//   constructor(data){
//     super(data);
//     data.layers.map((component) => {
//       // checking shapes before the groups since
//       // the parent is always a group for shapes
//       if(areChildrenAllShapeGroups(component)){
//         let newShape = new Shape(component);
//         this.components[newShape.id] = newShape;
//       }
//       else if(component._class === 'group'){
//         let newGroup = new Group(component);
//         this.components[newGroup.id] = newGroup;
//       }
//       else{
//         let newComponent = new Component(component);
//         this.components[newComponent.id] = newComponent;
//       }
//     });
//   }
// }
//
//
// const areChildrenAllShapeGroups = (component) => {
//   let layers = component.layers;
//   if(layers) return _.reduce(layers,(prev,cur)=>{
//     return cur._class === 'shapeGroup' && prev
//   },true);
//   else return false
//
// }

// class extends ComponentCore {
//   constructor(data){
//     super(data);
//
//     let abstractPage = new AbstractComponent(data,'sketch');
//     // these can be defined in createAbstractComponent
//     abstractPage.components = {};
//     asbtractPage.children = [];
//
//     data.layers.map(component => {
//       //check if it is an artboard
//       //only add things on the artboards
//       if(component._class === 'artboard'){
//         // let newArtboard = new Artboard(component);
//         let abstractChild = new AbstractComponentFromSketch(component,'sketch');
//         abstractPage.children.push(childAbstractRepresentation.id);
//       }
//     });
//
//     //Creating all the components that are residing in this page including artboards and all other components.
//
//
//
//     abstractComponent.children.map( componentID => {
//
//     })
//
//     Object.keys(this.layers).map(id => {
//       let artboard = this.layers[id];
//       this.traverseComponents(artboard,Object.keys(this.layers));
//     });
//
//   }
//
//   traverseComponents(component,siblings){
//
//     if(component.components){
//
//       this.components[component.id] = sketchParserNew(dc(component.data),siblings);
//       //after copying the data over, delete the data key;
//       delete component.data;
//
//       Object.keys(component.components).map(key => {
//         let innerComponent = component.components[key];
//         this.traverseComponents(innerComponent,Object.keys(component.components));
//       })
//     }
//
//     else {
//       this.components[component.id] = sketchParserNew(dc(component.data),siblings);
//       //after copying the data over, delete the data key;
//       delete component.data;
//     }
//   }
//
// }

//
// const findComponentTree = (tree,id) => {
//
// }

export { AbstractPage }
