import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'mobx-react'

import './assets/styles/normalize.css'
import './assets/styles/index.css'
import store from '~/store'
import Layout from './components/Layout'
import OAuth from './pages/Oauth'
// import './registerServiceWorker'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/oauth/login" component={OAuth} />
        <Route path="/" component={Layout} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
