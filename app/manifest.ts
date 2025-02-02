import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RSDK',
    short_name: 'RSDK',
    start_url: '.',
    theme_color: "#161616",
    display: 'standalone',
    display_override: ["window-controls-overlay"],
    icons: [
      {
        "src": "./icons/RSDK.png",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": "./icons/RSDK_Maskable_256.png",
        "sizes": "256x256",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "./icons/RSDK_Maskable_128.png",
        "sizes": "128x128",
        "type": "image/png",
        "purpose": "maskable"
      }
    ]
  }
}
