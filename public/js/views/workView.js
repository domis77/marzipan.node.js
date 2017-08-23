WorkView = Backbone.View.extend({

  tagName : 'section',

  initialize : function() {
    this.render();
  },

  render : function() {

    var that = this;
    var template = currentViewModel.get( "template" );

    $(this.el).addClass("work");
    this.$el.append('<section class="grid"></section>');
    var gridSection = this.$el.find('.grid');


    this.collection = new ProjectCollection();
    that.collection.fetch({
      success : function() {
        that.collection.each( function( project ) {
          gridSection.append( template(project.toJSON()) );
        }, that);

        gridSection.children().each(function(index, element) {
          (index % 2 === 0) ? $(element).addClass('left') : $(element).addClass('right');
        });

        gridSection.prepend('<div  class = "grid-sizer"></div><div  class = "gutter-sizer"></div>');

        $('.currentView').append(that.el);

        $.when(that.setGridIsotope()).done( function( $grid ) {
          that.listenProjectsOverview( $grid );
        });
      }
    });

    return this;
  },
//----------------------------------------------------------------------------->

  setGridIsotope : function() {
    var $grid = $('.grid').isotope({
      itemSelector: '.grid-item',
      percentPosition: true,
      masonry: {
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer'
      }
    });

    this.addCategorySort( $grid );
    this.setInitialStyle( $grid );

    return $grid;
  },
  setInitialStyle : function( $grid ) {
    if( $('.grid-item').length %2 === 0) {
      $('.grid-item:nth-last-child(-n+2)').addClass("no-margin");
    }
    else {
      $('.grid-item:last-child').addClass("no-margin");
    };

    $grid.isotope('layout');
  },
  addCategorySort : function( $grid ) {
    var workCategory = "templates/workCategory_" + document.documentElement.lang + ".html";

      getHtml(workCategory).done( function( workCategory ) {
        if( $('.currentView').find('.categories').length != 0 ) {
          $('.categories').remove();
        }
        // $('.work').prepend( workCategory );
        $('.currentView').prepend( workCategory );

        $('.categories').on( "click touchend", ".category, .wiggle", function() {
          if( $('.wiggle').hasClass('hover') ) {
             $('.wiggle').removeClass("hover");
          }
          var filterValue = $(this).attr('data-filter');
          $(this).addClass("hover");
          $grid.isotope({ filter: filterValue });
        });
      });
  },



  listenProjectsOverview : function( $grid ) {
    var that = this;

    $('.viewProjectButton').hover( function(element) {
      if( !$(element.currentTarget.parentNode).hasClass("open") ) {
        $(element.currentTarget.parentNode.children[0].children).removeClass('greyscale');
      }
    }, function(element) {
      if( !$(element.currentTarget.parentNode).hasClass("open") ) {
        $(element.currentTarget.parentNode.children[0].children).addClass('greyscale');
      }
    });

    $grid.on( 'click', '.viewProjectButton', function( element ) {
      var parentNode = element.currentTarget.parentNode;

      $(parentNode).toggleClass('open');
      that.fitNoMargin();
      that.toggleProjectButton( element );

      if( $(parentNode).hasClass("open") ) {
        that.showProjectElements( $(parentNode) );
      }
      else {
        that.hideProjectElements( $(parentNode) );
      };


      that.styleClosedProjects($grid);
      $grid.isotope('layout');

      that.animateGridList( $(parentNode) );
    });


  },

  showProjectElements : function( $project ) {
    // -2 because sizer elements from isotope
    var projectData = this.collection.models[$project.index()-2].attributes;

    var templatePatch = "templates/projectsTemplates/" + projectData.template + "_" + currentViewModel.get("lang") + ".html";
    var contentSection = $project.find(".content");


    var that = this;
    getHtml(templatePatch).done( function(rawTemplate) {
      var template = _.template(rawTemplate)

      contentSection.append(template(projectData));
      contentSection.addClass(projectData.template + "-template");

      if( that.collection.models[$project.index()-2].attributes.category == "graphics" ) {
        if( that.collection.models[$project.index()-2].attributes.icons != "" ) {
          $( that.collection.models[$project.index()-2].attributes.icons ).each( function(index, element) {
            $project.find('.icons').append( "<div class= icon><img id=" + index + " src=" + element.patch + "></img></div>" ).children().last().addClass("id" + element.id);
          });
        };

        if( that.collection.models[$project.index()-2].attributes.img != "" ) {
          var counter = 0;
          $( that.collection.models[$project.index()-2].attributes.img ).each( function(index, element) {
            if(counter == 0) {
              var a = $project.find('.images').append("<div class = first></div>");
            }
            if(counter < 2) {
              $project.find('.first').last().append("<div class= image><img id=" + index + " src=" + element.patch + "></img></div>" );
            }
            if(counter == 2) {
              $project.find('.images').append("<div class = second></div>");
            }
            if(counter >= 2) {
              $project.find('.second').last().append( "<div class= image><img id=" + index + " src=" + element.patch + "></img></div>" );
            }
            counter++;
            if(counter == 4) {
              counter = 0;
            }
          });
        };

      }
      else {
        if( that.collection.models[$project.index()-2].attributes.img != "" ) {
          $( that.collection.models[$project.index()-2].attributes.img ).each( function(index, element) {
            $project.find('.images').append( "<div class= image><img id=" + index + " src=" + element.patch + "></img></div>" );
            $project.find('.images').children().last().addClass("id" + element.id);
          });
        };
      }


      if( that.collection.models[$project.index()-2].attributes.video != "" ) {
        $( that.collection.models[$project.index()-2].attributes.video ).each( function(index, element) {
          $project.find('.videos').append("<div class=video>" + element.patch + "</div>");
        });
      }
    })

    $project.find('.content')[0].scrollTop = 0;
  },
  hideProjectElements : function( $project ) {
    $project.find('.content').children().not(':first').remove();
    $project.find('.content').removeClass().addClass('content');
  },

  animateGridList : function( $project ) {
    if( $project.hasClass('open') ) {

      $('html, body').animate({
        scrollTop: $project.offset().top
      }, 3000);
    };

    $('.grid').one('transitionend', function() {
      $('html, body').stop();
      var scrollValue = ( $project.offset().top - $('.menu').outerHeight() - $('.currentView').height()*0.080); //025
      $('html, body').animate({
        scrollTop: scrollValue
      }, 400);
    });
  },

  toggleProjectButton : function( element ) {
    if( !$(element.currentTarget).hasClass('in-open') ) {
      $( element.currentTarget).addClass('in-open');

      if( document.documentElement.lang === "en" ) {
        element.currentTarget.innerHTML = '<p> CLOSE </p>';
      }
      else if( document.documentElement.lang === "fr" ) {
        element.currentTarget.innerHTML = '<p> FERMER </p>';
      }
    };

    if( !element.currentTarget.parentNode.className.includes("open") ) {
      if( document.documentElement.lang === "en" ) {
        element.currentTarget.innerHTML =  '<p> VIEW </p>';
      }
      else if( document.documentElement.lang === "fr" ) {
        element.currentTarget.innerHTML =  '<p> VOIR </p>';
      }
      $( element.currentTarget).removeClass('in-open');
    };
  },
  fitNoMargin : function() {
    if( $('.grid-item').length %2 === 0 ) {
      if( $('.open').last().nextAll().length %2 != 0 ) {
        $('.grid-item').removeClass("no-margin");
        $('.grid-item:last-child').addClass("no-margin");
      };

      if(!$('.grid-item:nth-last-child(1)').hasClass("open") && !$('.grid-item:nth-last-child(2)').hasClass("open") && !$('.grid-item').hasClass('open') ) {
        $('.grid-item').removeClass("no-margin");
        $('.grid-item:nth-last-child(-n+2)').addClass("no-margin");
      };

      if(  $('.open').last().nextAll().length == 0 && $('.grid-item').hasClass('open') ) {
        $('.grid-item').removeClass("no-margin");
        $('.grid-item:last-child').addClass("no-margin");
      }
    }
    else {

      if( $('.open').last().nextAll().length %2 === 0 ) {
        $('.grid-item').removeClass("no-margin");
        $('.grid-item:nth-last-child(-n+2)').addClass("no-margin");
      }
      else {
        $('.grid-item').removeClass("no-margin");
        $('.grid-item:last-child').addClass("no-margin");
      };

      if( $('.open').last().nextAll().length == 0 ) {
        $('.grid-item').removeClass("no-margin");
        $('.grid-item:last-child').addClass("no-margin");
      };

      if ( !$('.grid-item:nth-last-child(1)').hasClass("open") && !$('.grid-item:nth-last-child(2)').hasClass("open") && !$('.grid-item').hasClass('open') ) {
        $('.grid-item').removeClass("no-margin");
        $('.grid-item:last-child').addClass("no-margin");
      };
    };
  },
  styleClosedProjects : function( $grid ) {
    $('.grid').one('transitionend', function() {
      $grid.children().each( function(index, element) {
        if( element.className.includes("grid-item") && !element.className.includes("open") ) {
          if( element.getBoundingClientRect().left < $('.grid').width()*0.5 && $(element).hasClass('right') ) {
            $(element).toggleClass("right left");
          }
          else if( element.getBoundingClientRect().left > $('.grid').width()*0.5 && $(element).hasClass('left') ) {
            $(element).toggleClass("left right");
          };
        };
      });
    });
  },




  close : function() {
    $('.categories').remove();
    this.remove();
    this.off();
    this.unbind();
  },
});
