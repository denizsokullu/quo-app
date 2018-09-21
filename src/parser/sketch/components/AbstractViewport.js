import AbstractComponent, { initAbstractComponent } from './AbstractComponent';

initAbstractComponent();

export default class AbstractViewport extends AbstractComponent{
    constructor(data){
        super(data);
    }
}
