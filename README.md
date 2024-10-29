## RSDK-Library

RSDK-Library is a collection of WebAssembly ports of the RSDK Decompilations, by [RSDKModding.](https://github.com/RSDKModding)

## How to use

**Installing the site as a PWA (Progressive Web App)**

Upon visiting the site, you should see an install button appear.

![PWA Installation Prompt](/RepoAssets/ChromeInstallPrompt.png)

When installed, the site will launch in its own window, while appearing as a native application.

![PWA Installed](/RepoAssets/ChromeInstalled.png)
###### "Native." lol

**Starting engines**

The home page contains links to the engines - but they can be accessed directly, via https://jdsle.github.io/RSDK/v{version}. for example, https://jdsle.github.io/RSDK/v5U

> [!IMPORTANT]  
> Don't forget about the files! RSDK-Library does not provide any game assets, so ensure that the engine has the necessary files required to start. (eg, Data.rsdk, Game.wasm)

**Settings**

The settings page currently provides two options -

##### Enable Plus DLC
Allowed per engine licenses, this enables plus on supported engines. Those being RSDkv3, RSDKv4, and RSDKv5/U. Disabled by default.

##### Device Profile
This option changes how the engine behaves. Desktop will act like a PC build of RSDK, Mobile - well, you get it. Desktop by default.
##### *Currently only supported by RSDkv4

## Known issues

Uploading files *might* just hang. Uploading can take a while - so give it some time, before trying to reload the page.

## TODO

Prevent engine file nav when file operation is in progress

## Building the website
###### [(You're gonna need node.js for this.)](https://nodejs.org/en/download/package-manager)
Simply run these two commands, and you should be good to go -
```
npm install
npm run build
```

This project is configured to output as a static site, after you build - it should be in (root)/out.

To host it with npx, you can use this command from the root directory -
```
npx serve@latest out
```

or [if you'd like to use python](https://www.python.org/downloads/), you can host it by running this command in (root)/(output_dir)
```
python -m http.server
```

###### You don't *have* to build it - though! this website is hosted via github pages - [you can find that here :)](https://jdsle.github.io/RSDK)

## Building the engines

Each port has their own build instructions. You can learn how to build them by visiting their repositories:
* [RSDK-Library-v2](https://github.com/Jdsle/RSDK-Library-v2)
* [RSDK-Library-v3](https://github.com/Jdsle/RSDK-Library-v3)
* [RSDK-Library-v4](https://github.com/Jdsle/RSDK-Library-v4)

While not an engine - thought I'd include this here anyways
* [RSDK-Library-FilesModule](https://github.com/Jdsle/RSDK-Library-FilesModule)

## Building RSDKv5(U) Games for the Web
TODO