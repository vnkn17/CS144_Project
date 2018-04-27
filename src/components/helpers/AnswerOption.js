import React, { Component }  from 'react';

function AnswerOption(props) {

  return (
    <li className="white">
      <input
        className='black'
        onChange={event => props.getTokensHandler(props.answerId, event.target.value) }
        placeholder='Pledge tokens'
      />
      <label className="radioCustomLabel">
        {props.answerContent}
      </label>

    </li>


    /*onClick={() => this.}*/
  );

}

AnswerOption.propTypes = {
  answerContent: React.PropTypes.string.isRequired,
  answerId: React.PropTypes.number.isRequired,
  answer: React.PropTypes.string.isRequired,
  onAnswerSelected: React.PropTypes.func.isRequired,
  getTokensHandler: React.PropTypes.func.isRequired

};

export default AnswerOption;
