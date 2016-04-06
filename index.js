'use strict';
module.change_code = 1;
var _ = require('lodash');
var Skill = require('alexa-app');
var CAKE_BAKER_SESSION_KEY = 'cake_baker';
var skillService = new Skill.app('cakebaker');
var CakeBakerHelper = require('./cakebaker_helper');
var DatabaseHelper = require('./database_helper');
var databaseHelper = new DatabaseHelper();

skillService.pre = function(request, response, type) {
  databaseHelper.createCakeBakerTable();
};
var getCakeBakerHelper = function(cakeBakerHelperData) {
  if (cakeBakerHelperData === undefined) {
    cakeBakerHelperData = {};
  }
  return new CakeBakerHelper(cakeBakerHelperData);
};
var getCakeBakerHelperFromRequest = function(request) {
  var cakeBakerHelperData = request.session(CAKE_BAKER_SESSION_KEY);
  return getCakeBakerHelper(cakeBakerHelperData);
};

var cakeBakerIntentFunction = function(cakeBakerHelper, request, response) {
  console.log(cakeBakerHelper);
  if (cakeBakerHelper.completed()) {
    response.say('Congratulations! Your cake is complete!');
    response.shouldEndSession(true);
  } else {
    response.say(cakeBakerHelper.getPrompt());
    response.reprompt("I didnt hear you. " + cakeBakerHelper.getPrompt());
    response.shouldEndSession(false);
  }
  response.session(CAKE_BAKER_SESSION_KEY, cakeBakerHelper);
  response.send();
};

skillService.intent('advanceStepIntent', {
    'utterances': ['{next|advance|continue}']
  },
  function(request, response) {
    var cakeBakerHelper = getCakeBakerHelperFromRequest(request);
    cakeBakerHelper.currentStep++;
    cakeBakerIntentFunction(cakeBakerHelper, request, response);
  }
);

skillService.intent('repeatStepIntent', {
    'utterances': ['{repeat}']
  },
  function(request, response) {
    var cakeBakerHelper = getCakeBakerHelperFromRequest(request);
    cakeBakerIntentFunction(cakeBakerHelper, request, response);
  }
);

skillService.launch(function(request, response) {
  var prompt = 'Welcome to Cakebaker!' +
    'To start baking, say bake a cake';
  response.say(prompt).shouldEndSession(false);
});

skillService.intent('cakeBakeIntent', {
    'utterances': ['{new|start|create|begin|build} {|a|the} cake']
  },
  function(request, response) {
    var cakeBakerHelper = new CakeBakerHelper({});
    cakeBakerIntentFunction(cakeBakerHelper, request, response);
  }
);

skillService.intent('loadCakeIntent', {
    'utterances': ['{load|resume} {|a|the} {|last} cake']
  },
  function(request, response) {
    var userId = request.userId;
    databaseHelper.readCakeBakerData(userId).then(function(result) {
      return (result === undefined ? {} : JSON.parse(result['data']));
    }).then(function(loadedCakeBakerData) {
      var cakeBakerHelper = new CakeBakerHelper(loadedCakeBakerData);
      return cakeBakerIntentFunction(cakeBakerHelper, request, response);
    });
    return false;
  }
);

skillService.intent('saveCakeIntent', {
    'utterances': ['{save} {|a|the|my} cake']
  },
  function(request, response) {
    var cakeBakerHelper = getCakeBakerHelperFromRequest(request);
    saveCake(cakeBakerHelper, request);
    response.say('Your cake progress has been saved!');
    response.shouldEndSession(true).send();
    return false;
  }
);

var saveCake = function(cakeBakerHelper, request) {
  var userId = request.userId;
  databaseHelper.storeCakeBakerData(userId, JSON.stringify(
      cakeBakerHelper))
    .then(function(result) {
      return result;
    }).catch(function(error) {
      console.log(error);
    });
};

module.exports = skillService;
