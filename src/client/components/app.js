import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Main from './pages/main';
import Ais from './pages/ais';
import Markup from './pages/markup';
import Stats from './pages/stats';
import Info from './pages/info';

const App = () => {
  return (
    <Switch>
      <Route
        path="/ndm"
        render={() => <Main page='ndm'/>}
        exact />
      <Route
        path="/ais"
        render={() => <Main page='ais'/>}
        exact />
      <Route
        path="/competitors"
        render={() => <Main page='competitors'/>}
        exact />
      <Route
        path="/markup/:id"
        render={(props) => <Markup {...props} page='markup'/>}
        exact />
      <Route
        path="/markup-ais/:id"
        render={(props) => <Ais {...props} page='markup-ais'/>}
        exact />
      <Route
        path="/stats"
        render={(props) => <Stats {...props} page='stats'/>}
        exact />
      <Route
        path="/info"
        render={(props) => <Info {...props} page='info'/>}
        exact />
      <Route
        path="/control"
        render={() => <Main page='control'/>}
        exact />
      <Redirect from="/" to="/ndm" exact/>
    </Switch>
  );
};

export default App;
