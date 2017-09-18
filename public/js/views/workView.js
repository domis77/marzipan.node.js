WorkView = Backbone.View.extend({

  tagName : 'section',

  initialize : function() {
    var that = this;    
    var template = currentViewModel.get( "template" );

    var gridSection = $('<section class="grid row justify-content-center"></section>');  
    this.collection = new ProjectCollection();  
    this.collection.fetch({
      async: false,
      success: function() {
        that.collection.each( function( project ) {
          gridSection.append( template(project.toJSON()) );
        }, that);
      }
    });
    
    this.render(template, gridSection);
  },
  
  render : function(template, gridSection) {
    $(this.el).addClass("work");

    this.$el.append(gridSection);
    this.addCategorySort(this.$el);

    $('.currentView').append(this.el);
    this.styledGrid(gridSection.children());

    this.listenProjectsOverview(gridSection);

    return this;
  },
//----------------------------------------------------------------------------->

  addCategorySort : function( el ) {
    var that = this;
    var workCategory = "templates/workCategory_" + document.documentElement.lang + ".html";

    getHtml(workCategory).done(function(workCategory) {
      if($('.currentView').find('.categories').length != 0) {
        $('.categories').remove();
      }
      el.prepend(workCategory);
      
      $('.categories').on("click touchend", ".category, .wiggle", function () {
        if($('.wiggle').hasClass('hover')) {
          $('.wiggle').removeClass('hover');
        }

        var filterValue = $(this).attr('data-filter');
        $(this).addClass('hover');
       
        if (filterValue == "*") {
          $(".grid-item").show('1000');
        }
        else {         
          $(".grid-item").not(filterValue).hide('3000');
          $(".grid-item").filter(filterValue).show('3000');
        }

        that.styledGrid($(".grid-item").filter(filterValue));
      });
    });
  },

  styledGrid : function( $grid ) {
    $grid.each( function(index, element) {
      $(element).hasClass('left') ? $(element).removeClass('left') : null;
      $(element).hasClass('right') ? $(element).removeClass('right') : null;         
      
      if( !$(element).hasClass('show') ) {    
        ( $(element).offset().left == 0 ) ? $(element).addClass('left') : $(element).addClass('right');
      }
    });
  },



  listenProjectsOverview : function( $grid ) {
    var that = this;

    $('.viewProjectButton').hover( function(element) { 
      $(this).parent().find('.projectIcon').toggleClass('greyscale');
    }, function(element) {
      $(this).parent().find('.projectIcon').toggleClass('greyscale');
    });

    $grid.on( 'click', '.viewProjectButton', function( element ) {
      var projectItem = $(this).parent();
      
      $(projectItem).toggleClass('hide show')
                    .toggleClass('col-lg-6 col-lg-10')
                    .toggleClass('height-30vh');

      $(projectItem).find('.content').toggleClass('col-lg-6')
                                      .toggleClass('col-md-8')
                                      .toggleClass('col-10')
                                      .toggleClass('col-lg-10')
                                      .toggleClass('col-md-11')
                                      .toggleClass('col-12')
                                      .toggleClass('h-100');

      $(projectItem).find('.projectIcon').toggle();
      $(projectItem).find('.projectIcon').toggleClass('d-flex');

      $(projectItem).find('.viewButtonText').toggle();


      if( projectItem.hasClass("show") ) {
        that.showProjectElements( projectItem );
      }
      else {
        that.hideProjectElements( projectItem );
      }

      $('html, body').animate({
        scrollTop: projectItem.offset().top - $('.menu').height()
      }, '1000');

      that.styledGrid( $('.grid').children() );
    });


  },

  showProjectElements : function( $projectItem ) {
    var projectData = this.collection.models[$projectItem.index()].attributes;
    projectData.lang = currentViewModel.get("lang");
    
    var templatePatch = "templates/projectsTemplates/" + projectData.template + ".html";
    var contentSection = $projectItem.find(".content");
    
    var that = this;
    getHtml(templatePatch).done( function( rawTemplate ) {
      var template = _.template( rawTemplate )

      contentSection.append( template( projectData ));
      contentSection.addClass(projectData.template + "-template");
    })
  },

  hideProjectElements : function( $projectItem ) {
    $projectItem.find('.content').children().not(':first').remove();
  },





  close : function() {
    this.remove();
    this.off();
    this.unbind();
  },
});


/* TODO
-sticky category bar
-paski scrollowania
-S3
*/