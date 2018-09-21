import AbstractComponent, { initAbstractComponent } from './AbstractComponent';

initAbstractComponent();

export default class AbstractImage extends AbstractComponent {
    constructor(data){
        super(data);
    }
}
