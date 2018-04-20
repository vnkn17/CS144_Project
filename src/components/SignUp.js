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

    if (passwordOne !== passwordTwo) {
      // Return some error message saying that passwords must match (front-end).
    }

    firebase.auth().createUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState(() => ({ ...INITIAL_STATE }));

        ////////// TOMISLAV'S ATTEMPT:
        console.log('this.state', this.state)

        database.ref('/users').once("value").then(function(snapshot) {

          // Use smart contracts to create new address for the new user, and store it in a new variable:
          var newEthAddress = "0x0"; // To be changed later of course...
          //////////

          var emailStripped = email.replace(/\./g, '_');
          console.log(emailStripped)

          if (!snapshot.exists()) {
            database.ref('/users').set({
              userCount : 1,
              emailsToIDs : {},
              userData : {}
            });
            database.ref('/users/emailsToIDs/' + emailStripped).set({
              userID : 0 //"_0"
            });
            database.ref('/users/userData/0').set({ // _0
              email : emailStripped,
              username : username,
              numQuestions : 0,
              numAnswers : 0,
              numCorrectAnswers : 0,
              ethAddress : newEthAddress,
              numTokens : 50 // Or whatever we change this number to. Must also be reflected in smart contract.
            });
          }
          else {
            console.log("activated");
            var newUserId = -1;
            database.ref('/users/userCount').once("value").then(function(snapshot) {
              newUserId = Number(snapshot.val()); //"_" + Number(snapshot.val());
              console.log(newUserId);

              database.ref('/users/userCount').set(Number(snapshot.val()) + 1);
              database.ref('/users/emailsToIDs/' + emailStripped).set({
                userID : newUserId
              });

              console.log("continued");
              database.ref('/users/userData/' + newUserId).set({
                email : emailStripped,
                username : username,
                numQuestions : 0,
                numAnswers : 0,
                numCorrectAnswers : 0,
                ethAddress : newEthAddress,
                numTokens : 50 // Or whatever we change this number to. Must also be reflected in smart contract.
              });
              console.log("finished");
            });

            // NEED TO REDIRECT TO PAGE WITH ALL QUESTIONS
          }
          //////////
        });
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
        console.log(this.state.error)
      });

    event.preventDefault();

    // database.ref('/testData').set({
    //   test1Key : 'test1Val'
    // })

    // database.ref('/testData').once("value").then(function(snapshot) {
    //   console.log("dank memes fam")
    //   console.log(snapshot.exists())
    // })
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