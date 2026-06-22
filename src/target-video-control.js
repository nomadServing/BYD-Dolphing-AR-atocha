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

    // iOS only allows programmatic playback for muted, inline videos. Force
    // these as properties (not just attributes) so the engine-triggered
    // play() inside onFound is not blocked by the autoplay policy.
    video.muted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    // Prime playback on the first user gesture (the same tap that grants the
    // camera/landing page), so iOS treats later play() calls as allowed.
    const prime = () => {
      video.play().then(() => video.pause()).catch(() => {})
    }
    window.addEventListener('touchend', prime, {once: true})
    window.addEventListener('click', prime, {once: true})

    // play() returns a promise that can reject (NotAllowedError, video not
    // ready, etc.). Swallow it so it never bubbles up as an uncaught runtime
    // error and triggers the 8th Wall error overlay.
    const safePlay = () => {
      const playPromise = video.play()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {})
      }
    }

    const onFound = ({detail}) => {
      if (detail.name !== name) {
        return
      }
      safePlay()
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
