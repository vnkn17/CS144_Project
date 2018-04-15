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
  }
  onSubmit  =  (event) => {
        const {
      question,
      numTokens,
      resolveDate,
    } = this.state;

    var database = firebase.database();
   

    /*FIREBASE STUFF GOES HERE*/
    // I am assuming that we have certain fields included in the database such as question IDs,
    // and other relevant pieces of information.
    if (!database().ref('/questions').exists()) {
      database().ref('/questions').set({
        questionCount : 0,
        questionData : {}
      });
    }
    else {
      var newQuestionId = database().ref('questions/questionCount').value();
      database.ref('questions/questionCount').set(newQuestionId + 1);
      database.ref('questions/questionData/' + newQuestionId).set({
        question : question,
        numTokens : numTokens,
        resolveDate : resolveDate,
        answers : {}
      });
    }
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
