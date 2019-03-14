import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

// import './registerServiceWorker'
import './assets/styles/normalize.css'
import './assets/styles/index.css'
import Layout from './components/Layout'
import OAuth from './pages/Oauth'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/oauth/login" component={OAuth} />
      <Route path="/" component={Layout}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)
