import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  componentDidCatch(error, info) { console.error('App error:', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center bg-slate-900 text-white p-6">
          <div className="max-w-xl">
            <h1 className="text-2xl font-semibold mb-2">Something went wrong.</h1>
            <pre className="text-xs opacity-80 whitespace-pre-wrap">
              {String(this.state.error)}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
