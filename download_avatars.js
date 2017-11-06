
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

// downloads from the url into filePath
function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('err', function(err){
          throw err;
         })
         .pipe(fs.createWriteStream(filePath));
}

//a callback function to download all of the images from the URLs given in the body
function downloadAllImages(err, body){
  if (err) throw err;

  JSON.parse(body).forEach(function(contributor){
    downloadImageByURL(contributor.avatar_url, 'avatars/' + contributor.login + '.jpg');
  });
}



//get arguments from the command line
var args = process.argv.slice(2);
if (args.length < 2){ //write an error message if two arguments are not passed in
  console.log('Error.  Please provide the repoOwner and repoName.');
}
else{ //if we're passed two arguments, run the code.
  getRepoContributors(args[0], args[1], downloadAllImages);
}



