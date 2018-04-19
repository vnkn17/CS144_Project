import React, { Component } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Button } from 'reactstrap';
import GithubUsers from './helpers/GithubUsers';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

const INITIAL_STATE = {
  selectedQuestionID : -1,
  askerID : -1,
  tokensInEscrow : 0,
  resolveDate : '',
  selectedQuestionText : '',
  currentAnswerList : [],
  proposedAnswer : '',
  error : null,
};

export default class AnswerQuestion extends Component {
  constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };

    // Parsing available questions to answer with Firebase:
    var database = firebase.database();
    var answerableInds = [];
    var answerable = [];
    database.ref('/questions/unresolved').once("value").then(function(snapshot) {
      var dict = snapshot.val();
      for (var key in dict) {
        answerableInds.push(dict[key]);
      }

      for (var ind in answerableInds) {
        database.ref('/questions/questionData/' + ind).once("value").then(function(snapshot) {
          var qInfo = snapshot.val();
          answerable.push(qInfo); // Creating array of answerable questions.
        });
      }


    });
  }
  onSubmit = (event) => {
    const {
      selectedQuestionID,
      askerID,
      tokensInEscrow,
      resolveDate,
      selectedQuestionText,
      currentAnswerList,
      proposedAnswer,
      error,
    } = this.state;

    event.preventDefault();

  	/*FIREBASE STUFF GOES HERE*/
  	var database = firebase.database();

  	var user = firebase.auth().currentUser;
  	var askerID;
  	var currentUserID;

  	database.ref('users/emailsToIDs/' + user.email).once("value").then(function(snapshot) {
  		currentUserID = Number(snapshot.val());

      if (currentUserID == askerID) {
        // RETURN ERROR MESSAGE SAYING YOU CANNOT ANSWER YOUR OWN QUESTION
      }
      else {
        database.ref('/questions/questionData/' + selectedQuestionID).once("value").then(function(snapshot) {
          // Do some stuff with parsing and attaching to answers array.
          // Need to deal with answer IDs, and other such things.
          // See User storage and question storage for examples.
        });
      }
  	});

  	database.ref('/questions/')

  }

	toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
		});
	ReactDOM.render(
		<div>
		<GithubUsers label="GitHub users (Async with fetch.js)" />	
		</div>
	);
  }
	
   render () {                                   
      return (
        <div className='mainBox'>
        	<h1> Answer a question! </h1>
				<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle
          tag="span"
          onClick={this.toggle}
          data-toggle="dropdown"
          aria-expanded={this.state.dropdownOpen}
        >
          List of Questions
        </DropdownToggle>
        <DropdownMenu>
          <div onClick={this.toggle}>Question 1</div>
          <div onClick={this.toggle}>Question 2</div>
          <div onClick={this.toggle}>Question 3</div>
          <div onClick={this.toggle}>Question 4</div>
        </DropdownMenu>
      </Dropdown>
           	<p></p>
			<form className='questionForm'> 
					<input
						className='questionBox'
								type='text'
								placeholder='Write Answer here...'
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
