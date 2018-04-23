import { AbstractComponent, AbstractComponentSimple } from './abstractComponent';
import { Page, Artboard, Group, Component } from './objects.js'
//understand what an editable object needs
//start with preview
//
//preview of a page =>
function sketchParser(data){
  return new AbstractComponent(data);
}

function sketchParserNew(data){
  return new AbstractComponentSimple(data);
}

export { Page, Artboard, Group, Component, sketchParser, sketchParserNew };
