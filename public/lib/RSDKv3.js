// Defined for Emscripten.js to call
function RSDK_Init()
{
    // TODO: Custom FS Path, settings
    FS.chdir('/FileSystem/RSDKv3')

    // value, index
    // index 0 - plus
    _RSDK_Configure(0, 0);
    _RSDK_Initialize();
}