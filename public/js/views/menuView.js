MenuView = Backbone.View.extend({
  el: $(".menu"),

  events: {
    "click #menuIcon" : "toggleMenu",

    "mouseenter .unchosen" : "backlightMenuOption",
    "mouseleave .unchosen" : "backlightMenuOption",
    "click .unchosen" : "choosenMenuOption",
    "click .menuIconLink" : "choosenMenuOption"
  },

  initialize : function(currentViewModel) {
    this.stayOpen = false;

    var that = this;
    currentViewModel.on( "change:templatePage change:lang", function() {
      var currentPage = jQuery.Event("click");
      currentPage.target = $('.menuList').find('#' + currentViewModel.get("templatePage"))[0];
      that.choosenMenuOption(currentPage);
    });

    this.render();
  },

  render: function(){

    if( document.documentElement.lang === 'en' ) {
      var menuTemplatePath = "templates/menu_en.html";
    }
    else if( document.documentElement.lang === 'fr' ) {
      var menuTemplatePath = "templates/menu_fr.html";
    }

    var that = this;
    $.get( menuTemplatePath, { async: false }, 'html').done( function( menuTemplate ) {
      if($('.menuList').hasClass("open")) {
        $(".menuList-wrapper").html(menuTemplate);
        $('.menuList').addClass('open');
      }
      else {
        $(".menuList-wrapper").html(menuTemplate);
      }
    });

    return this;
  },


  toggleMenu : function() {
    if($('.menuList').hasClass("open")) {
      this.menuClose();
    }
    else {
      this.menuOpen();
    }
  },

  menuOpen : function() {
    $('#menuIcon').removeClass('unrotated');
    $('#menuIcon').addClass('rotated')

    $('.menuList').removeClass('close');
    $('.menuList').addClass('open');
  },

  menuClose : function() {
    var that = this;
    window.setTimeout(function() {
      if(that.stayOpen === false) {
        $('#menuIcon').removeClass('rotated');
        $('#menuIcon').addClass('unrotated');

        $('.menuList').addClass('close');
        $('.menuList').removeClass('open');
      }
    }, 100);
  },

  backlightMenuOption : function( menuOption ) {
      $(menuOption.target).toggleClass("backlight");
  },

  choosenMenuOption : function( menuOption ) {
    $(".menuList>a.choosen").removeClass("choosen");
    $(menuOption.target).addClass("choosen");
  },


  stayMenuOpen : function(e) {
    this.stayOpen = e;
    if(e === false){
      this.menuClose();
    }
  }

});
