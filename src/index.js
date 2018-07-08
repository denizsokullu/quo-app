import React from 'react';
import ReactDOM from 'react-dom';

import { Component } from 'react';

import { Provider } from 'react-redux';
import { store } from './redux/index.js';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { browserHistory } from 'react-router'

import { syncHistoryWithStore, routerReducer, ConnectedRouter } from 'react-router-redux';

import { SideBarRight, SideBarLeft } from './components/sideBar/sideBar';

import TopBar from './components/topBar/topBar';
import DropzoneContainer from './components/dropzone/dropzoneContainer';
import Viewer from './components/viewer/viewer';

import PreviewLink from './components/previewLink';

import KeyController from './components/keyController/keyController';

import './scss/main.scss';

import { createBrowserHistory } from 'history';

import { firebase } from "./firebase";


// const config = {
//   apiKey: "AIzaSyCOJCrAjbXhyjVF94rUH6GEqoxI0jEuutM",
//   authDomain: "quo-app-data.firebaseapp.com",
//   databaseURL: "https://quo-app-data.firebaseio.com",
//   storageBucket: "quo-app-data.appspot.com",
// };

const history = syncHistoryWithStore( createBrowserHistory(), store )

//Testing

class App extends Component {
  render() {
    return (
       <Provider store={ store }>
         <Router forceRefresh={true} history={ history }>
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
                  <Route path="/p/:projectId/:pageId/:componentId" render={ ({ match }) => {
                    return (
                      <PreviewLink
                        projectId={match.params.projectId}
                        pageId={match.params.pageId}
                        id={match.params.componentId}
                      ></PreviewLink>
                    )
                  } } />
                  {/* -LGParuUInchgusujCer/39F50ACC-9E48-4F8E-976C-9C33F2D4B850/45550208-8288-4905-9AC9-AC7B55C5E9F2 */}
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
