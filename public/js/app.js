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
    $(this.tmpCurrentView.el).addClass(this.translate);
    $(this.tmpCurrentView.el).addClass(this.slide);

    $(this.tmpCurrentView.el).one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
      that.currentView.close();
      $(that.tmpCurrentView.el).removeClass(that.translate).removeClass(that.slide);
      that.currentView = that.tmpCurrentView;

      $(this).off('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');
    });
  }
  else {
    that.currentView = that.tmpCurrentView;
  }
}


//-----TEST-AWS-SDK--->

// var creds = new AWS.Credentials("AKIAJLKJGZDPWMQIKWJQ", "JhF195fHpcYBD6pvzziQrj+Ad7NL7comg5bz7iEC", "null");
// // console.log(creds);
// var ses = new AWS.SES({credentials: creds, region: 'eu-west-1'});


// /* The following example sends a formatted email: */

//  var params = {
//   Destination: {
//    BccAddresses: [
//    ], 
//    CcAddresses: [
//       "dominix.sula@gmail.com"
//    ], 
//    ToAddresses: [
//       "dominix.sula@gmail.com"
//    ]
//   }, 
//   Message: {
//    Body: {
//     Html: {
//      Charset: "UTF-8", 
//      Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
//     }, 
//     Text: {
//      Charset: "UTF-8", 
//      Data: "This is the message body in text format."
//     }
//    }, 
//    Subject: {
//     Charset: "UTF-8", 
//     Data: "Test email"
//    }
//   }, 
//   ReplyToAddresses: [
//   ], 
//   ReturnPath: "", 
//   ReturnPathArn: "", 
//   Source: "sender@example.com", 
//   SourceArn: ""
//  };
//  ses.sendEmail(params, function(err, data) {
//    if (err) console.log(err, err.stack); // an error occurred
//    else     console.log(data);           // successful response
//    /*
//    data = {
//     MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
//    }
//    */
//  });


// console.log(ses);

// var params = {
//   Destination: { /* required */
//     BccAddresses: [
//       'dominix.sula@gmail.com'
//       /* more items */
//     ],
//     CcAddresses: [
//       'dominix.sula@gmail.com'
//       /* more items */
//     ],
//     ToAddresses: [
//       'dominix.sula@gmail.com'
//       /* more items */
//     ]
//   },
//   Message: { /* required */
//     Body: { /* required */
//       Html: {
//         Data: 'Test email data. CONTENT', /* required */
//         Charset: ''
//       },
//       Text: {
//         Data: 'Test email data. CONTENT.', /* required */
//         Charset: ''
//       }
//     },
//     Subject: { /* required */
//       Data: 'Message from homepage', /* required */
//       Charset: ''
//     }
//   },
//   Source: 'dominix.sula@gmail.com', /* required */
//   ConfigurationSetName: '',
//   ReplyToAddresses: [
//     'dominix.sula@gmail.com'
//     /* more items */
//   ],
//   ReturnPath: '',
//   ReturnPathArn: '',
//   SourceArn: '',
//   Tags: [
//     {
//       Name: 'Message-from-homepage', /* required */
//       Value: 'Message-from-homepage' /* required */
//     }
//   ]
// };
// ses.sendEmail(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

//--TEST-AWS-SDK-----<