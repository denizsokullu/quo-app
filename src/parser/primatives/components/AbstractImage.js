import { PropCompositor } from 'quo-redux/helpers';

export default class AbstractImage {
    constructor(data) {
        this.initCoreProps(data);
    }

    initCoreProps(data) {
        this.data = data.image;
        this.name = data.name;
        this.id = '123'; // Generate Id?
        this.class = 'image';

        //styling
        this.initStates(data);
        //linking
        this.initLinkingStructure();
    }

    initStates(data) {
        let diffProps = {}
        let states = {
            'composite':{
              props:{},
              modifiers:['_base']
            },
            '_base':{},
            'none':{},
            'hover':{},
            'pressed':{},
            'focused':{},
        }

        states.composite.props = PropCompositor.bakeProps(states.composite.modifiers.map(v => states[v]));

        this.state = {
            current:'composite',
            states
        }
    }

    initLinkingStructure() { }
}