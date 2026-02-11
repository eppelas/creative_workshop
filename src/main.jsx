import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

window.addEventListener('error', (e) => {
  document.getElementById('root').innerHTML = `<pre style="color:red;padding:2em;font-size:14px;">RUNTIME ERROR:\n${e.message}\n${e.filename}:${e.lineno}</pre>`
})

window.addEventListener('unhandledrejection', (e) => {
  document.getElementById('root').innerHTML = `<pre style="color:red;padding:2em;font-size:14px;">PROMISE ERROR:\n${e.reason}</pre>`
})

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) return <pre style={{color:'red',padding:'2em',fontSize:'14px'}}>REACT ERROR: {this.state.error.message}{'\n'}{this.state.error.stack}</pre>
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
