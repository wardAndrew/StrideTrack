
/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  applications = require('./routes/applications');

var app = express();

//console.log(express.favicon());

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  //app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'client')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/status', applications.findStatus);
app.get('/applications', applications.findApplicants);
app.get('/applications/status', applications.findApplicantsStatus);
app.get('/applications/:id', applications.findApplicantById);
app.get('/applications/:id/status', applications.findApplicantStatusById);
app.post('/applications/:id/status', applications.updateApplicant);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
