ContactView = Backbone.View.extend({
  tagName : 'section',


  initialize : function() {
    this.render();
  },

  render : function() {
    var template = currentViewModel.get( "template" );
    this.$el.append(template);
    $(this.el).addClass(currentViewModel.get( "templatePage" ));

    $('.currentView').append(this.el);


    return this;
  },



  close : function() {
    this.remove();
    this.off();
    this.unbind();
  }
});
