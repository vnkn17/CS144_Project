import React, { Component } from 'react';
import firebase from 'firebase'

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {INITIAL_STATE};
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
      passwordTwo
    } = this.state;

    var database = firebase.database();

    firebase.auth().createUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();

    ////////// TOMISLAV'S ATTEMPT:
    console.log('this.state', this.state)
    if (!database.ref('/users').exists()) {
      database().ref('/users').set({
        numUsers : 0,
        userData : {}
      });
      this.signUp()
    }
    else {
      // var newUserId = (database.ref('/users/numUsers')).val();
      if (database.ref('/users/userData/' + email).exists()) {
        // DISPLAY "SORRY, EMAIL TAKEN" SIGN HERE
      }
      else {
        if (passwordOne != passwordTwo) {
          // PRINT SOMETHING LIKE "PASSWORD CONFIRMATION MUST MATCH ORIGINAL PASSWORD!"
        }
        else {
          var initialTokenNum = 0; // JUST SOME PLACEHOLDER STUFF TO GET TO COMPILE
          var newEthAddress = "0x0"; // ALSO PLACEHOLDER
          database().ref('/users/userData/' + email).set({
            password : passwordOne,
            fullname : username,
            // NEED TO DO SOME SOLIDITY STUFF TO GET NEW USER ADDRESS (will assume this variable exists)
            ethAddress : newEthAddress,
            numTokens : initialTokenNum // WILL BE SET IN SOLIDITY CONTRACT
          });

          // NEED TO REDIRECT TO PAGE WITH ALL QUESTIONS
        }
      }
    }
    //////////
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <div className='mainBox'>
      <h1>Sign up Here!</h1>
      <form className='formBox' onSubmit={this.onSubmit}>
        <input
          className='inputField'
          value={username}
          onChange={event => this.setState(byPropKey('username', event.target.value))}
          type="text"
          placeholder="Full Name"
        />
        <input
          className='inputField'
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <input
          className='inputField'
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <input
          className='inputField'
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm Password"
        />
        <button className='submitButton' type="submit">
          Sign Up
        </button>
      </form>
      </div>
    )
  }
}