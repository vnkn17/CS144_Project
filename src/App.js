import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class Questions extends Component{
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }
}
class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  Questions() {
    console.log('this.state', this.state)
  }
  signUp() {
    console.log('this.state', this.state)
  } 


  render() {
    return (
      <div className='form-inline'>
        <h2>Sign Up Button</h2>
        <div className='form-group'>
          <input 
            className='form-control'
            type='text'
            placeholder='email'
            onChange={event => this.setState({email: event.target.value})}
          />
          <input
            className='form-control'
            type='password'
            placeholder='Password'
            onChange={event => this.setState({password: event.target.value})} 
          />
          <button
            className='btn btn-primary'
            type='button'
            onClick={() => this.signUp()}
          >
          Sign Up
          </button> 
        </div>
      </div>      
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }


  render() {
  return (
    <div className='mainBox'>
      <h1>Login or Sign Up Here!</h1>
      <div className='formBox'>
        <input 
          className='inputField'
          type='text'
          placeholder='Email or Username'
          onChange={event => this.setState({email: event.target.value})}
        />
        
        <input
          className='inputField'
          type='password'
          placeholder='Password'
          onChange={event => this.setState({password: event.target.value})} 
        />
        <p></p>
        <button
          className='submitButton'
          type='button'
          onClick={() => this.signUp()}
        >
        Submit
        </button> 
      </div>
    </div>      
  )
}
/*
  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <div className='LoginForm'>
                <h1>Login</h1>
                <div className="post"> 
                  <p><input className = 'text' name = 'login' value = '' placeholder = 'Username or Email'/></p>
                  <p><input type = 'password' name = 'password' value = '' placeholder = 'Password'/></p>
                  <p class='remember_me'>
                    <label>
                      <input type='checkbox' name='remember_me' id='remember_me'/>
                      Remember me on this computer
                    </label>
                  </p>
                  <p class='submit'><input type='submit' name='commit' value='Login'/></p>
                </div>
              </div>
              <div class='login-help'>
                <p>Forgot your password? <a>Click here to reset it.</a></p> 
              </div>
              <h1>Testing Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }*/
}

export default App
