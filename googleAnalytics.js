if (Meteor.isClient) {
  Template.googleAnalytics.rendered = function() {
      new GA();
  }
 
  GA = function(){
    if (window._gaq) return;
    window._gaq = window._gaq || [];
    _gaq.push(['_setAccount', 'UA-42923639-1']);
    _gaq.push(['_setDomainName', 'meteor.com']);
    _gaq.push(['_trackPageview']);
    
    _gaq.push(['_trackEvent', 'page', 'load', 'page loaded']);

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  };
}