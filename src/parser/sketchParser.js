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
                    case 'artboard':
                    break
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
        this.calculateSVG(data);
        this.code = [];
    }

    calculateSVG(data){
        this.pathData = ''
        const paths = data.layers.map((shape,index)=>{
            this.pathData += this.calculateShapePath(shape)
        });
    }

    calculateShapePath(){


    }
    getTheLastPathAdded(){
        return this.code[this.code.length - 1];
    }
    createNewPath(){
        this.code.push('');
    }
    addToPath(str){
        this.code[this.code.length-1] += str;
    }
    isLine(edge){
        return !edge.p1.hasCurveFrom && !edge.p2.hasCurveTo
    }
    isCurve(edge){
        return edge.p1.hasCurveFrom || edge.p2.hasCurveTo
    }
    isSmoothCurve(edge){
        return edge.p2.curveMode === 2
    }
    getControlPoints(edge,frame){
        return [edge.p1.curveFrom,edge.p2.curveTo];
    }

    convertPoint(point,frame){
        let newPoint = {...point}
        newPoint.point = this.extractPoints(point.point,frame)
        newPoint.curveFrom = this.extractPoints(point.curveFrom,frame)
        newPoint.curveTo = this.extractPoints(point.curveTo,frame)
        return newPoint
    }

    createPointTuples(points,frame,isClosed){
        let pointTuples = [];
        points.map((point,index)=>{
            //Edge case for non closed shapes
            if(index === points.length - 1 && !isClosed){
                return;
            }

            let edge = {}
            edge.p1 = this.convertPoint(point,frame)

            //last point wraps around
            if(index === points.length - 1){
                edge.p2 = this.convertPoint(points[0],frame);
            }

            else{
                edge.p2 = this.convertPoint(points[index+1],frame)
            }

            pointTuples.push(edge);

        })
        return pointTuples;
    }
    createPathCode(data){

        let frame = data.frame
        let pointTuples = this.createPointTuples(data.points,data.frame,data.isClosed)
        let edges = [];

        pointTuples.map((edge,i) => {

            //create a starting point
            if(i == 0){
                //add M
                this.addToPath(this.createM(edge.p1.point));
            }

            //add a curve
            if(this.isCurve(edge)){
                let controlPoints = this.getControlPoints(edge);
                let endPoint = edge.p2.point
                this.addToPath(this.createC(controlPoints[0],controlPoints[1],endPoint));
                //if the second point is a mirrored bezier curve
                //add an s-curve
                if(this.isSmoothCurve(edge)){
                    this.addToPath(this.createS(controlPoints[1],endPoint));
                }
            }

            //add a line
            else if(this.isLine(edge)){
                this.addToPath(this.createL(edge.p2.point));
            }

            //add a Z to close off
            if(i === pointTuples.length - 1){
                this.addToPath(this.createZ());
            }

        });

    }

    extractPoints(point,frame){
        return point.replace(/[{}]/g, '').replace(/\s/g, '').split(',').map(parseFloat).map((p,i)=>{
            if(i === 0) return parseFloat(parseFloat((p * frame.width) + frame.x).toFixed(4));
            if(i === 1) return parseFloat(parseFloat((p * frame.height) + frame.y).toFixed(4));
        });
    }

    p2s(points){
        return `${points[0]} ${points[1]}`;
    }

    createM(points){
        return `M ${this.p2s(points)} `
    }

    createL(points){
        return `L ${this.p2s(points)} `
    }

    createC(curveFrom,curveTo,points){
        return `C ${this.p2s(curveFrom)} ${this.p2s(curveTo)} ${this.p2s(points)} `
    }

    createS(curveFrom,endPoint){
        return `S ${this.p2s(curveFrom)} ${this.p2s(endPoint)} `
    }

    createZ(){
        return 'Z '
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
