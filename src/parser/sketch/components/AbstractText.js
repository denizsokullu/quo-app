import AbstractComponent, { initAbstractComponent } from './AbstractComponent';

initAbstractComponent();

export default class AbstractText extends AbstractComponent {
    constructor(data){
        super(data);
        console.log(data);
    }
}
