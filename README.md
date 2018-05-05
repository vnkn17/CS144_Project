# QuesToken
### Final Project for CS-144
##### Team : Varun Krishnan, Vishal Jain, Abdur Rehman, Tomislav Zabcic-Matic
#
#
#
## Synopsis
This code contains the functionality for the QuesToken platform. The frontend is written with Node.JS using the React library while the backend uses Solidity (since QuesToken is based on the Ethereum platform) and the (live) database is hosted on Google Firebase. Ganache and Metamask were utilized for testing.

## Demo Video
Link to the demo video. Dropbox let's you watch this at two times speed.
https://www.dropbox.com/s/rg0q2gspyk3hrny/QuestokenDemo.mov?dl=0

## Local Installation

Run the following commands in your CLI in order to install the required packages on your machine to run QuesToken on your localserver (note that the default website is at https://localhost:3000). Ethereum Smart Contracts and Firebase
work on local installation.
```
// Install Node Package Manager (if needed)
1. brew install node

// Check Node successfully installed
2. node -v

// Check NPM successfully installed
3. npm -v

// install packages required by QuesToken
2. npm install

// Install pacakages required by Google Firebase (live database)
4. npm install -g firebase-tools

// Install truffle.
5. npm install -g truffle

// Compile truffle. The .json files in the /build/contracts directory
// are created after compilation. If you need to recompile, delete
// .json files in /build/contracts and then recompile.
6. truffle compile

// Ganache is needed to run a private blockchain.
7. Install Ganache and start Ganache. Here: http://truffleframework.com/ganache/.

// To migrate contracts to the private blockchain, run the following command:
// If this gives an error, delete .json files from /build/contracts file.
// Recompile and then run Ganache and migrate again.
8. truffle migrate

9. Get Metamask. We tested on Chrome.
You can use this link: https://metamask.io/#how-it-works.

10. To configure Metamask to work with Ganache, use this link:
http://truffleframework.com/tutorials/pet-shop. Literally,
follow the instructions in the "Installing and configuring Metamask" header.
The wallet seed would be the mnemonic in Ganache UI. As mentioned
in the tutorial, create a Custom RPC and enter http://127.0.0.1:7545.

// run QuesToken with default page on https://localhost:3000
11. npm run start
```

## Live Deployment

https://questokenapp.herokuapp.com/
This is the live deployed link. If you have a local copy of the code,
compile the countracts, start Ganache, migrate the code, set up metamask
with Ganache (like described above), it should work with the Ethereum.

## Main File Reference

The following describes the functionality implemented by each file.
The React App is rendered in *index.js*. The components (different pages) are linked to in *App.js* and implemented in *src\components*. Below is the description of the functions within each page/component (routes given in paranthesis after the file names)
**Note that the code in *App.js*, *App.cs*, *components*, *test*, *contracts*, *src* folders was written by the team.**
#
##### Home.js &nbsp;&nbsp;&nbsp;(_https://localhost:3000/_)
Renders main navigation page. Click Sign Up to start the sign up process.
##### SignUp.js &nbsp;&nbsp;&nbsp;(_https://localhost:3000/signup_)
Prior to signing up on the QuesToken platform, please be signed in on your appropriate
ethereum account on Metamask (or variant). A unique ethereum account should be associated with each account
on the platform for the sake of demo-ing. Enter requisite credentials and on clicking Submit, user is automatically registered in the database and redirected to the Sign In page. Sign up with a gmail account.
(Note that password length needs to be greater than 7 characters)
Metamask should notify you for a transaction that you may need to approve.

##### SignIn.js &nbsp;&nbsp;&nbsp;(_https://localhost:3000/signin_)
Enter credentials to Sign In to your profile. Errors such as wrong email/password combo, non-existent user etc. will lead to a popup alerting user of the error.
##### AskQuestion.js &nbsp;&nbsp;&nbsp;(https://localhost:3000/askquestion)
Post a question here and pledge tokens (which will then be deducted from your account and stored in escrow to be later distributed to the answerers) and click Submit to post the question. Note the token display on the top right displays the current amount of tokens you have in your wallet. We have temporarily allowed negative token balances to allow for easier testing of 'costly' features such as posting questions etc. Metamask should notify you for a transaction that you may need to
approve.
##### AnswerQuestion.js &nbsp;&nbsp;&nbsp;(https://localhost:3000/answerquestion)
Pick an answer from the list and submit your answer to it here. List shows both the question and the amounts pledged to aid answerers in choosing a question. (We plan to add additional info such as the number of answers already submitted etc.)
You can't your own question. A question that is resolved can not be answered (it won't show up in the dropdown).
Metamask should notify you for a transaction that you may need to approve.
##### PledgeTokens.js &nbsp;&nbsp;&nbsp;(https://localhost:3000/pledgetokens)
This is where question askers can distribute the tokens they pledged to the answers they have received. (Note that this page will appear empty if you haven't posted any questions since only askers can distribute tokens). Input the appropriate distributions and click Submit. The distribution numbers should sum to the number of pledged tokens for that question.
Otherwise, you may get an error notification. Once you hit submit, the question will be marked as resolved and
users can no longer answer the question. For simplicity, the page shows one unresolved question at a time.
Metamask should notify you for a transaction that you may need to approve upon submission.


##### ReviewTokens.js &nbsp;&nbsp;&nbsp;(https://localhost:3000/reviewtokens)
This is where reviewers review questions that have been resolved (tokens distributed for questions).
You can't review your question if you wrote the question or any of its answers. A reviewer can
review a specific question at most once. A reviewer must rate the responses on a scale from
1 to 5 (1 worst, 5 best). The ratings must be whole numbers. After a question receives 3 reviews,
the reviews are compared to the initial pledge token distribution (created by the questioner).
If there is sufficient difference in the distribution token allocation, the questioner
receives a "strike." If the questioner receives a "strike", he/she can't login and get an
alert that they have received a strike.



## Tests
Rigorous automated solidity and javascript tests were written to test deployed smart contracts.
These are available in the test subdirectory. You can just run 'truffle test' from the terminal
after compiling and migrating the smart contracts.


## License

Distributed under the MIT License.
