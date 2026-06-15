// Chromakey shaders used by 8th Wall's "fine-tuned-chromakey" example.
// @see https://github.com/8thwall/archive/tree/main/apps/examples/fine-tuned-chromakey
// @see https://discourse.threejs.org/t/production-ready-green-screen-with-three-js/23113/2

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const FRAGMENT_SHADER = `
uniform sampler2D tex;

uniform vec3 keyColor;
uniform float similarity;
uniform float smoothness;
uniform float spill;

varying vec2 vUv;

// From https://github.com/libretro/glsl-shaders/blob/master/nnedi3/shaders/rgb-to-yuv.glsl
vec2 RGBtoUV(vec3 rgb) {
  return vec2(
    rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.5    + 0.5,
    rgb.r *  0.5   + rgb.g * -0.419 + rgb.b * -0.081  + 0.5
  );
}

vec4 ProcessChromaKey(vec2 texCoord) {
  vec4 rgba = texture2D(tex, texCoord);
  float chromaDist = distance(RGBtoUV(rgba.rgb), RGBtoUV(keyColor));

  // Luminance of the pixel (Rec.709)
  float luma = dot(rgba.rgb, vec3(0.2126, 0.7152, 0.0722));

  // Protect dark pixels: below this luminance threshold the chroma signal
  // is unreliable (compression noise / chroma bleed), so we fade the key out.
  float lumaProtect = smoothstep(0.06, 0.18, luma);

  float baseMask = chromaDist - similarity;
  float fullMask = pow(clamp(baseMask / smoothness, 0., 1.), 1.5);

  // Blend: dark pixels always stay opaque (lumaProtect → 0 means keep alpha = 1)
  rgba.a = mix(1.0, fullMask, lumaProtect);

  float spillVal = pow(clamp(baseMask / spill, 0., 1.), 1.5);
  float desat = clamp(luma, 0., 1.);
  rgba.rgb = mix(vec3(desat, desat, desat), rgba.rgb, spillVal);

  return rgba;
}

void main(void) {
  vec2 texCoord = vUv;
  gl_FragColor = ProcessChromaKey(texCoord);
}
`

export {VERTEX_SHADER, FRAGMENT_SHADER}
