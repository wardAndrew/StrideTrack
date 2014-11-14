
/**
 * Module dependencies.
 */

var express = require('express'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorHandler'),
  static = require('serve-static'),
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

app.use(logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser.json()); /* parse application/json */
app.use(methodOverride());
app.use(errorHandler());
app.use(static(path.join(__dirname, 'client')));

http.createServer(app).listen(app.get('port'), function(){
  console.log("StrideTrack server listening on port " + app.get('port'));
});
