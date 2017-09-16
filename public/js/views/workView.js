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

    
    this.styledGrid(gridSection.children());

    this.$el.append(gridSection);
    this.addCategorySort(this.$el);
    
    
    // $.when(that.setGridIsotope()).done( function( $grid ) {
      //   that.listenProjectsOverview( $grid );
      // });
      
    $('.currentView').append(this.el);

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
    var customIndex = 0;
    $grid.each( function(index, element) {
      $(element).hasClass('left') ? $(element).removeClass('left') : null;
      $(element).hasClass('right') ? $(element).removeClass('right') : null;   

      if( !$(element).hasClass('open') ) {
        (customIndex % 2 === 0) ? $(element).addClass('left') : $(element).addClass('right');
        customIndex++;
      }
    });
  },



  listenProjectsOverview : function( $grid ) {
    var that = this;

    $('.viewProjectButton').hover( function(element) { 

      $(this).parent().find('.projectIcon').toggleClass('greyscale');

      // if( !$(element.currentTarget.parentNode).hasClass("open") ) {
      //   $(element.currentTarget.parentNode.children[0].children).removeClass('greyscale');
      // }
    }, function(element) {
      $(this).parent().find('.projectIcon').toggleClass('greyscale');
      
      // if( !$(element.currentTarget.parentNode).hasClass("open") ) {
      //   $(element.currentTarget.parentNode.children[0].children).addClass('greyscale');
      // }
    });

    $grid.on( 'click', '.viewProjectButton', function( element ) {
      // var parentNode = element.currentTarget.parentNode;
      var projectItem = $(this).parent();
      


      $(projectItem).toggleClass('open');
      $(projectItem).toggleClass('col-lg-6 col-lg-10');

      $(projectItem).find('.content').toggleClass('col-lg-6')
                                      .toggleClass('col-md-8')
                                      .toggleClass('col-10')
                                      .toggleClass('col-12');

      $(projectItem).find('.projectIcon').toggle();
      $(projectItem).find('.projectIcon').toggleClass('d-flex');

      // that.fitNoMargin();
      // that.toggleProjectButton( element );

      if( projectItem.hasClass("open") ) {
        that.showProjectElements( projectItem );
      }
      else {
        that.hideProjectElements( projectItem );
      };
      that.styledGrid($('.grid').children());
      

      // that.styleClosedProjects($grid);
      // $grid.isotope('layout');

      // that.animateGridList( $(parentNode) );
    });


  },

  showProjectElements : function( $projectItem ) {
    var projectData = this.collection.models[$projectItem.index()].attributes;
    var templatePatch = "templates/projectsTemplates/" + projectData.template + "_" + currentViewModel.get("lang") + ".html";
    var contentSection = $projectItem.find(".content");
    

    var that = this;
    getHtml(templatePatch).done( function( rawTemplate ) {
      var template = _.template( rawTemplate )


      contentSection.append( template( projectData ));
      contentSection.addClass(projectData.template + "-template");


      console.log(projectData);

      
      

      // if( that.collection.models[$project.index()-2].attributes.category == "graphics" ) {
      //   if( that.collection.models[$project.index()-2].attributes.icons != "" ) {
      //     $( that.collection.models[$project.index()-2].attributes.icons ).each( function(index, element) {
      //       $project.find('.icons').append( "<div class= icon><img id=" + index + " src=" + element.patch + "></img></div>" ).children().last().addClass("id" + element.id);
      //     });
      //   };

      //   if( that.collection.models[$project.index()-2].attributes.img != "" ) {
      //     var counter = 0;
      //     $( that.collection.models[$project.index()-2].attributes.img ).each( function(index, element) {
      //       if(counter == 0) {
      //         var a = $project.find('.images').append("<div class = first></div>");
      //       }
      //       if(counter < 2) {
      //         $project.find('.first').last().append("<div class= image><img id=" + index + " src=" + element.patch + "></img></div>" );
      //       }
      //       if(counter == 2) {
      //         $project.find('.images').append("<div class = second></div>");
      //       }
      //       if(counter >= 2) {
      //         $project.find('.second').last().append( "<div class= image><img id=" + index + " src=" + element.patch + "></img></div>" );
      //       }
      //       counter++;
      //       if(counter == 4) {
      //         counter = 0;
      //       }
      //     });
      //   };

      // }
      // else {
      //   if( that.collection.models[$project.index()-2].attributes.img != "" ) {
      //     $( that.collection.models[$project.index()-2].attributes.img ).each( function(index, element) {
      //       $project.find('.images').append( "<div class= image><img id=" + index + " src=" + element.patch + "></img></div>" );
      //       $project.find('.images').children().last().addClass("id" + element.id);
      //     });
      //   };
      // }


      // if( that.collection.models[$project.index()-2].attributes.video != "" ) {
      //   $( that.collection.models[$project.index()-2].attributes.video ).each( function(index, element) {
      //     $project.find('.videos').append("<div class=video>" + element.patch + "</div>");
      //   });
      // }
    })

    // $project.find('.content')[0].scrollTop = 0;
  },
  hideProjectElements : function( $projectItem ) {
    $projectItem.find('.content').children().not(':first').remove();
    // $project.find('.content').removeClass().addClass('content');
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
