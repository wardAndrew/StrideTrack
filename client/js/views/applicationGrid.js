window.ApplicationGridView = Backbone.View.extend({

    initialize: function (collection) {
        this.rows = collection.models;
        this.render();
    },

    render: function () {
        
        $(this.el).html(this.template());
        
        var visualSearch = VS.init({
            container  : $(this.el).find("#applications_visual_search"),
            query      : '',
            showFacets : true,
            readOnly   : false,
            unquotable : [

            ],
            callbacks  : {
                search : function(query, searchCollection) {

                    //Convert searchCollections to query
                    var applicationsQuery = "";

                    var facets = searchCollection.toJSON()
                    for(var i = 0; i < facets.length; i++) {
                        
                        if(applicationsQuery != "") {
                            applicationsQuery += '&' + facets[i].category + "=" + facets[i].value;
                        } else {
                            applicationsQuery = '?' + facets[i].category + "=" + facets[i].value;
                        }
                    }

                    $.ajax({
                        url: "/applications" + applicationsQuery,
                        context: document.body
                    }).done(function(result) {
                        this.rows = result.result;
                        grid.setData(result);
                        grid.render();
                    }); 
                },
                valueMatches : function(category, searchTerm, callback) {
                    switch (category) {
                    case 'status':
                        callback([
                            { value: 'test', label: 'Test' },
                        ]);
                    break;
                    }
                },
                facetMatches : function(callback) {
                    callback([
                        'status', 
                        'email', 
                        'appId'
                    ]);
                }
            }
        });

        var table = $(this.el).find("#applicationsGrid").DataTable({
            searching: false,
            lengthChange: false,
            data: this.rows,
            columns: [
                { data: 'app_id' },
                { data: 'user_id' },
                { data: 'email' },
                { data: 'created_on' },
                { data: 'plan_id' },
            ]
        });

        $(this.el).find("#applicationsGrid").on( 'click', 'tr', function (row) {
            
            var item = table.row( this ).data();
            app.navigate('applications/' + item.app_id, true);
            //if ( $(this).hasClass('selected') ) {
            //    $(this).removeClass('selected');
            //}
            //else {
            //    table.$('tr.selected').removeClass('selected');
            //    $(this).addClass('selected');
            //}
        } );

        return this;
    },

    fetch: function () {
        
    }
});

window.ApplicationListItemView = Backbone.View.extend({

    initialize: function () {
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});