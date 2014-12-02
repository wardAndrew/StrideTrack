window.ApplicationDetailView = Backbone.View.extend({

    initialize: function (model) {
        this.model = model;
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "fetch"         : "fetch",
        "change"        : "change",
        "save"          : "save",
        "delete"        : "delete"
    },

    fetch: function(callback) {
        //this.model.fetch(callback);
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    save: function () {
        var self = this;
        
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        
        this.model.save(null, {
            type: 'POST',
            success: function (model) {
                self.render();
                app.navigate('applications/' + model.id, false);
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to save', 'alert-error');
            }
        });
    },

    delete: function () {
        
        this.model.destroy({
            success: function () {
                alert('Application deleted successfully');
                window.history.back();
            }
        });
        
        return false;
    },
});