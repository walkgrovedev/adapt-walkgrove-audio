define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var AudioView = ComponentView.extend({

    events: {
      'click .js-audio-play-click': 'onPlayClicked',
      'click .js-audio-transcript-click': 'onTranscriptClicked',
      'click .js-audio-transcript-close-click': 'onCloseClicked'
    },
    
    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();
    },

    onPlayClicked: function(event) {
      console.log("play audio: " + $(event.currentTarget).parent().data('index'));

      for( var intItem in this.model.get( '_items' ) ) {
        $('#audio-' + intItem + '')[0].pause();
      }

      var index = $(event.currentTarget).parent().data('index');
      $('#audio-' + intItem + '')[0].currentTime = 0;
      $('#audio-' + index + '')[0].play();
      
      this.setItemVisited(index);
    },

    onTranscriptClicked: function(event) {
      var index = $(event.currentTarget).parent().data('index');
      this.$('.audio__widget-transcript').removeClass('is-visible');
      this.setItemVisited(index);
      this.$('.audio__widget-transcript').eq(index).addClass('is-visible');
    },

    onCloseClicked: function(event) {
      var index = $(event.currentTarget).parent().data('index');
      this.$('.audio__widget-transcript').eq(index).removeClass('is-visible');
    },

    setItemVisited: function(index) {
      this.$('.audio__widget').eq(index).addClass('is-visited');
      this.checkAllItemsCompleted();
    },

    checkAllItemsCompleted: function() {
      var complete = false;
      if(this.$('.audio__widget').length === this.$('.is-visited').length){
        complete = true;
      }
      if(complete) {
        this.setCompletionStatus();
      }
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }
  },
  {
    template: 'audio'
  });

  return Adapt.register('audio', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: AudioView
  });
});
