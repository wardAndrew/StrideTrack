var http = require('http');
var nconf = require('nconf');
var	format = require('util').format;

nconf.env().file({ file : 'config.json'});

var dbConfig = {
  client: 'pg',
  connection: nconf.get("POSTGRESS_URI")
};
var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

// Status model
var Status = bookshelf.Model.extend({
    tableName: 'status'
});

// Applicant model
var Applicant = bookshelf.Model.extend({
    tableName: 'ifp_app',

    parse: function (response) {
        response.app_json = JSON.parse(response.app_json);
        return response;
    },

    initialize: function() {
    },

    validateSave: function() {
    }
});

exports.findStatus = function (req, res) {
    console.log('Find status');

    new Status().fetchAll().then(function(status) {
        res.send({"success" : true, "data": status.toJSON()});
    }).catch(function(error) {
        res.send({"error" : error});
    });
};

exports.findApplicantsStatus = function (req, res) {
    console.log('Find enrollment status');

    //select count(status.id), name, status.id
    //from status inner join ifp_enroll_status on status.id = ifp_enroll_status.status_id 
    //group by status_id, name, status.id

    knex('status').select('name', 'status.id').innerJoin('ifp_enroll_status', 'ifp_enroll_status.status_id', 'status.id').count('status.id').groupBy('status_id', 'name', 'status.id').then(function (data) { 
        res.send({"success" : true, "data": data});
    }).catch(function(error) {
        res.send({"error" : error});
    });;
};

exports.findApplicants = function (req, res) {
    console.log('Find applicants');

    var where = {app_status: 'submitted'};
    if(req.query) {
        if(req.query["email"]) {
            where['stride_user.email'] = req.query["email"];
        }
        else if(req.query["appId"]) {
            where.app_id = req.query["appId"];
        }
        if(req.query["enrollmentStatus"]) {
        }
    }

    new Applicant(where).fetchAll().then(function(applicants) {
        res.send({"success" : true, "data": applicants.toJSON()});
    }).catch(function(error) {
        res.send({"error" : error});
    });

    //knex('ifp_app').select('ifp_app.app_id', 'stride_user.user_id', 'stride_user.email', 'ifp_app.created_on', 'ifp_app.plan_id' ).where(where).innerJoin('stride_user', 'ifp_app.user_id', 'stride_user.user_id')
    //    .then(function (rows) { 
    //    res.send({"success" : true, "data": rows});
    //}).catch(function(error) {
    //    res.send({"error" : error});
    //});
};

exports.findApplicantById = function (req, res) {
    var id = req.params.id;
    console.log('Find applicant: ' + id);

    new Applicant({'app_id' : id}).fetch().then(function(applicant) {
        res.send({"success" : true, "data": applicant});
    }).catch(function(error) {
        res.send({"error" : error});
    });

    //knex('ifp_app').select('app_id', 'user_id', 'app_json').where({app_id : id}).then(function (result) {        
    //    result[0].app_json = JSON.parse(result[0].app_json);
    //    res.send({"success" : true, "data": result});
    //}).catch(function(error) {
    //    res.send({"error" : error});
    //});
};

exports.findApplicantStatusById = function (req, res) {
    var id = req.params.id;
    console.log('Find applicant status: ' + id);

    knex('ifp_app').select('status_id').where({app_id : id}).innerJoin('ifp_enroll_status', 'ifp_app_id', 'app_id')
        .then(function (rows) { 
        res.send({"success" : true, "data": rows});
    }).catch(function(error) {
        res.send({"error" : error});
    });
};

exports.updateApplicant = function (req, res) {
    var insert = {};
    insert['ifp_app_id'] = req.params.id;

    if(req.body.user_id) {
        insert['user_id'] = req.body.user_id;
    } else {
        res.send({"error" : "user id not provided"});   
    }

    if(req.body.status) {
        insert['status_id'] = req.body.status;
    } else {
        res.send({"error" : "status not provided"});   
    }

    if(req.body.carrier_notes) {
        insert['carrier_notes'] = req.body.carrier_notes;
    }

    insert['created_on'] = new Date().toISOString();
    insert['updated_on'] = insert['created_on'];
     
    console.log('Update applicant status: ' + insert['ifp_app_id']);

    knex('ifp_enroll_status').insert(insert).then(function() {
        res.send({"success" : true});    
    }).catch(function(error) {
        res.send({"error" : error});
    });
};