
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



//a simple  callback function to output the body
function printResults(err, body){
  console.log('Errors: ', err);
  console.log('Body: ', body);
}

//a callback function prints to the screen a list of contributors and the URLs of their avatars
function printAvatarURLs(err, body){
  if (err) throw err;

  JSON.parse(body).forEach(function(contributor){
    console.log(contributor.login, ':', ' '.repeat(15 - contributor.login.length), contributor.avatar_url);
  });
}

//a callback function to download all of the images from the URLs given in the body
function downloadAllImages(err, body){
  if (err) throw err;

  JSON.parse(body).forEach(function(contributor){
    downloadImageByURL(contributor.avatar_url, 'avatars/' + contributor.login + '.jpg');
  });
}




var args = process.argv.slice(2);
if (args.length < 2){
  console.log('Error.  Please provide the repoOwner and repoName.');
}
else{
  getRepoContributors(args[0], args[1], downloadAllImages);
}



//Test getRepoContributors by printing a list of avatar URLs to the console:
//getRepoContributors('jquery', 'jquery', printAvatarURLs);

//Test downloadImageByURL by hardcoding links
//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");


//download all images:
//getRepoContributors('jquery', 'jquery', downloadAllImages);
//getRepoContributors('dds-bridge', 'dds', downloadAllImages);












