import React, { Component } from 'react'

const INITIAL_STATE = {
  question: '',
  numTokens: '',
  resolveDate: '',
  error: null,
};

export default class AnswerQuestion extends Component {
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
   

   /*FIREBASE STUFF GOES HERE*/
  }

   render () {                                   
      return (
        <div className='mainBox'>
        	<h1> Answer a question! </h1>
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
