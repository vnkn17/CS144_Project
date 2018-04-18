import React, { Component } from 'react';
import firebase from 'firebase';

const INITIAL_STATE = {
  question: '',
  numTokens: '',
  resolveDate: '',
  error: null,
};

export default class AskQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {INITIAL_STATE};
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("email: " + firebase.auth().currentUser.email);
      } else {
        window.location.href = '/signin';
      }
    });
  }
  onSubmit  =  (event) => {
    const {
      question,
      numTokens,
      resolveDate,
    } = this.state;

    /*FIREBASE STUFF GOES HERE*/
    // I am assuming that we have certain fields included in the database such as question IDs,
    // and other relevant pieces of information.

    var database = firebase.database();
  
    var currentUser = firebase.auth().currentUser;
    var email;
    if (currentUser != null) {
      email = (currentUser.email).replace(".", '');
      console.log("submit email: " + email);
    }

    var userID;
    database.ref('/users/emailsToIDs/' + email).once("value").then(function(snapshot) {
      userID = snapshot.val();
    });

    database.ref('/questions/questionCount').once("value").then(function(snapshot) {
      if (!snapshot.exists()) {
        database.ref('/questions').set({
          questionCount : 1,
          questionData : {},
          unresIndex : 1,
          unresolved : {0 : 0},
        });
        database.ref('/questions/questionData/' + 0).set({
          // questionID : 0,
          askerID : userID,
          text : question,
          tokensPledged : numTokens,
          resolveDate : resolveDate,
          resolved : 'false',
          answers : {},
          correctAnswer : ''
        });
      }
      else {
        var newQuestionId;
        database.ref('questions/questionCount').once("value").then(function(snapshot) {
          newQuestionId = Number(snapshot.val());
        });
        database.ref('questions/questionCount').set(newQuestionId + 1);
        database.ref('questions/questionData/' + newQuestionId).set({
          // questionID : newQuestionId,
          askerID : userID,
          text : question,
          tokensPledged : numTokens,
          resolveDate : resolveDate,
          resolved : 'false',
          answers : {},
          correctAnswer : ''
        });
        var newUnresIndex;
        database.ref('/questions/unresIndex').once("value").then(function(snapshot) {
          newUnresIndex = Number(snapshot.val());
        });
        database.ref('/questions/unresIndex').set(newUnresIndex + 1);
        database.ref('/questions/unresolved/' + newUnresIndex).set(newQuestionId)
      }
    });
    ////////// END FIREBASE CODE
  }

   render () {                                   
      return (
        <div className='mainBox'>
        	<h1> Post a question! </h1>
        	<form className='questionForm'>
        		<input
        			className='questionBox'
              		type='text'
              		placeholder='Write question here...'
              		/*value={this.getstate.question}*/
/*              	onChange={event => this.setState(byPropKey('password', event.target.value))}*/
        		/>
        		<div className='extras'>
        			<h5>Tokens </h5>
        			<input
        				className='tokens'
        				type='number'
        				/*value={this.getstate.numTokens}*/
        				placeholder='Pledge tokens'
        			/>
        			<h5>Resolve Date </h5>
        			<input
        				className='resolveDate'
        				type='date'
        				placeholder='Resolve date'
                       /*value={this.getstate.resolveDate}*/
        			/>
        		</div>
        		<button
        			className='submitButton'
        			type='submit'
        			/*onClick={() => this.}*/
        		>
        		Validate
        		</button>
        		<button
        			className='submitButton'
        			type='submit'
        			/*onClick={() => this.}*/
        		>
        		Submit
        		</button>
        	</form>
        </div>
      )
   }
}
