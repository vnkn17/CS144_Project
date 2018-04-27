import React, { Component } from 'react';

export default class ReviewTokens extends Component {
   state = { 
   }
   render () {                                   
      return (
        <div className='mainBox'>
          <div className='headerBox'>
            <div className='linksParentBox'>
              <div className='linkBox'>
                <a href="signin" className='href'>Sign In</a>
              </div> 
              <div className='linkBox'>
                <a href="signup" className='href'> Sign Up</a>
              </div>
              <div className='linkBox'>
                <a href="askquestion" className='href'> Ask Question</a>
              </div>
              <div className='linkBox'v>
                <a href="answerquestion" className='href'> Answer Question</a>
              </div>
              <div className='linkBox'>
                <a href="pledgetokens" className='href'> Pledge Tokens</a>
              </div>
            </div>
          </div>
          <div className='contentBox'>
            <div className='select_parentBox'>
              <select className='selectBox' id="selectorBox" type="select" onChange={this.onDropdownSelected} label="Multiple Select" multiple>
              </select>              
            </div>
            <div className='answersBox'>
            <h2 className='blue'> dynamically generated content(answers) goes here</h2>
            {/*dynamically generate answers+tokens allocated and boxes to rate allocation*/}
            </div>
            <button className='submitButton1' type='submit'>
                Submit
            </button>              
          </div>
        </div>
      )
   }
}