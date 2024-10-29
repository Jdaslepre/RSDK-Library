# RSDK-Library

**RSDK-Library** is a collection of WebAssembly ports of the [RSDKModding](https://github.com/RSDKModding) Decompilations.

## How to Use

### Installing the Site as a PWA (Progressive Web App)

Upon visiting the site, you should see an install button appear.

![PWA Installation Prompt](/RepoAssets/ChromeInstallPrompt.png)

When installed, the site will launch in its own window, appearing as a native application.

![PWA Installed](/RepoAssets/ChromeInstalled.png)

###### "Native." lol

---

### Starting Engines

The home page contains links to the engines, but they can also be accessed directly via:

`https://jdsle.github.io/RSDK/v{version}`

For example: [https://jdsle.github.io/RSDK/v5U](https://jdsle.github.io/RSDK/v5U)

> [!IMPORTANT]  
> RSDK-Library does not provide any game assets. Ensure the engine has the necessary files required to start (e.g., `Data.rsdk`, `Game.wasm`).

### Settings

The settings page currently provides two options:

- **Enable Plus DLC:** Enables Plus DLC on supported engines (v3, v4, and v5/U). Disabled by default.
- **Device Profile:** Changes how the engine behaves. Desktop will act like a PC build of RSDK, Mobile - well, you get it. Desktop by default.

### Known Issues

- **File Uploading:** Uploading files *might* hang. Give it some time before trying to reload the page.
- **Touch Coordinates:** Touch may be inaccurate if the canvas does not fill the screen.
- **iOS Browsers:** The engine may freeze when hiding the toolbar.

## Building the Website

> [You're gonna need node.js for this.](https://nodejs.org/en/download/package-manager)

Run the following commands to build the site:

```bash
npm install
npm run build
```

This will output a static site, located at (root)/out.

### Hosting the website with npx

Run this command in the repository root:
```bash
npx serve@latest out
```

### Hosting the website with python

Run this command in (repo root)/out.
```
python -m http.server
```

## Building the engines

Each port has their own build instructions. You can learn how to build them by visiting their repositories:
* [RSDK-Library-v2](https://github.com/Jdsle/RSDK-Library-v2)
* [RSDK-Library-v3](https://github.com/Jdsle/RSDK-Library-v3)
* [RSDK-Library-v4](https://github.com/Jdsle/RSDK-Library-v4)

While not an engine - thought I'd include this here anyways
* [RSDK-Library-FilesModule](https://github.com/Jdsle/RSDK-Library-FilesModule)

## Building RSDKv5(U) Games for the Web

TODO