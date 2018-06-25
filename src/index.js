import React from 'react';
import ReactDOM from 'react-dom';

import { Component } from 'react';

import { Provider } from 'react-redux';
import { store } from './redux/index.js';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SideBarRight, SideBarLeft } from './components/sideBar/sideBar';
import TopBar from './components/topBar/topBar';
import DropzoneContainer from './components/dropzone/dropzoneContainer';
import Viewer from './components/viewer/viewer';

import KeyController from './components/keyController/keyController';

import './scss/main.scss';


//Testing

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router forceRefresh={true}>
            <main className="quo-content">
              <Switch>
                <Route exact={ true } path="/" render={ () => {
                  return (
                    <KeyController>
                      <DropzoneContainer>
                        <Viewer/>
                      </DropzoneContainer>
                      <TopBar/>
                      <SideBarLeft/>
                      <SideBarRight/>
                    </KeyController>
                  )
                } } />
              </Switch>
            </main>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
