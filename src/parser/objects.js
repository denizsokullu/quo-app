import { sketchParserNew } from './index';
import { dc } from '../redux/helpers';
import _ from 'underscore';

class ComponentCore {
  constructor(data){
    this.id = data.do_objectID;
    this.name = data.name;
    this.class = data._class;
    this.data = data;
    this.components = {};
  }
  mapLayersToComponents = (component) => {
    // checking shapes before the groups since
    // the parent is always a group for shapes
    if(areChildrenAllShapeGroups(component)){
      let newShape = new Shape(component);
      this.components[newShape.id] = newShape;
    }
    else if(component._class === 'group'){
      let newGroup = new Group(component);
      this.components[newGroup.id] = newGroup;
    }
    else{
      let newComponent = new Component(component);
      this.components[newComponent.id] = newComponent;
    }
  }
}

class ShapeContent {
  constructor(shape){
    if(shape._class === 'shapePath'){
      this.class = 'path';
      this.points = shape.points;
    }
  }
}

class Shape extends ComponentCore{
  constructor(data){
    super(data);
    this.class = 'shape';
    this.shapes = data.layers.map(this.createShape);

  }
  createShape = (shapeComponent) => {
    if(shapeComponent._class === 'shapeGroup' &&
       shapeComponent.layers.length == 1)
    {
      return new ShapeContent(shapeComponent.layers[0]);
    }
  }
}

class Component extends ComponentCore{
  // NYI
}

class Group extends ComponentCore{
  constructor(data){
    super(data);
    data.layers.map(this.mapLayersToComponents);
  }
}

class Artboard extends ComponentCore{
  constructor(data){
    super(data);
    data.layers.map(this.mapLayersToComponents);
  }
}


const areChildrenAllShapeGroups = (component) => {
  let layers = component.layers;
  return _.reduce(layers,(prev,cur)=>{
    return cur._class === 'shapeGroup' && prev
  },true);
}

class Page extends ComponentCore{
  constructor(data){
    super(data);

    delete this.data;
    //A representation of all the layers.
    //The data is not stored here, only the tree of nested components.

    this.layers = {};

    this.testLayers = [];

    data.layers.map(component => {
      //check if it is an artboard
      //only add things on the artboards
      if(component._class === 'artboard'){
        let newArtboard = new Artboard(component);
        this.layers[newArtboard.id] = newArtboard;
        this.testLayers.push(newArtboard);
      }
    });

    //Creating all the components that are residing in this page including artboards and all other components.

    this.components = {}

    Object.keys(this.layers).map(id => {
      let artboard = this.layers[id];
      this.traverseComponents(artboard);
    });

    console.log(this.components);

  }

  traverseComponents(component){

    this.components[component.id] = sketchParserNew(dc(component.data));
    //after copying the data over, delete the data key;
    delete component.data;

    if(component.components){
      Object.keys(component.components).map(key => {
        let innerComponent = component.components[key];
        this.traverseComponents(innerComponent);
      })
    }
  }

}







export { Page, Artboard, Group, Component }
