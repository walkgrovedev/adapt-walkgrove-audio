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

    _audioPlaying: false,
    _audioIndexPlaying: -1,
    
    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();
    },

    onPlayClicked: function(event) {
      //audio?
      //if (Adapt.config.get('_sound')._isActive === true) {
        
        var index = $(event.currentTarget).parent().data('index');

        //console.log(this._audioPlaying, this._audioIndexPlaying, index);

        if(this._audioPlaying === true) {
          if(this._audioIndexPlaying !== index) {
            Adapt.trigger('audio:stop');
          }
        } 

        // for( var intItem in this.model.get( '_items' ) ) {
        //   $('#audio-' + intItem + '')[0].pause();
        // }

        // USE CORE AUDIO
        //if(this._audioPlaying === false) {
          this.model.get( '_items' ).forEach((file, item) => {
            if(item === index) {
              if(this._audioIndexPlaying === item) {
                
                if(this._audioPlaying === true) {
                  Adapt.trigger('audio:pause');
                  this._audioPlaying = false;
                  $(event.currentTarget).addClass('paused');
                } else {
                  Adapt.trigger('audio:play');
                  this._audioPlaying = true;
                  $(event.currentTarget).removeClass('paused');
                  console.log("play already: " + this._audioIndexPlaying);
                }

              } else {

                Adapt.trigger('audio:partial', {src: file._mp3});
                this.audio = item;
                $('.audio__btn').removeClass('paused');
                this._audioIndexPlaying = item;
                this._audioPlaying = true;
                console.log("play new: " + this._audioIndexPlaying);

              }
            }
          });
        //}
      //}

      // $('#audio-' + intItem + '')[0].currentTime = 0;
      // $('#audio-' + index + '')[0].play();
      
      // $('#audio-' + index + '')[0].addEventListener('ended', () => {
      //   $('#audio-' + index + '')[0].removeEventListener('ended', () => {});
      // }, false);
      
      this.setItemVisited(index);
    },

    onTranscriptClicked: function(event) {
      var index = $(event.currentTarget).parent().data('index');
      this.$('.audio__widget-transcript').removeClass('is-visible');
      this.setItemVisited(index);
      this.$('.audio__widget-transcript').eq(index).addClass('is-visible');

      this.$('.audio__transcript-content').eq(index).a11y_focus();
    },

    onCloseClicked: function(event) {
      var index = $(event.currentTarget).parent().data('index');
      this.$('.audio__widget-transcript').eq(index).removeClass('is-visible');
      this.$('.js-audio-transcript-click').eq(index).a11y_focus(); //widget-name
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
