import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import './registerServiceWorker'
import './assets/styles/normalize.css'
import './assets/styles/index.css'
import Layout from './components/Layout'

ReactDOM.render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>,
  document.getElementById('root')
)
