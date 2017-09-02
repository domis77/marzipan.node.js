var pageList = ["mainPage", "work", "about", "contact"];
//----------------------------------------------------------------------------->

var currentViewModel = new CurrentViewModel();
var menuView = new MenuView(currentViewModel);



currentViewModel.on( "change:templatePage change:lang", function() {
  viewController();
});

$('.lang').click( function( lang ) {
  currentViewModel.set( {lang : lang.target.id} );
  document.documentElement.lang = currentViewModel.get( "lang" );
  menuView.render();
});

$('.currentView').on("swipeleft", function(x) {
  var currentPageIndex = pageList.indexOf(currentViewModel.get("templatePage"));
  if( currentPageIndex < 3) {
    window.location = "#" + pageList[currentPageIndex + 1];
  }
})
$('.currentView').on("swiperight", function(x) {
  var currentPageIndex = pageList.indexOf(currentViewModel.get("templatePage"));
  if( currentPageIndex > 0) {
    window.location = "#" + pageList[currentPageIndex - 1];
  }
})


var menuRouter = new MenuRouter();
Backbone.history.start();
//----------------------------------------------------------------------------->


function viewController() {
  currentViewModel.getTemplate().done( function( template ) {
    currentViewModel.set({ template: _.template(template) });
    switchPage( currentViewModel.get( "templatePage" ) );
  });
};


function switchPage( page ) {
  if( this.currentView ) {
    if( pageList.indexOf(page) > pageList.indexOf(this.currentView.el.className) ) {
      this.translate = "translateRight";
      this.slide = "slideLeft";
    }
    else {
      this.translate = "transalateLeft";
      this.slide = "slideRight";
    }
  }

  switch (page) {
    case "mainPage":
      this.tmpCurrentView  = new MainPageView();
    break;

    case "work":
      this.tmpCurrentView  = new WorkView();
    break;

    case "about":
      this.tmpCurrentView  = new AboutView();
    break;

    case "contact":
      this.tmpCurrentView = new ContactView();
    break;
  };

  var that = this;
  if( this.translate ) {
    $(this.tmpCurrentView.el).addClass(this.translate)
                              .addClass('container-fluid')
                              .addClass(this.slide);

    $(this.tmpCurrentView.el).one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
      that.currentView.close();
      $(that.tmpCurrentView.el).removeClass(that.translate)
                                .removeClass(that.slide)
                                .removeClass('container-fluid');
      that.currentView = that.tmpCurrentView;

      $(this).off('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');
    });
  }
  else {
    that.currentView = that.tmpCurrentView;
  }
}