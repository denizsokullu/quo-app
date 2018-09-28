import AbstractComponent, { initAbstractComponent } from './AbstractComponent';
import _ from 'lodash';

initAbstractComponent();

export default class AbstractPage extends AbstractComponent {
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
