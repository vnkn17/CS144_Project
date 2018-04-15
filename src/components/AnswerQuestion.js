import React, { Component } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Button } from 'reactstrap';
import GithubUsers from './helpers/GithubUsers';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

const INITIAL_STATE = {
  question: '',
  // questionId: ''
  numTokens: '',
  resolveDate: '',
  error: null,
};

export default class AnswerQuestion extends Component {
  constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }
  onSubmit  =  (event) => {
        const {
      question,
      numTokens,
      resolveDate,
    } = this.state;

  /*FIREBASE STUFF GOES HERE*/


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
