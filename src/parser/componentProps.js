import _ from 'lodash';

const allComponents = ['shape', 'group', 'text']

const componentProps = {
    width: allComponents,
    height: allComponents,
    x: allComponents,
    y: allComponents,
    // border: allComponents,
    fill: ['shape'],
    textString: ['text'],
}

const propsOfCards = {
    Position: {
        requires:{
            all: ['x','y']
        }
    },
    Size: {
        requires: {
            all: ['width', 'height']
        }
    },
    Fill: {
        requires: {
            all: ['backgroundColor'],
            shape: ['fill'],
        }
    },
}

const propCardProps = {
    width: 'Size',
    height: 'Size',
    x: 'Position',
    y: 'Position',
    border: 'Border',
    fill: 'Fill',
    backgroundColor: 'Fill'
}

const getPropsOf = (component) => _.keys(_.pickBy(componentProps, prop => prop.includes(component)))
const getCardsOf = (props) => _.chain(propCardProps).pick(props).values().uniq().value()
export const getCards = (component) => getCardsOf(getPropsOf(component.class))
export const getPropsOfCard = (card,component) => {
    let requires = propsOfCards[card].requires;
    // if the component has a unique prop 
    // that is used in the card, return that. 
    // Otherwise return the common properties 
    // that are used.
    return requires[component.class] ? requires[component.class] : requires.all
}