import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './components/app'
import store from './store'
import './index.scss'

import 'normalize.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
