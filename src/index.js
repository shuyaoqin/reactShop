import React from 'react';
import ReactDOM from 'react-dom';
import RouterComponent from './router';
import "./assets/css/common/public.css";
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from './reducers';

let store = createStore(reducers);

class Index extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Provider store={store}>
          <RouterComponent />
        </Provider>
      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
