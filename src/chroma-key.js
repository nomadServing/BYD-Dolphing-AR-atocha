import {ChromaKeyMaterial} from './chroma-key-material'

/**
 * A-Frame component that applies the 8th Wall chromakey shader to the
 * entity's mesh, using a <video> element as the texture source.
 *
 * Usage:
 *   <a-entity geometry="primitive: plane" chromakey-video="src: #my-video; color: #48ff00"></a-entity>
 */
const chromaKeyComponent = {
  schema: {
    'src': {type: 'string'},
    'color': {type: 'color', default: '#48ff00'},
    'similarity': {default: 0.16},
    'smoothness': {default: 0.08},
    'spill': {default: 0.21},
  },
  init() {
    const {src, color, similarity, smoothness, spill} = this.data

    const video = document.querySelector(src)
    if (!video) {
      console.error(`chromakey-video: no video element found for selector "${src}"`)
      return
    }

    this.material = new ChromaKeyMaterial(video, color, similarity, smoothness, spill)

    const applyMaterial = () => {
      const mesh = this.el.getObject3D('mesh')
      if (mesh) {
        mesh.material = this.material
      }
    }

    applyMaterial()
    // Geometry may not exist yet when the component initializes
    this.el.addEventListener('object3dset', (e) => {
      if (e.detail.type === 'mesh') {
        applyMaterial()
      }
    })

    this.tick = () => {
      if (this.material?.texture && video.readyState >= 2) {
        this.material.texture.needsUpdate = true
      }
    }
  },
  update() {
    if (!this.material) {
      return
    }
    const {uniforms} = this.material
    const hex = this.data.color.replace('#', '')
    uniforms.keyColor.value.set(
      parseInt(hex.substring(0, 2), 16) / 255,
      parseInt(hex.substring(2, 4), 16) / 255,
      parseInt(hex.substring(4, 6), 16) / 255
    )
    uniforms.similarity.value = this.data.similarity
    uniforms.smoothness.value = this.data.smoothness
    uniforms.spill.value = this.data.spill
  },
}

export {chromaKeyComponent}
