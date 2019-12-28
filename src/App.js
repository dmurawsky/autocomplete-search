import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchPage from './SearchPage';
import BookPage from './BookPage';

const App = () => {
  return (
    <Router>
      <Route path="/">
        {() => {
          window.scrollTo(0, 0);
          return null;
        }}
      </Route>
      <Switch>
        <Route exact path="/">
          <SearchPage />
        </Route>
        <Route path="/:id">
          <BookPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
