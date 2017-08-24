AboutView = Backbone.View.extend({

  tagName : 'section',

  initialize : function() {
    this.render();
  },

  render : function() {
    var template = currentViewModel.get( "template" );
    this.$el.append(template);
    $(this.el).addClass(currentViewModel.get( "templatePage" ));
    $(this.el).addClass("pt-4-5");

    $('.currentView').append(this.el);


    return this;
  },


  close : function() {
    this.remove();
    this.off();
    this.unbind();
  }
});
