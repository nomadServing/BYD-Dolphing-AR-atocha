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

    // Do NOT assign sRGB colorSpace here: the chroma-key shader operates in
    // raw sRGB values directly. Marking the texture as SRGBColorSpace would
    // cause the GPU to linearize samples, creating a mismatch with keyColor.
    this.texture.colorSpace = THREE.LinearSRGBColorSpace || ''

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
