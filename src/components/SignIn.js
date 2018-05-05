import React, { Component } from 'react';
import firebase from 'firebase'
import { withRouter } from 'react-router-dom';
/*import { auth } from './firebase';*/

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignIn extends Component {
    constructor(props) {
    super(props);
    this.state = {INITIAL_STATE};
  }

  onSubmit = (event) => {
    const {
      email,
      password,
  } = this.state;


    const {
      history,
    } = this.props;

    var database = firebase.database();

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        // console.log('logging in')
        console.log(firebase.auth().currentUser);

        // Get user id and then check for strike.
        // Alert if that is the case.
        var emailStripped = email.replace(/\./g, '_');
        console.log(emailStripped);
        database.ref('/users/emailsToIDs/' + emailStripped + '/userID').once("value").then(function(snapshot) {
          var id = Number(snapshot.val());
          database.ref('/users/userData/' + id + '/strike').once("value").then(function(strikeSnap) {
              var strike = strikeSnap.val();
              if(strike) {
                firebase.auth().signOut().then(function() {
                  alert("You have a strike because of improper token distributions");
                  window.location.href = '/signin';
                }, function(error) {
                  console.log("Error in signing out.");
                });
              } else {
                window.location.href = '/askquestion';
              }
          });

        });
      })
      .catch(error => {
        // console.log('firebase error is');
        alert(error);
        // this.setState(byPropKey('error', error));
        // alert("Wrong Email/Password combination! \nTry again!");
      });


    event.preventDefault();

    // if (!firebase.database().ref('/users/userData/').hasChild()) {
    //   // DISPLAY "SORRY, EMAIL NOT RECOGNIZED. PLEASE SIGN UP!"
    // }
    // else if (this.state.password != database().ref('/users/userData/' + email + "/password").val()) {
    //   // DISPLAY "SORRY, INCORRECT PASSWORD FOR THIS USERNAME"
    // }
    // else {
    //   // REDIRECT TO PAGE WITH ALL QUESTIONS LISTED
    // }
  }

  render () {
      const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

      return (
        <div className='mainBox'>
          <div className='headerBox'>
            <div className='linksParentBox'>
              <div className='linkBox'>
                <a href="signup" className='href'> Sign Up</a>
              </div>
              <div className='linkBox'>
                <a href="askquestion" className='href'> Ask Question</a>
              </div>
              <div className='linkBox'>
                <a href="/" className='href'>Home</a>
              </div>
              <div className='linkBox'v>
                <a href="answerquestion" className='href'> Answer Question</a>
              </div>
              <div className='linkBox'>
                <a href="pledgetokens" className='href'> Pledge Tokens</a>
              </div>
              <div className='linkBox'>
                <a href="reviewtokens" className='href'> Review Tokens</a>
              </div>
            </div>
          </div>
          <h1 className='title1'>Sign in</h1>
          <form className='formBox' onSubmit={this.onSubmit}>
            <input
              className='inputField'
              type='text'
              placeholder='Email or Username'
              value={email}
              onChange={event => this.setState(byPropKey('email', event.target.value))}
            />
            <input
              className='inputField'
              type='password'
              placeholder='Password'
              value={password}
              onChange={event => this.setState(byPropKey('password', event.target.value))}
            />
            <p></p>
            <button
              disabled={isInvalid}
              className='submitButton'
              type='submit'
            >
            Submit
            </button>
            { error && <p>{error.message}</p> }
          </form>
        </div>
      )
   }
}
export default withRouter(SignIn)
