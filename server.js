
/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  applications = require('./routes/applications');

var app = express();
app.set('port', process.env.PORT || 3000);

app.get('/status', applications.findStatus);
app.get('/applications', applications.findApplicants);
app.get('/applications/status', applications.findApplicantsStatus);
app.get('/applications/:id', applications.findApplicantById);
app.get('/applications/:id/status', applications.findApplicantStatusById);
app.post('/applications/:id/status', applications.updateApplicant);

//app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(express.errorHandler());
app.use(express.static(path.join(__dirname, 'client')));

http.createServer(app).listen(app.get('port'), function(){
  console.log("StrideTrack server listening on port " + app.get('port'));
});
