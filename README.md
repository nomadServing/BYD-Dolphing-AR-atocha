# BYD Atocha AR — Image Target + Chromakey

Experiencia WebAR self-hosted construida sobre el motor open source de [8th Wall](https://8thwall.org). La cámara trackea un marcador impreso y superpone un vídeo con chroma verde, eliminado en tiempo real con el shader chromakey oficial de 8th Wall.

## Stack

- **Engine binario de 8th Wall** (`external/xr/`) — tracking de image targets (SLAM chunk). Self-hosted, sin appKey ni Console.
- **8frame 1.5.0** (`external/scripts/`) — build de A-Frame de 8th Wall.
- **XR Extras + Landing Page** (`external/xrextras/`, `external/landing-page/`) — loading screen, gestión de errores, fallback desktop.
- **Shader chromakey** (`src/shaders.js`) — del ejemplo oficial [`fine-tuned-chromakey`](https://github.com/8thwall/archive/tree/main/apps/examples/fine-tuned-chromakey) de 8th Wall, con parámetros `similarity`, `smoothness` y `spill`.

## Desarrollo

```bash
npm install
npm run serve   # dev server en localhost
npm run build   # build de producción en dist/
```

Para probar en móvil hace falta HTTPS (la cámara solo funciona en secure context). Opciones: [instrucciones oficiales](https://8th.io/test-on-mobile), `ngrok`, o un dev server con certificado.

## Cambiar el marcador

Los image targets se compilan en local con el CLI oficial (ya no se suben a la Console):

```bash
npx @8thwall/image-target-cli@latest
```

1. Guarda la imagen original en `targets/`.
2. Ejecuta el CLI: imagen → tipo `flat` → crop por defecto → carpeta de salida `./image-targets` → nombre del target.
3. Actualiza el `require()` en `src/app.js` y el atributo `name` de `<xrextras-named-image-target>` y de `target-video-control` en `src/index.html` (debe coincidir con el campo `name` del JSON).

## Cambiar el vídeo chroma

Sustituye `src/assets/chroma-video.mp4`. Ajusta en `src/index.html`:

- `chromakey-video="color: #48ff00"` — color del chroma del vídeo.
- `similarity`, `smoothness`, `spill` — fino del recorte.
- `geometry="height: 1.6; width: 1.6"` — tamaño del plano respecto al marcador (el marcador mide 1 unidad de alto).
- `position` del `<a-entity>` hijo — offset respecto al centro del marcador.

## Licencias

- El binario del engine (`external/xr/`) es gratuito (también para uso comercial) bajo la [XR Engine License](https://github.com/8thwall/engine/blob/main/LICENSE). Debe incluirse sin modificar, con su copyright visible.
- El resto (xrextras, shader chromakey, CLI) es MIT.

alex
