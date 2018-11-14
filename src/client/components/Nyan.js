import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import SubmittableAuth from '../containers/SubmittableAuth';
import PrivateRoute from '../containers/PrivateRoute';
import LoadedEvents from '../containers/LoadedEvents';
import Header from './Header';
import Footer from './Footer';
import Event from './Event';

import style from './Nyan.less';

const pageFactory = (HeaderComponent, PageComponent) => ({user, match}) => (
  console.log("Header: " + HeaderComponent + " Page: " + PageComponent + " user: " + user + " match: " + match) ||
  <div className={style.nyan}>
    <HeaderComponent user={user} />
    <section className={style.content}>
      <PageComponent match={match} user={user}/>
    </section>
    <Footer />
  </div>
);

function withProps(Component, props) {
  return p => <Component {...Object.assign({}, p, props)} />;
}

export default () => (
  <Switch>
    <PrivateRoute path="/events" component={pageFactory(Header, LoadedEvents)} />
    <PrivateRoute path="/event/:id/:selectedTab" component={pageFactory(withProps(Header, { small: true }), Event)} />
    <Route path="/auth/:selectedTab" component={withProps(SubmittableAuth, { photo: { url: '/hrpdrp.png', title: 'Hyperborea 2017', by: 'Fee Gunn' } })}  />
    <Redirect from="/" to="/events" />
  </Switch>
);