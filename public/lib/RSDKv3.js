// Defined for Emscripten.js to call
function RSDK_Init() {
    // TODO: Custom FS Path
    FS.chdir('/FileSystem/RSDKv3');

    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);

        // value, index
        // index 0 - plus
        _RSDK_Configure(settings.enablePlus, 0);
    }

    _RSDK_Initialize();
}