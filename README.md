## RSDK-Library

RSDK-Library is a collection of WebAssembly ports of RSDK Engine Decompilations.

## How to use
* File Manager
  * Each engine has their own file system. TODO: finish this

## Known issues
* Uploading files *might* just hang. Uploading can take a while - so give it some time, before trying to reload the page.

## TODO
###### - Give each engines their own IDBFS instance (done)
###### - Prevent engine file nav when file operation is in progress

## Building the website
###### [(You're gonna need node.js for this.)](https://nodejs.org/en/download/package-manager)
##### Simply run these two commands, and you should be good to go -
```
npm install
npm run build
```

##### This project is configured to output as a static site, after you build - it should be in (root)/out.
##### To host it with npx, you can use this command from the root directory -
```
npx serve@latest out
```

##### or [if you'd like to use python](https://www.python.org/downloads/), you can host it by running this command in (root)/(output_dir)
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