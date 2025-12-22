import React from 'react'

export default class AppErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state = {hasError:false, err:null} }
  static getDerivedStateFromError(err){ return {hasError:true, err} }
  componentDidCatch(error, info){ console.error('App crashed:', error, info) }
  render(){
    if(this.state.hasError){
      return (
        <div className="container" style={{padding:'2rem'}}>
          <h2>Something went wrong.</h2>
          <p className="small">Open DevTools → Console to see details.</p>
        </div>
      )
    }
    return this.props.children
  }
}
