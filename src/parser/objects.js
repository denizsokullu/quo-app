import { sketchParserNew } from './index';
import { dc } from '../redux/helpers';

class ComponentCore {
  constructor(data){
    this.id = data.do_objectID;
    this.name = data.name;
    this.class = data._class;
    this.data = data;
  }
}

class Component extends ComponentCore{
  // NYI
}

class Group extends ComponentCore{
  constructor(data){
    super(data)
    this.components  = {};
    data.layers.map(component => {
      if(component._class === 'group'){
        let newGroup = new Group(component);
        this.components[newGroup.id] = newGroup;
      }
      else{
        let newComponent = new Component(component);
        this.components[newComponent.id] = newComponent;
      }
    });
  }
}

class Artboard extends ComponentCore{
  constructor(data){
    super(data);
    this.components = {};
    data.layers.map(component => {
      if(component._class === 'group'){
        let newGroup = new Group(component);
        this.components[newGroup.id] = newGroup;
      }
      else{
        let newComponent = new Component(component);
        this.components[newComponent.id] = newComponent;
      }
    });

  }
}

class Page extends ComponentCore{
  constructor(data){
    super(data);

    delete this.data;
    //A representation of all the layers.
    //The data is not stored here, only the tree of nested components.

    this.layers = {};

    data.layers.map(component => {
      //check if it is an artboard
      //only add things on the artboards
      if(component._class === 'artboard'){
        let newArtboard = new Artboard(component);
        this.layers[newArtboard.id] = newArtboard;
      }
    });

    //Creating all the components that are residing in this page including artboards and all other components.

    this.components = {}

    Object.keys(this.layers).map(id => {
      let artboard = this.layers[id];
      // dc
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
