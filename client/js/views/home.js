window.HomeView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {

        $(this.el).html(this.template());

    	$.ajax({
            url: "/applications/status",
            context: document.body
        }).done(function(result) {
            
            // Get remote template
            $.get("js/widgets/status/status.html", null, function (template) {
 
                var html = $.templates(template).render(result);

                $("#content").append(html);

            });
        });

		return this;
    }
});