import React, { Component } from 'react';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import { history } from 'src/utils/router';
import { LocaleProvider } from 'antd';
// import { createStore } from 'redux';
import { Provider } from 'react-redux';
import modules from './modules';
import { store } from 'src/utils/myRedux';

// 国际化 --- 语言包配置(默认中文)
// import language from 'antd/lib/locale-provider/ru_RU';
// import language from 'antd/lib/locale-provider/en_US';
const language = undefined;


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <LocaleProvider locale={language}>
          <Router history={history}>
              <Switch>
                  <Route path="/home" component={modules.Home} />
                  <Route path="/login" component={modules.Login} />
                  <Redirect path="/" to={{ pathname: '/home' }} />
              </Switch>
          </Router>
        </LocaleProvider>
      </Provider >
    );
  }
}
export default App;
