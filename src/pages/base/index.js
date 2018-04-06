import React, { Component } from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { store } from '../../internal/redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { PreviewWindow } from '../../internal/components/previewWindow/previewWindow';
// import PreviewWindow from '../../internal/components/previewWindow/previewWindow';
import { SideBarRight, SideBarLeft } from '../../internal/components/sideBar/sideBar';
import TopBar from '../../internal/components/topBar/topBar';
// import StyleCard from '../../internal/components/styleCard/styleCard';
import DropzoneContainer from '../../internal/components/dropzone/dropzoneContainer';
import Viewer from '../../internal/components/viewer/viewer';
import UndoButton from '../../internal/components/undo/undo';

import KeyController from '../../internal/components/keyController/keyController';


// Libraries
// Sketch parser / Virtual DOM Creator
// Virtual DOM -> HTML

//Keyboard and Mouse Reducers

//State Diagram/components
//Components
//  - Sketch Files
//  - Virtual Component DOMs
//React components
//  - Page
//  - Component related actions

//

export default class Base extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router forceRefresh={true}>
          <div className="ic-root">
            <main className="ic-content">
              <Switch>
                <Route exact={ true } path="/" render={ () => {
                  return (
                    <KeyController>
                      <DropzoneContainer>
                        <Viewer/>

                      </DropzoneContainer>
                      {/* <UndoButton test='test'/> */}
                      {/* <ScaleStyleCard/>
                      <ShadowStyleCard/> */}
                      {/* <StyleCard title='Scale'>
                          <SliderCore title='Amount' step={0.1} min={0} max={5} value={1}/>
                          <TextInput title='X' text='1' type='number'/>
                          <TextInput title='Y' text='1' type='number'/>
                      </StyleCard> */}
                      {/* <StyleCard title='Blur'/>
                          <StyleCard title='Shadow'/>
                      <StyleCard title='Shadow'/> */}
                      <TopBar/>
                      <SideBarLeft/>
                      <SideBarRight/>

                      {/* <PreviewWindow width="1080px" height="720px">
                      </PreviewWindow> */}
                    </KeyController>
                  )
                } } />
              </Switch>
            </main>


            {/* Key Controller */}

          </div>
        </Router>
      </Provider>
    );
  }
}

// include these in components that will be using redux

// import SideBar from '../../internal/sidebar';
// import Home from '../home';
// import MarkdownBody from '../../internal/markdownBody';
// import MarkdownMeta from '../../internal/markdownMeta';
// import FeedbackLink from '../../internal/feedback-link';
// import ComponentPage from '../componentPage';
// import MotionPage from '../motionPage';
// import IconsPage from '../iconsPage';
// import TypePage from '../typePage';
// import DefaultPage from '../defaultPage';
// import IllustrationsPage from '../illustrationPage';
// import Top from '../../internal/go-to-top';

//Libraries to use
//http://react-dnd.github.io/react-dnd/examples-chessboard-tutorial-app.html
