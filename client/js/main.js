var AppRouter = Backbone.Router.extend({

    routes: {
        ""                          : "home",
        "home"                      : "home",
        "applications"	            : "grid",
        "applications/:id"          : "detail",
        "about"                     : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function () {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	grid: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var applications = new Applications();
        applications.fetch({success: function(collection){
            $("#content").html(new ApplicationGridView(collection).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    detail: function (id) {
        var application = new Application({_id: id});

        application.fetch({success: function(model){
            $("#content").html(new ApplicationDetailView(model).el);
        }});
        this.headerView.selectMenuItem();
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'ApplicationGridView', 'ApplicationDetailView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});