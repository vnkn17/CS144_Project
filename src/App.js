import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import TransactionContract from '../build/contracts/Transaction.json'

import getWeb3 from './utils/getWeb3'
import Home from './components/Home'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import AskQuestion from './components/AskQuestion'
import AnswerQuestion from './components/AnswerQuestion'
import PledgeTokens from './components/PledgeTokens'
import ReviewTokens from './components/ReviewTokens'
import {BrowserRouter, Route} from 'react-router-dom';
import firebase from 'firebase'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

var config = {
  apiKey: "AIzaSyB5KIYEuL2FMOSdeJMjYCY3oiC8uZStK84",
  authDomain: "cs144-project.firebaseapp.com",
  databaseURL: "https://cs144-project.firebaseio.com",
  projectId: "cs144-project",
  storageBucket: "cs144-project.appspot.com",
  messagingSenderId: "33058663147",
};

firebase.initializeApp(config);


/*class Questions extends Component{
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }
}*/
/*class SignUp extends Component {
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
        <form onSubmit={this.onSubmit} className='form-group'>
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
        </form>
      </div>
    )
  }
}
*/
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      storageValue: 0,
      web3: null,
      transaction: null

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
    var transContract = contract(TransactionContract)
    transContract.setProvider(this.state.web3.currentProvider)
    this.setState({
      transaction: transContract
    })



    // Declaring this for later so we can chain functions on SimpleStorage.
    // var simpleStorageInstance
    //
    // // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage.deployed().then((instance) => {
    //     simpleStorageInstance = instance
    //
    //     // Stores a given value, 5 by default.
    //     return simpleStorageInstance.set(5, {from: accounts[0]})
    //   }).then((result) => {
    //     // Get the value from the contract to prove it worked.
    //     return simpleStorageInstance.get.call(accounts[0])
    //   }).then((result) => {
    //     // Update state with the result.
    //     return this.setState({ storageValue: result.c[0] })
    //   })
    // })
  }


  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact={true} path='/' render={() => (
            <div className="App">
              <Home />
            </div>
          )}/>
          <Route exact={true} path='/signin' render={() => (
            <div className="App">
              <SignIn />
            </div>
          )}/>
          <Route exact={true} path='/reviewtokens' render={() => (
            <div className="App">
              <ReviewTokens />
            </div>
          )}/>          
          <Route exact={true} path='/askquestion' render={() => (
            <div className="App">
              <AskQuestion transcontract={this.state.transaction} web={this.state.web3}/>
            </div>
          )}/>
          <Route exact={true} path='/signup' render={() => (
            <div className="App">
              <SignUp transcontract={this.state.transaction} web={this.state.web3}/>
            </div>
          )}/>
          <Route exact={true} path='/answerquestion' render={() => (
            <div className="App">
              <AnswerQuestion transcontract={this.state.transaction} web={this.state.web3}/>
            </div>
          )}/>
          <Route exact={true} path='/PledgeTokens' render={() => (
            <div className="App">
              <PledgeTokens transcontract={this.state.transaction} web={this.state.web3}/>
            </div>
          )}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App
