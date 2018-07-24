import { AbstractComponent, AbstractComponentSimple } from './abstractComponent';
import { Page, Artboard, Group, Component } from './objects.js'
//understand what an editable object needs
//start with preview
//
//preview of a page =>
function sketchParser(data){
  return new AbstractComponent(data);
}

function sketchParserNew(data,siblings){
  return new AbstractComponentSimple(data,siblings);
}

export { Page, Artboard, Group, Component, sketchParser, sketchParserNew };
