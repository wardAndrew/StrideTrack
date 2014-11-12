window.HomeView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {

    	//var template = $("#statusTmpl");
      	//var html = template.tmpl({});
      	//$(this.el).html(html);
    	
    	$(this.el).html(this.template());
    	
    	//$.ajax({
        //    url: "/applications/status",
        //    context: document.body
        //}).done(function(result) {
        //    
        //	$("#statusTmpl").tmpl(result).appendTo("#content");
        //});
		
		//$("#statusTmpl").tmpl({});

		return this;
    }
});