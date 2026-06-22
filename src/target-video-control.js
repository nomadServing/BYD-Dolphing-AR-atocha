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

    if (!video) {
      return
    }

    // iOS only allows programmatic playback for muted, inline videos.
    video.muted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.preload = 'auto'
    video.load()

    let frameDecoded = false

    const decodeFirstFrame = () => {
      if (frameDecoded || video.readyState < 2) {
        return Promise.resolve()
      }
      return video.play().then(() => new Promise((resolve) => {
        requestAnimationFrame(() => {
          video.pause()
          video.currentTime = 0
          frameDecoded = true
          resolve()
        })
      })).catch(() => {})
    }

    const whenCanPlay = (fn) => {
      if (video.readyState >= 2) {
        fn()
        return
      }
      video.addEventListener('canplay', fn, {once: true})
    }

    // Prime on first user gesture so iOS allows later play() calls.
    const prime = () => whenCanPlay(() => decodeFirstFrame())
    window.addEventListener('touchend', prime, {once: true})
    window.addEventListener('click', prime, {once: true})

    // After AR starts (post landing-page tap), buffer and decode frame 0.
    this.el.sceneEl.addEventListener('realityready', () => {
      whenCanPlay(() => decodeFirstFrame())
    })

    const safePlay = () => {
      const play = () => {
        const playPromise = video.play()
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {})
        }
      }

      if (video.readyState >= 2) {
        play()
        return
      }

      video.addEventListener('canplay', play, {once: true})
    }

    const onFound = ({detail}) => {
      if (detail.name !== name) {
        return
      }
      whenCanPlay(() => {
        decodeFirstFrame().then(safePlay)
      })
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
