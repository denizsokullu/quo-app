import AbstractComponent, { initAbstractComponent } from './AbstractComponent';

initAbstractComponent();

export default class AbstractGroup extends AbstractComponent {
    constructor(data){
        super(data);
    }
}
