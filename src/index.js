import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'mobx-react'

import './assets/styles/normalize.css'
import './assets/styles/index.css'
import userStore from './store/user'
import sprintStore from './store/sprint'
import Layout from './components/Layout'
import OAuth from './pages/Oauth'
import Intro from './pages/Intro'
// import './registerServiceWorker'

ReactDOM.render(
  <Provider sprintStore={sprintStore} userStore={userStore}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Intro} />
        <Route exact path="/oauth/login" component={OAuth} />
        <Route path="/" component={Layout} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
