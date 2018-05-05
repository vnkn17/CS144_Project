import React, { Component }  from 'react';

function AnswerOption(props) {

  return (
    <li className="white">
      <input
        className='black'
        onChange={event => props.getTokensHandler(props.answerId, event.target.value, props.answererID) }
        placeholder='Review(1-5)'
      />
      <label className="radioCustomLabel">
        {props.answerContent}
      </label>

    </li>

  );

}

AnswerOption.propTypes = {
  answerContent: React.PropTypes.string.isRequired,
  answerId: React.PropTypes.number.isRequired,
  answer: React.PropTypes.string.isRequired,
  onAnswerSelected: React.PropTypes.func.isRequired,
  getTokensHandler: React.PropTypes.func.isRequired,
  answererID: React.PropTypes.number.isRequired

};

export default AnswerOption;
