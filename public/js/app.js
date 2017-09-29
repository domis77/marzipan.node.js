var pageList = ["mainPage", "work", "about", "contact"];
//----------------------------------------------------------------------------->
var currentViewModel = new CurrentViewModel();
var menuView = new MenuView(currentViewModel);
var currentView = undefined;
var tmpCurrentView = undefined;



currentViewModel.on( "change:templatePage change:lang", function() {
  if(tmpCurrentView) {
    ($(tmpCurrentView).is(':animated')) ? currentView.close() : null;
  }
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
  if( currentView ) {   
      if( pageList.indexOf(page) > pageList.indexOf(currentView.el.classList[0]) ) {
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
      tmpCurrentView  = new MainPageView();
    break;

    case "work":
      tmpCurrentView  = new WorkView();
    break;

    case "about":
      tmpCurrentView  = new AboutView();
    break;

    case "contact":
      tmpCurrentView = new ContactView();
    break;
  };
 

  var that = this;  
  if( this.translate ) {
    $(tmpCurrentView.el).addClass(this.translate)
                              .addClass('container-fluid')
                              .addClass(this.slide);

    $(tmpCurrentView.el).one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
      currentView.close();
      $(tmpCurrentView.el).removeClass(that.translate)
                                .removeClass(that.slide)
                                .removeClass('container-fluid');
      currentView = tmpCurrentView;

      $(this).off('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');
    });
  }
  else {
    currentView = tmpCurrentView;
  }
}