import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap3/dist/css/bootstrap.css';
import 'bootstrap3/dist/css/bootstrap-theme.css';
import App from './App';
import 'react-select'
import * as serviceWorker from './serviceWorker';

import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const middleware = [thunk];
const store = createStore(
  rootReducer,// where we combine all the reducersfor different actions to dispatch on redux
  composeWithDevTools(applyMiddleware(...middleware))
)


ReactDOM.render(<App store={store}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
