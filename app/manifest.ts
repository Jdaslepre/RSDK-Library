import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RSDK-Library',
    short_name: 'RSDK',
    start_url: '.',
    theme_color: "#231F20",
    display: 'standalone',
    display_override: ["window-controls-overlay"],
    icons: [
      {
        "src": "./icons/RSDK.png",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": ".icons/RSDK_Maskable.png",
        "sizes": "128x128",
        "type": "image/png",
        "purpose": "maskable"
      }
    ]
  }
}