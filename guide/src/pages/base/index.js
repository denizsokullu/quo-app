import React, { Component } from 'react';
// import SideBar from '../../internal/sidebar';
// // import Home from '../home';
// import MarkdownBody from '../../internal/markdownBody';
// import MarkdownMeta from '../../internal/markdownMeta';
// import FeedbackLink from '../../internal/feedback-link';
// import ComponentPage from '../componentPage';
// import MotionPage from '../motionPage';
// import IconsPage from '../iconsPage';
// import TypePage from '../typePage';
// import DefaultPage from '../defaultPage';
// import IllustrationsPage from '../illustrationPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Top from '../../internal/go-to-top';

class Base extends Component {
  render() {
    return (
      <div className='main'>Teeeest</div>
      // <Router forceRefresh={true}>
      //   <div className="ic-root">
      //     <SideBar tabIndex="0" data={ data } />
      //     <main className="ic-content">
      //       <Switch>
      //         <Route exact={ true } path="/" render={ () => (
      //           <Home data={ data }/>
      //         ) } />
      //         <Route path="/components/:topic/" render={ ({ match } ) => (
      //           <div className="ic-content-page">
      //             <ComponentPage match={ match } data={ data } />
      //           </div>
      //         ) } />
      //         <Route path="/style/icons/" render={ ({ match } ) => (
      //           <div className="ic-content-page">
      //             <IconsPage />
      //           </div>
      //         ) } />
      //         <Route path="/style/typography/" render={ ({ match } ) => (
      //           <div className="ic-content-page">
      //             <TypePage />
      //           </div>
      //         ) } />
      //         <Route path="/style/illustration/" render={ ({ match } ) => (
      //           <div className="ic-content-page">
      //             <IllustrationsPage />
      //           </div>
      //         ) } />
      //         <Route path="/patterns/login/" render={ ({ match } ) => (
      //           <div className="ic-content-page">
      //             <DefaultPage
      //               tabs={[
      //                 { name: 'Web', path: 'web'},
      //                 { name: 'Mobile', path: 'mobile'}
      //               ]}
      //               match={ match }
      //               feedbackLink={ feedback_login }
      //             />
      //           </div>
      //         ) } />
      //         <Route path="/patterns/tours/" render={ ({ match } ) => (
      //           <div className="ic-content-page">
      //             <DefaultPage
      //               tabs={[
      //                 { name: 'Web', path: 'web'},
      //                 { name: 'Mobile', path: 'mobile'}
      //               ]}
      //               match={ match }
      //               feedbackLink={ feedback_tours }
      //             />
      //           </div>
      //         ) } />
      //         <Route path="/style/motion/" render={ ({ match } ) => (
      //           <div className="ic-content-page">
      //             <MotionPage match={ match } data={ data } />
      //           </div>
      //         ) } />
      //         <Route path="/:parent/:topic/" render={ ({ match } ) => (
      //           <div className="ic-content-page">
      //             <div className="container-fluid">
      //               <div className="row">
      //                 <div className="offset-1 col-10">
      //                     <MarkdownMeta match={ match } />
      //                     <MarkdownBody match={ match } />
      //                     <Top/>
      //                 </div>
      //               </div>
      //             </div>
      //             <FeedbackLink match={ match } />
      //           </div>
      //         ) } />
      //         <Route path="/:topic" render={ ({ match } ) => (
      //           <div className="ic-content-page">
      //             <div className="container-fluid">
      //               <div className="row">
      //                 <div className="offset-1 col-10">
      //                   <MarkdownMeta match={ match } />
      //                   <MarkdownBody match={ match } />
      //                   <Top/>
      //                 </div>
      //               </div>
      //             </div>
      //             <FeedbackLink match={ match } />
      //           </div>
      //         ) } />
      //       </Switch>
      //     </main>
      //   </div>
      // </Router>
    );
  }
}

export default Base;
