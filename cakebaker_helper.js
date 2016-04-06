'use strict';
module.change_code = 1;

function CakeBakerHelper(obj) {
  this.started = false;
  this.currentStep = 0;
  this.steps = [
    {
      prompt: 'Lets bake a cake. When you are ready say next.'
    },
    {
      prompt: 'Preheat the oven to 350 degrees F.'
    },
    {
      prompt: 'Butter 2 9-inch round cake pans and dust the pans with flour, tapping out the excess.'
    },
    {
      prompt: 'Whisk 3 cups flour, the baking powder and salt in a bowl until combined.'
    },
    {
      prompt: 'Beat 2 sticks butter and 1 and 1/2 cups sugar in a large bowl with a mixer on medium-high speed until light and fluffy, about 3 minutes.'
    },
    {
      prompt: 'Reduce the mixer speed to medium; beat in the eggs, one at a time, scraping down the bowl as needed. '
    },
    {
      prompt: 'Beat in the 1 tablespoon of vanilla.'
    },
    {
      prompt: 'Mix 1/2 cup water with the cream in a liquid measuring cup or bowl. '
    },
    {
      prompt: 'Beat the flour mixture into the butter mixture in 3 batches, alternating with the cream mixture, beginning and ending with flour, until just smooth.'
    },
    {
      prompt: 'Divide the batter between the prepared pans.'
    },
    {
      prompt: 'Bake until the cakes are lightly golden on top and the centers spring back when pressed, 25 to 30 minutes.'
    },
    {
      prompt: 'Let cool 10 minutes'
    },
    {
      prompt: 'Congratulations! You\'ve baked a cake! Now, you may eat it!'
    }
  ];

  for (var prop in obj) this[prop] = obj[prop];
}

CakeBakerHelper.prototype.completed = function() {
  return this.currentStep === (this.steps.length - 1);
};

CakeBakerHelper.prototype.getPrompt = function() {
  return this.getStep().prompt;
};

CakeBakerHelper.prototype.getStep = function() {
  return this.steps[this.currentStep];
};

module.exports = CakeBakerHelper;
