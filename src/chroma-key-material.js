/**
 * THREE.js ShaderMaterial that removes a specified color (e.g. green screen)
 * from a video texture. Based on 8th Wall's "fine-tuned-chromakey" example.
 */
import {VERTEX_SHADER, FRAGMENT_SHADER} from './shaders'

class ChromaKeyMaterial extends THREE.ShaderMaterial {
  /**
   * @param {HTMLVideoElement} video Video element to use as the material texture
   * @param {string|number} keyColor Color to key out
   * @param {number} similarity
   * @param {number} smoothness
   * @param {number} spill
   */
  constructor(video, keyColor, similarity = 0.16, smoothness = 0.08, spill = 0.21) {
    super()

    this.video = video
    this.texture = new THREE.VideoTexture(this.video)

    // Keep video colors accurate when the renderer uses color management
    if ('colorSpace' in this.texture && THREE.SRGBColorSpace) {
      this.texture.colorSpace = THREE.SRGBColorSpace
    } else if ('encoding' in this.texture && THREE.sRGBEncoding) {
      this.texture.encoding = THREE.sRGBEncoding
    }

    const chromaKeyColor = new THREE.Color(keyColor)

    this.setValues({
      uniforms: {
        tex: {value: this.texture},
        keyColor: {value: chromaKeyColor},
        similarity: {value: similarity},
        smoothness: {value: smoothness},
        spill: {value: spill},
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
    })
  }
}

export {ChromaKeyMaterial}
