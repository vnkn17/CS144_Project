import React, { Component } from 'react';
import logo from './1.jpg';

export default class Home extends Component {
   state = { 
   }
   render () {                                   
      return (
        <div className='parentBox'>
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
          <div className='logoParentBox'>
            <div className='logoBox'>
              <h1 className='title'> QUESTOKEN </h1>
              <img className='img' src={logo} alt='Logo'/>
            </div>
          </div>
        </div>
      )
   }
}