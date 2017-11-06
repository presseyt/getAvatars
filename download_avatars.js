
const request = require('request');
const GITHUB_TOKEN = require('./secret.js').GITHUB_TOKEN;

function getRepoContributors(repoOwner, repoName, cb){

  var requestOptions = {
    uri: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'AUTHORIZATION': 'token ' + GITHUB_TOKEN
    }

  };

  request(requestOptions, function(err, req, body){
    cb(err, body);
  });



  // request.get(requestOptions)
  //        .on('error', function(err){
  //           throw err;
  //        })
  //        .on('response', function(res){
  //          console.log(res.statusCode);
  //          return res;
  //        });
}


function printResults(err, body){
  console.log('Errors: ', err);
  console.log('Body: ', body);
}

getRepoContributors('jquery', 'jquery', printResults);