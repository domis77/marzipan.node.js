MenuRouter = Backbone.Router.extend ({

  routes: {
     "" : "callTemplate",
    "*work" : "callTemplate",
    "*about" : "callTemplate",
    "*contact" : "callTemplate"
  },

  initialize: function() {
  },

  callTemplate : function( templateName ) {
    if( templateName === null) {
      templateName = "mainPage";
    }
    currentViewModel.set({ templatePage: templateName });
  }

});
