'use strict';

// returns a number between min and max, both inclusive
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var roller = {
  AVAILABLE_FACES: [4, 6, 8, 10, 20, 100],
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 6,
  ROLL_TIME: 1000,
  faces: 20,
  amount: 1,
  isRolling: false,
  boardContainer: $('div.board'),

  rollDice: function (container) {
    if (this.isRolling) { return; }
    this.isRolling = true;
    var result = this._roll();

    var partialsContainer = container.find('ul.partials');
    var self = this;
    this._animateResult(partialsContainer, result, function () {
      self.isRolling = false;
    });
  },

  increaseFaces: function () {
    this._changeFaces(this.AVAILABLE_FACES.indexOf(this.faces) + 1);
  },

  decreaseFaces: function () {
    this._changeFaces(this.AVAILABLE_FACES.indexOf(this.faces) - 1);
  },

  increaseAmount: function () {
    this._changeAmount(this.amount + 1);
  },

  decreaseAmount: function () {
    this._changeAmount(this.amount - 1);
  },

  canIncreaseFaces: function () {
    return (this.AVAILABLE_FACES.indexOf(this.faces) <
            this.AVAILABLE_FACES.length - 1);
  },

  canDecreaseFaces: function () {
    return (this.AVAILABLE_FACES.indexOf(this.faces) > 0);
  },

  canIncreaseAmount: function () {
    return (this.amount < this.MAX_AMOUNT);
  },

  canDecreaseAmount: function () {
    return (this.amount > this.MIN_AMOUNT);
  },

  _animateResult: function (container, result, callback) {
    var partials = [];
    for (var i = 0; i < 10; i++) {
      partials.push(rand(1, this.faces));
    }
    partials.push(result);
    var html = partials.reduce(function (res, x) {
      return res + '<li>' + x + '</li>';
    }, '');

    container.html(html);
    container.css('margin-top', 0);
    setTimeout(function () {
      container.addClass('rolling');
      var offset = container.height() - container.find('li').first().height();
      container.css('margin-top', -offset);

      setTimeout(function () {
        container.removeClass('rolling');
        callback();
      }, 1000);
    }, 50);
  },

  _roll: function () {
    var res = 0;
    for (var i = 0; i < this.amount; i++) {
      res += rand(1, this.faces);
    }
    return res;
  },

  _changeFaces: function (faces) {
    this.faces = this.AVAILABLE_FACES[
      Math.min(Math.max(0, faces), this.AVAILABLE_FACES.length - 1)];
    this._updateDisplay();
  },

  _changeAmount: function (amount) {
    this.amount = Math.min(Math.max(this.MIN_AMOUNT, amount), this.MAX_AMOUNT);
    this._updateDisplay();
  },

  _updateDisplay: function () {
    // update roll button
    $('form.roll input[type=submit]').val(
      'Roll ' + this.amount + 'd' + this.faces);

    // update dice
    this.boardContainer.find('div.die').remove();
    var html = '';
    for (var i = 0; i < this.amount; i++) {
      var classes = 'die f' + this.faces + ' n' + this.amount;
      html += '<div class="' + classes + '">' + this.faces + '</div>';
    }
    this.boardContainer.find('div.dice').prepend(html);
  }
};

// increase faces
$('button.faces.inc').bind('click', function (event) {
  event.preventDefault();
  roller.increaseFaces();
  $(this).attr('disabled', roller.canIncreaseFaces() ? null : '');
  $('button.faces.dec').attr('disabled', null);
});

// decrease faces
$('button.faces.dec').bind('click', function (event) {
  event.preventDefault();
  roller.decreaseFaces();
  $(this).attr('disabled', roller.canDecreaseFaces() ? null : '');
  $('button.faces.inc').attr('disabled', null);
});

// increase amount
$('button.amount.inc').bind('click', function (event) {
  event.preventDefault();
  roller.increaseAmount();
  $(this).attr('disabled', roller.canIncreaseAmount() ? null : '');
  $('button.amount.dec').attr('disabled', null);
});

// decrease amount
$('button.amount.dec').bind('click', function (event) {
  event.preventDefault();
  roller.decreaseAmount();
  $(this).attr('disabled', roller.canDecreaseAmount() ? null : '');
  $('button.amount.inc').attr('disabled', null);
});

// click on 'Roll' button
$('form.roll').bind('submit', function (event) {
  event.preventDefault();
  roller.rollDice($('footer.result'));
});

