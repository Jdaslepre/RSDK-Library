# RSDK-Library

**RSDK-Library** is a collection of WebAssembly ports of the [RSDKModding](https://github.com/RSDKModding) Decompilations.

## How to Use

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

## Known Issues

- Uploading files *might* hang. Give it some time before trying to reload the page
- Touch coordinates may be inaccurate if the canvas does not fill the screen
- On iOS, engines might freeze when hiding the toolbar on safari
- RSDKv5: Native ModAPI probably won't work. Fine for legacy games though

## Building the Website

> [You're gonna need node.js for this.](https://nodejs.org/en/download/package-manager)

Run the following commands to build the site:

```bash
npm install
npm run build
```

This will output a static site, located at (root)/out.

### Hosting the website locally

Run this command in the repository root:
```bash
npx serve@latest out
```

## Building the engines

Each port has their own build instructions. You can learn how to build them by visiting their repositories:
* [RSDKv2-Decompilation](https://github.com/Jdsle/RSDKv2-Decompilation/tree/web)
* [RSDKv3-Decompilation](https://github.com/Jdsle/RSDKv3-Decompilation/tree/web)
* [RSDKv4-Decompilation](https://github.com/Jdsle/RSDKv4-Decompilation/tree/web)

While not an engine - thought I'd include this here anyways
* [RSDK-Library-FilesModule](https://github.com/Jdsle/RSDK-Library-FilesModule)

## Building RSDKv5(U) Games/Mods for the Web

> [!NOTE]  
> Don't actually follow this, *yet* at least. While these instructions do work for Sonic Mania, they probably won't work for any mod. Might write a script for this or something

Pretty simple to do - first, in the same directory as the projects' `CMakeLists.txt`, make a new file called `RSDK-Library-GameAPI.cmake`, with its contents being:

```cmake
set(WITH_RSDK OFF)
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fPIC -O3")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC -O3")

add_executable(${GAME_NAME} ${GAME_SOURCES})

set_target_properties(${GAME_NAME} PROPERTIES
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED ON
)

set(emsc_link_options
    -sTOTAL_MEMORY=32MB
    -sALLOW_MEMORY_GROWTH=1
    -sWASM=1
    -sLINKABLE=1
    -sEXPORT_ALL=1
    -sSIDE_MODULE=2
    -sSINGLE_FILE=1
    -sBINARYEN_ASYNC_COMPILATION=0
    -sUSE_PTHREADS=1
    -sPTHREAD_POOL_SIZE=4
    -pthread
    -g
)

target_link_options(${GAME_NAME} PRIVATE ${emsc_link_options})

set_target_properties(${GAME_NAME} PROPERTIES
    SUFFIX ".wasm"
)
```
Then, locate the projects' `CMakeLists.txt`, and then find where it declares the game as a library (add_library). For example, this is what it'll look like in Sonic Mania:

```cmake
if(GAME_STATIC)
    add_library(${GAME_NAME} STATIC ${GAME_SOURCES})
else()
    add_library(${GAME_NAME} SHARED ${GAME_SOURCES})
endif()
```

We don't want this to run, so we will modify it as such, to use our custom `RSDK-Library-GameAPI.cmake` file

```cmake
if(EMSCRIPTEN)
    include(RSDK-Library-GameAPI.cmake)
else()
    if(GAME_STATIC)
        add_library(${GAME_NAME} STATIC ${GAME_SOURCES})
    else()
        add_library(${GAME_NAME} SHARED ${GAME_SOURCES})
    endif()
endif()
```

After that? you're pretty much good to go, just run these commands to compile the project:

```bash
emcmake cmake -B build
cmake --build build
```