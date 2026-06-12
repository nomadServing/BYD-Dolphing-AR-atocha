/**
 * Plays/pauses a video when an image target is found/lost, and toggles
 * UI hints. Place it on an entity inside <xrextras-named-image-target>.
 *
 * Usage:
 *   <a-entity target-video-control="name: my-target; video: #my-video"></a-entity>
 */
const targetVideoControlComponent = {
  schema: {
    'name': {type: 'string'},
    'video': {type: 'string'},
  },
  init() {
    const {name} = this.data
    const video = document.querySelector(this.data.video)
    const hint = document.getElementById('marker-hint')

    const onFound = ({detail}) => {
      if (detail.name !== name) {
        return
      }
      video.play()
      if (hint) {
        hint.classList.remove('message--show')
      }
    }

    const onLost = ({detail}) => {
      if (detail.name !== name) {
        return
      }
      video.pause()
      if (hint) {
        hint.classList.add('message--show')
      }
    }

    this.el.sceneEl.addEventListener('xrimagefound', onFound)
    this.el.sceneEl.addEventListener('xrimagelost', onLost)
  },
}

export {targetVideoControlComponent}
