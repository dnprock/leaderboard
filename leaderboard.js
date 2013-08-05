// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    //'click input.inc5': function () {
    //  Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    //},
    'click input.inc10': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 10}});
    },
  });
  
  Meteor.startup(function () {
    $(document).ready(function() {
      jQuery.expr[':'].regex = function(elem, index, match) {
          var matchParams = match[3].split(','),
              validLabels = /^(data|css):/,
              attr = {
                  method: matchParams[0].match(validLabels) ? 
                              matchParams[0].split(':')[0] : 'attr',
                  property: matchParams.shift().replace(validLabels,'')
              },
              regexFlags = 'ig',
              regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
          return regex.test(jQuery(elem)[attr.method](attr.property));
      }
      
      $("input:regex(class, inc*)").click(function(e) {
        var tag = $(e.currentTarget);
        var tagData = { 'name':tag.prop("tagName"), 'class':tag.attr("class"),
                      'id':tag.attr("id"), 'value':tag.attr("value") };
        console.log(tagData);
        _gaq.push(['_trackEvent', 'click', 'star', JSON.stringify(tagData)]);
      });
    });
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
