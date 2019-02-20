const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey2.json");
const main = require('./index')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://issuesbot-e223c.firebaseio.com"
});

const rootRef = firebase.database();
const ref = rootRef.ref('Issues');

exports.getting_Issue_id = (picture,Issue_name,Issue_description,Issue_enviroment,Project,id,user_name,priority,ctx)=>{

  ref.once("value",function (snapshot) {
  var data = snapshot.val();
  var keys = Object.keys(data);
  var current_length=keys.length;
  var new_id=`${id}00${current_length+1}`;

    var Reported_issue = {
      projectCategory: `${Project}`,
      IssueName: `${Issue_name}`,
      IssueDescription: `${Issue_description}`,
      IssueEnvironment: `${Issue_enviroment}`,
      Issue_id: `${new_id}`,
      Issue_user_name: `${user_name}`,
      picture: `${picture}`,
      status: 'open',
      priority: `${priority}`   
    }
   
    ref.push(Reported_issue)  
    main.displaying_issue_id(new_id,ctx)
  
}, function (errorObject) {
   console.log("The read failed: " + errorObject.code)
 })
}
