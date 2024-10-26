// Defined for Emscripten.js to call
function RSDK_Init()
{
    // TODO: Custom FS Path
    FS.chdir('/FileSystem/RSDKv2')
    _RSDK_Initialize();
}