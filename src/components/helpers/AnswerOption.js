import React, { Component }  from 'react';

function AnswerOption(props) {

  return (
    <li className="white">
      <input
        className='black'
        type='number'
        /*value={this.getstate.numTokens}*/
        placeholder='Pledge tokens'
      />
      <label className="radioCustomLabel" htmlFor={props.answerType}>
        {props.answerContent}
      </label>  
      
    </li>
    
    
    /*onClick={() => this.}*/
  );

}

AnswerOption.propTypes = {
  answerType: React.PropTypes.number.isRequired,
  answerContent: React.PropTypes.string.isRequired,
  answer: React.PropTypes.string.isRequired,
  onAnswerSelected: React.PropTypes.func.isRequired
};

export default AnswerOption;
