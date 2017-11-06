
const request = require('request');
const fs = require('fs');
const GITHUB_TOKEN = require('./secret.js').GITHUB_TOKEN;


//gets the github list of contributors for the given repository owner + name
//calls the cb function once has recieved the api body
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
}


//a simple function to output the body
function printResults(err, body){
  console.log('Errors: ', err);
  console.log('Body: ', body);
}

//prints to the screen a list of contributors and the URLs of their avatars
function printAvatarURLs(err, body){
  if (err) throw err;

  JSON.parse(body).forEach(function(contributor){
    console.log(contributor.login, ':', ' '.repeat(15 - contributor.login.length), contributor.avatar_url);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('err', function(err){
          throw err;
         })
         .pipe(fs.createWriteStream(filePath));
}

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");

//Code that prints a list of avatar URLs to the console:
//getRepoContributors('jquery', 'jquery', printAvatarURLs);