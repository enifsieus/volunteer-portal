/**
 * Loads data from the api, passing the response data as props
 * to the child Component. Uses cached response data if possible.
 *
 * TODO: Clean up the single/multiple service call stuff. Maybe just remove the single-call case.
 *
 * @author mtownsend
 * @since Oct 2017
 */
import React from 'react';
import { connect } from 'react-redux';

import { LOADING } from '../reducers/serviceCache';
import { load } from '../actions/serviceCache';
import Spinner from '../components/Spinner';
import Error from '../components/Error';

const mapStateToProps = state => {
  return {
    serviceCache: state.serviceCache,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadData: (call, token) => dispatch(load(call, token))
  };
};

function loadIfNotCached(props) {
  const {
    serviceCall,
    token,
    serviceCache,
    loadData
  } = props;


  // Single service call
  if (typeof serviceCall === 'string') {
    if (serviceCache[serviceCall] == null) {
      // Nothing in the cache. Load it.
      loadData(serviceCall, token);
    }
    return;
  }

  // Multiple service calls
  for (let call of Object.keys(serviceCall)) {
    if (serviceCache[call] == null) {
      loadData(call, token);
    }
  }
}

class DataLoader extends React.Component {
  render() {
    const {
      serviceCall,
      serviceCache,
      component: Component,
      loadData,
      token,
      ...rest
    } = this.props;

    // Single service call. Lemon squeezy.
    if (typeof serviceCall === 'string') {
      const data = serviceCache[serviceCall];
      console.log("data: " + JSON.stringify(data));
      if (data == null || data === LOADING) {
        return <Spinner />;
      }
      if (data.error) {
        return <Error message={data.message} />;
      }

      return <Component {...data} {...rest} />;
    }

    // Multiple service calls.
    const responseMap = {};
    for (let call of Object.keys(serviceCall)) {
      const data = serviceCache[call];
      if (data == null || data === LOADING) {
        return <Spinner />;
      }
      if (data.error) {
        return <Error message={data.message} />;
      }
      responseMap[serviceCall[call]] = data;
    }
    return <Component {...responseMap} {...rest} />;
  }

  componentWillMount() {
    loadIfNotCached(this.props);
  }

  componentWillReceiveProps(newProps) {
    loadIfNotCached(newProps);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataLoader);