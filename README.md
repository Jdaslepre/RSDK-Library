###### If you're looking for the engine source code, [that can be found here.](https://github.com/Jdsle/RSDK-Library-src) 
## RSDK

Website source code for RSDK-Library

## Known issues
* Uploading files *might* just hang. This can be caused by having an insufficient amount of disk space available.

## Building
###### [(You're gonna need node.js for this.)](https://nodejs.org/en/download/package-manager)
##### Simply run this command, and you should be good to go -
```
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

###### TODO (?)
###### - Give each engines their own IDBFS instance