import {chromaKeyComponent} from './chroma-key'
import {targetVideoControlComponent} from './target-video-control'

AFRAME.registerComponent('chromakey-video', chromaKeyComponent)
AFRAME.registerComponent('target-video-control', targetVideoControlComponent)

// With the open-source engine, image targets are compiled locally with
// @8thwall/image-target-cli and loaded into the engine at startup.
const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/byd-dolphin.json'),
    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)

const setupUi = () => {
  const scene = document.querySelector('a-scene')
  scene.addEventListener('realityready', () => {
    document.getElementById('marker-hint').classList.add('message--show')
  })
}

window.addEventListener('DOMContentLoaded', setupUi)
