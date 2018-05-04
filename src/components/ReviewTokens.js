import React, { Component } from 'react';
import firebase from 'firebase';

export default class ReviewTokens extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      numTokens: 420,
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("email: " + firebase.auth().currentUser.email);
      } else {
        window.location.href = '/signin';
      }
    });

    this.render();    
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("email: " + firebase.auth().currentUser.email);
        firebase.database().ref('/users/user')
        var email = (firebase.auth().currentUser.email).replace(/\./g, '_');
        console.log("wat");
        firebase.database().ref('/users/emailsToIDs/' + email).once("value").then(function(snapshot) {
          console.log("de");
          var currentID = snapshot.val().userID;
          firebase.database().ref('/users/userData/' + currentID + '/numTokens').once("value").then(function(snapshot) {
            console.log("fuk");
            var tkNum = Number(snapshot.val());
            // st.numTokens = tkNum;
            var tokenDisplay = document.getElementsByClassName("tokenDisplay");
            console.log("token display:\n" + tokenDisplay[0].innerHTML);
            // tokenDisplay[0].innerHTML = "You own " + tkNum + " Tokens";
            tokenDisplay[0].innerHTML = "<h4>You own " + tkNum + " Tokens</h4>\
              <a className='tokenText1' href='www.google.com'>Buy more</a>"
          });
        });
      } else {
        window.location.href = '/signin';
      }
    });
  } 

  logoutClick = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("Succesful signing out.");

    }, function(error) {
      // An error happened.
      console.log("Error in signing out.");
    });
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
                <a href="/" className='href'>Home</a>
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
          <div className='tokenDisplay'>
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
          <div className='logOutBox'>
          <button className='submitButton9' onClick={this.logoutClick}>Log Out</button>
        </div>         
        </div>
      )
   }
}
