import React, { Component } from 'react';
export default class Home extends Component {
   state = { 
   }
   render () {                                   
      return (
        <div id='container'>
           <a href="signin">Sign In</a>
           <div>
           	<p></p>
           </div>
           <a href="signup"> Sign Up</a>
                      <div>
           	<p></p>
           </div>
           <a href="askquestion"> Ask Question</a>
           <div>
           	<p></p>
           </div>
           <a href="answerquestion"> Answer Question</a>
           <div>
           	<p></p>
           </div>
           <a href="pledgetokens"> Pledge Tokens</a>
        </div>
      )
   }
}