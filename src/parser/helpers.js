import _ from 'underscore';

const findComponentTree = (targetId,parentComponent) => {
  //tree is the page.layers
  if(parentComponent.id === targetId){

    if(parentComponent.components && Object.keys(parentComponent.components).length > 0){
      return parentComponent.components;
    }

    return {};
  }

  else{



    let parentTree = parentComponent.components;

    if(!parentTree) return [];

    if(parentComponent.class === 'page'){
      parentTree = parentComponent.layers;
    }

    let results = Object.keys(parentTree).map(id =>{
      return findComponentTree(targetId,parentTree[id])
    });

    return _.reduce(results, (sum,tree) => {
      return Array.isArray(tree) ? sum : tree
    },[]);

  }

}

export { findComponentTree }
