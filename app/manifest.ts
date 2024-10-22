import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RSDK-Library',
    short_name: 'RSDK',
    start_url: '/RSDK',
    display: 'standalone',
    display_override: ["window-controls-overlay"],
    icons: [
        {
          "src": "./assets/RSDK.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
  }
}