WorkView = Backbone.View.extend({

  tagName : 'section',

  initialize : function() {
    var that = this;    
    var template = currentViewModel.get( "template" );

    var gridSection = $('<section class="grid row justify-content-center"></section>');  
    $('.loading-spiner').toggle();
    
    this.callS3('projects.json').then(function(data) {
      return collection = new ProjectCollection(JSON.parse(data));   
    }).then(function(collection) {
      collection.each(function(project) {
        gridSection.append(template(project.toJSON()));
      })
      that.render(gridSection, collection);   
    })
  },
  
  render : function(gridSection, collection) {
    var that = this;

    $('.loading-spiner').toggle();
    $(this.el).addClass("work");

    this.addCategorySort(this.$el);
    this.$el.append(gridSection);

    $('.currentView').append(this.el);

    that.styledGrid(gridSection.children());    
    this.styleCategoryBar();

    this.listenProjectsOverview(gridSection, collection);
    return this;
  },
//---------------------------------------------------------------------------->
  callS3 : function(object) {
    return new Promise(function(resolve, reject) {
        $.get('/s3', { key: object }, function(data, status, response) {
          resolve(data);
      })
    });
  },

  addCategorySort : function( el ) {
    var that = this;
    var workCategoryPatch = "templates/workCategory_" + document.documentElement.lang + ".html";

    getHtml(workCategoryPatch).done(function(workCategory) {
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
          $('.grid-item').show('1000', function() {
            that.styledGrid($(".grid-item").filter(filterValue));            
          });
        }
        else {         
          $('.grid-item').not(filterValue).hide('3000', function() {
            that.styledGrid($(".grid-item").filter(filterValue));
          });
          $('.grid-item').filter(filterValue).show('3000');
        }
      });
    });
  },

  styledGrid : function( $grid ) {   
    $grid.each(function (index, element) {
      $(element).hasClass('left') ? $(element).removeClass('left') : null;
      $(element).hasClass('right') ? $(element).removeClass('right') : null;

      var paddingLeft = parseInt($(element).css('padding-left'));
      if (!$(element).hasClass('show')) {
        ($(element).position().left <= 0) ? $(element).addClass('left') : $(element).addClass('right');
      }
    });
  },
  
  styleCategoryBar : function() {
    $(document).one('scroll', function() {     
      $('.categoryGutter').height($('.categories').height())
      $('.categories').addClass('pb-1');
    });
  },



  listenProjectsOverview : function( $grid, collection ) {
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
        that.showProjectElements( projectItem, collection );
      }
      else {
        that.hideProjectElements( projectItem );
      }

      $('html, body').animate({
        scrollTop: projectItem.offset().top - $('.menu').height() - $('.categoryGutter').height()
      }, '1000');

      that.styledGrid( $('.grid').children() );
    });
  },

  showProjectElements : function( $projectItem, collection  ) {
    var projectData = collection.models[$projectItem.index()].attributes;
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
