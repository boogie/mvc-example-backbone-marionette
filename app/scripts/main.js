var App = new Marionette.Application();

App.addRegions({
    "mainRegion": "#main"
});

var models = {
    Clock: new (Backbone.Model.extend({
        initialize: function(options) {
            _.bindAll(this, 'setCurrentDate');
            this.setCurrentDate();
        },
        setCurrentDate: function() {
            this.set('date', new Date());
            this.timeout = window.setTimeout(this.setCurrentDate, 1000);
        }
    })),
    Search: new (Backbone.Model.extend({
        defaults: {
            query: ''
        }
    })),
    UserSearchResults: new (Backbone.Model.extend({
        defaults: {
            results: []
        }
    }))
};

var views = {
	Home: Marionette.Layout.extend({
    	template: "home",
        modelEvents: {
            'change': 'render'
        },
        model: models.Clock
    }),
    User: Marionette.Layout.extend({
        template: "user",
        regions: {
            "searchResultsRegion": ".searchResults"
        },
        ui: {
            searchField: "#user-search"
        },
        model: models.Search,
        events: {
            'keyup #user-search': 'onInputQuery'
        },
        initialize: function(){
            this.doSearch();
        },
        onInputQuery: function(){
            var query = this.ui.searchField.val();
            models.Search.set("query", query);
            var route = (query === '' ? 'user' : 'user/search/' + encodeURIComponent(query));
            router.navigate(route, {'trigger': false});
            this.doSearch();
        },
        doSearch: function(){
            var query = models.Search.get("query");
            var results = [];
            for (var i = 0; i < query.length; i++) {
                results.push({ 'num': i+1, 'char': query[i], 'code': query.charCodeAt(i) });
            }
            models.UserSearchResults.set("results", results);

        }
    }),
    UserSearchResults: Marionette.Layout.extend({
        template: "user_search_results",
        modelEvents: {
            'change': 'render'
        },
        model: models.UserSearchResults
    })
};
    
App.router = Marionette.AppRouter.extend({          
    'routes': {
        'home': 'home',
        'user': 'user',
        'user/search/:query': 'user',
        '.*': 'notFound'
    },
    'home': function(){
        App.mainRegion.show(
            new views.Home()
        );
    },
    'user': function(query){
        models.Search.set('query', query || "");
        var userView = new views.User();
        App.mainRegion.show(userView);
        userView.searchResultsRegion.show(
            new views.UserSearchResults()
        );
    },
    'notFound': function(path){
        this.navigate('home', {trigger: true});
    }
});

App.selectNavMenu = function(path) {
    var path = path.split('_');
    $('#mainNav li').removeClass('active');
    $('#mainNav li a[href="#'+path[0]+'"]').parent().addClass('active');
};

App.on('initialize:after', function() {
    window.router = new App.router();
    router.bind('route', function(path) {
        App.selectNavMenu(path);
    });
    Backbone.history.start();
});

App.start();
