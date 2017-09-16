CurrentViewModel = Backbone.Model.extend({
    defaults: {
      templatePage: "",
      template: "",
      lang: document.documentElement.lang
    },

    getTemplate : function() {
      var templatePatch = "templates/" + this.get("templatePage") + "_" + this.get("lang") + ".html";
      return $.get( templatePatch, { async: false }, 'html');
    }
});
