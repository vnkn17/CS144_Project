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
  onSubmit  =  (event) => {
        const {
      username,
      email,
      passwordOne,
    } = this.state;
   

    firebase.auth().createUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
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