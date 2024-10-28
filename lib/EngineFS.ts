// ---------------
// Library Imports
// ---------------

import { PathLike } from 'fs';
import JSZip from 'jszip';

// ------------------
// Global Definitions
// ------------------

declare const FS: any;
declare const PATH: any;
declare const IDBFS: any;

// ---------------------
// Component Definitions
// ---------------------

export type FileItem = {
    id?: number;
    name: string;
    path: string;
    content?: Uint8Array | null;
    isDirectory: boolean;
};

class EngineFS {

    // --------------------
    // Variable Definitions
    // --------------------

    private static activeMount: string | null = null;

    public static fspath: string = "//FileSystem";

    private static clipboard: { items: FileItem[], isCut: boolean } | null = null;
    public static actionInProgress: boolean = false;
    public static actionProgress: number = 0;

    // --------------------
    // Function Definitions
    // --------------------

    public static async Init(id: string) {
        return new Promise<void>(async (resolve, reject) => {
            if (EngineFS.activeMount) {
                await EngineFS.Unmount(EngineFS.activeMount);
            }
            if (!FS.analyzePath(`/${id}`).exists)
                FS.mkdir(id);
            FS.mount(IDBFS, { root: `/${id}` }, id);
            await EngineFS.SyncInit();
            EngineFS.activeMount = id;
            EngineFS.fspath = `/${id}`
            resolve();
        });
    }

    private static async Unmount(id: string) {
        return new Promise<void>((resolve) => {
            FS.unmount(id);
            if (EngineFS.activeMount === id) {
                EngineFS.activeMount = null;
            }
            resolve();
        });
    }

    private static async SyncInit() {
        return new Promise<void>((resolve, reject) => {
            FS.syncfs(true, function (error: any) {
                if (error) {
                    EngineFS.AlertError(`EngineFS.SyncInit Error: ${error}`);
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public static async Save() {
        return new Promise<void>((resolve, reject) => {
            FS.syncfs(function (error: any) {
                if (error) {
                    EngineFS.AlertError(`EngineFS.Save Error: ${error}`);
                    reject(error);
                } else {
                    console.log('Synchronized FS');
                    resolve();
                }
            });
        });
    }

    public static AlertError(msg: string) {
        alert(msg);
        console.error(msg);
    }

    public static async FileUpload() {
        return EngineFS.FileUploadDlg((files) => EngineFS.FileUploadCommon(files));
    }

    public static async DropFileUpload(files: File[]) {
        return EngineFS.FileUploadCommon(files);
    }

    private static async FileUploadDlg(callback: (files: FileList) => Promise<void>) {
        return new Promise<void>((resolve, reject) => {
            const _input = document.createElement('input');
            _input.type = 'file';
            _input.multiple = true;
            _input.onchange = async () => {
                if (!_input.files || !_input.files.length) {
                    console.warn('EngineFS.FileUpload: No files selected for upload');
                    reject();
                    return;
                }
                try {
                    await callback(_input.files);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            _input.click();
        });
    }

    private static async FileUploadCommon(files: FileList | File[]) {
        EngineFS.actionInProgress = true;
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const filePath = `${EngineFS.fspath}/${file.name}`;
                if (file.name.toLowerCase().endsWith('.zip')) {
                    await EngineFS.DoZipExtract(file);
                } else {
                    await EngineFS.DoFileWrite(file, filePath);
                }
                EngineFS.actionProgress = Math.round(((i + 1) / files.length) * 100);
                console.log(`Upload Progress: ${EngineFS.actionProgress}%`);
            }
            await EngineFS.Save();
        } finally {
            EngineFS.actionInProgress = false;
        }
    }

    private static async DoZipExtract(file: File) {
        try {
            await EngineFS.ZipExtract(file, EngineFS.fspath);
        } catch (error) {
            EngineFS.AlertError(`EngineFS.DoZipExtract Zip Error: ${error}`);
            throw error;
        }
    }

    private static async DoFileWrite(file: File, filePath: string) {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    FS.writeFile(filePath, new Uint8Array(await file.arrayBuffer()), { encoding: 'binary' });
                    resolve();
                } catch (error) {
                    EngineFS.AlertError(`EngineFS.DoFileWrite Error: ${error}`);
                    reject(error);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    public static async FileDownload(paths: string[]) {
        try {
            const zip = new JSZip();
            const ZipFile = async (path: string, zipPath: string) => {
                if (!FS.lookupPath(path).node) {
                    console.warn(`Tried to add ${path} to zip for export. Doesn't exist!`);
                    return;
                }
                if (await EngineFS.DirectoryCheck(path)) {
                    const files = FS.readdir(path);
                    for (const file of files) {
                        // these are invalid
                        if (file === '.' || file === '..') continue;
                        const filePath = `${path}/${file}`;
                        const zipFilePath = `${zipPath}/${file}`;
                        await ZipFile(filePath, zipFilePath);
                    }
                } else {
                    const fileData = FS.readFile(path);
                    zip.file(zipPath, fileData);
                }
            };
            for (const i of paths) {
                await ZipFile(i, i.split('/').pop()!);
            }
            const content = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'export.zip';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }, 100);
        } catch (error) {
            EngineFS.AlertError(`EngineFS.FileDownload Error: ${error}`);
            throw error;
        }
    }

    public static async DirectoryCheck(path: PathLike) {
        const mode = FS.lookupPath(path).node.mode;
        return FS.isDir(mode);
    }

    public static async DirectoryCreate(name: PathLike) {
        try {
            const dstPath: PathLike = `${EngineFS.fspath}/${name}`;
            FS.mkdir(dstPath);
            await EngineFS.Save();
            console.log(`EngineFS.DirectoryCreate: Created ${dstPath}`);
        } catch (error) {
            EngineFS.AlertError(`EngineFS.DirectoryCreate Error: ${error}`);
            throw error;
        }
    }

    public static async Cut(items: FileItem[]) { EngineFS.clipboard = { items, isCut: true }; }
    public static async Copy(items: FileItem[]) { EngineFS.clipboard = { items, isCut: false }; }
    public static async Paste() {
        if (!EngineFS.clipboard) {
            console.warn('Clipboard is empty. No items to paste.');
            return;
        }
        const { items, isCut } = EngineFS.clipboard;
        const pastePromises = items.map(async (item) => {
            const oldPath = item.path;
            const newPath = `${EngineFS.fspath}/${item.name}`;
            console.log(`Attempting to paste ${isCut ? 'move' : 'copy'}: ${oldPath} -> ${newPath}`);
            EngineFS.actionInProgress = true;
            try {
                if (!FS.lookupPath(oldPath).node) {
                    EngineFS.AlertError(`EngineFS.Paste: Source path does not exist.`);
                    EngineFS.actionInProgress = false;
                    return;
                }
                if (isCut) {
                    FS.rename(oldPath, newPath);
                    console.log(`Moved ${oldPath} to ${newPath}`);
                } else {
                    await EngineFS.ItemDoCopy(item, oldPath, newPath);
                }
            } catch (error) {
                EngineFS.AlertError(`EngineFS.Paste Error: ${error}`);
                EngineFS.actionInProgress = false;
            }
        });
        await Promise.all(pastePromises);
        await EngineFS.Save();
        EngineFS.actionInProgress = false;
        EngineFS.clipboard = null;
    }

    public static async Rename(srcName: string, dstName: string) {
        try {
            const srcPath = `${EngineFS.fspath}/${srcName}`;
            const dstPath = `${EngineFS.fspath}/${dstName}`;
            if (!FS.lookupPath(srcPath).node) {
                throw new Error(`Item "${srcName}" does not exist.`);
            }
            FS.rename(srcPath, dstPath);
            await EngineFS.Save();
        } catch (error) {
            EngineFS.AlertError(`EngineFS.Rename Error: ${error}`);
            throw error;
        }
    }

    public static async Delete(names: string[]) {
        try {
            if (!window.confirm(`Are you sure you want to delete the selected items? This action is irreversible.`)) {
                return;
            }
            for (const i of names) {
                const path = `${EngineFS.fspath}/${i}`;
                if (!FS.lookupPath(path).node) {
                    console.warn(`Tried to delete "${i}" - which doesn't exist?`);
                    continue;
                }
                if (await EngineFS.DirectoryCheck(path)) {
                    EngineFS.DirectoryDeleteRecursive(path);
                    console.log(`EngineFS.Delete: ${path} deleted`);
                } else {
                    FS.unlink(path);
                    console.log(`EngineFS.Delete: ${path} deleted`);
                }
            }
            await EngineFS.Save();
        } catch (err) {
            EngineFS.AlertError(`EngineFS.Delete Error: ${err}`);
            throw err;
        }
    }

    public static async GetPathItems() {
        const files: FileItem[] = [];
        for (const name of FS.readdir(EngineFS.fspath)) {
            if (name === "." || name === "..") continue;
            const path = `${EngineFS.fspath}/${name}`;
            files.push({
                name,
                path: path,
                isDirectory: await EngineFS.DirectoryCheck(path),
            });
        }
        return files;
    }

    // -------
    // General
    // -------

    private static PathNormalize(path: string): string {
        return path.replace(/\/+/g, '/').replace(/\/$/, '');
    }

    private static CheckSubdir(source: string, destination: string): boolean {
        const srcP = source.split('/');
        const dstP = destination.split('/');

        return dstP.length > srcP.length &&
            srcP.every((part, index) => part === dstP[index]);
    }

    private static async ItemDoCopy(item: FileItem, src: string, dst: string) {
        if (EngineFS.CheckSubdir(EngineFS.PathNormalize(src), EngineFS.PathNormalize(dst))) {
            alert(`Whoa there!\nThe destination folder is a subfolder of the source folder`);
            return;
        }
        if (item.isDirectory) {
            try {
                FS.stat(dst);
            } catch (e: any) {
                FS.mkdir(dst);
            }
            await EngineFS.DirectoryCopyRecursive(src, dst);
            return;
        }
        FS.writeFile(dst, FS.readFile(src));
    }

    private static async ZipExtract(file: File, fsPath: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const zip = await JSZip.loadAsync(file);
                console.log("Loaded ZIP file");

                // Setting some stuff up, just get the info about the zip
                const directoryList: string[] = [];
                const fileList: { path: string; entry: JSZip.JSZipObject }[] = [];

                zip.forEach((i, zentry) => {
                    const fullPath = `${fsPath}/${i}`;
                    if (zentry.dir) {
                        directoryList.push(fullPath);
                    } else {
                        fileList.push({ path: fullPath, entry: zentry });
                    }
                });

                // Make the directories first, before adding files to them
                // reason for this should be obvious!
                directoryList.forEach(dirPath => {
                    const parts = dirPath.split('/');
                    let currentPath = parts.shift() || '';

                    parts.forEach(part => {
                        currentPath += `/${part}`;
                        if (!FS.analyzePath(currentPath).exists) {
                            FS.mkdir(currentPath);
                        }
                    });
                });

                // Now, we can start working on the files...
                await Promise.all(fileList.map(async ({ path, entry }) => {
                    const data = await entry.async('uint8array');
                    const p = PATH.dirname(path);

                    // If the requested directory doesn't exist (SOMEHOW), make it
                    if (!FS.analyzePath(p).exists) {
                        FS.mkdir(p);
                    }

                    FS.writeFile(path, data, { encoding: 'binary' });
                }));

                console.log('Zip extraction complete! Synchronizing FileSystem...');
                await EngineFS.Save();
                EngineFS.actionInProgress = false;
                resolve();
            } catch (error) {
                console.error("Error during ZIP extraction:", error);
                reject(error);
            }
        });
    }

    private static async DirectoryCopyRecursive(src: string, dest: string) {
        try {
            try {
                FS.stat(dest);
            } catch (e) {
                FS.mkdir(dest);
            }
            const files = FS.readdir(src);
            await Promise.all(files.map(async (file: any) => {
                if (file === '.' || file === '..') return;
                const srcPath = `${src}/${file}`;
                const destPath = `${dest}/${file}`;
                if (await EngineFS.DirectoryCheck(srcPath)) {
                    await EngineFS.DirectoryCopyRecursive(srcPath, destPath);
                } else {
                    try {
                        FS.stat(destPath);
                        console.warn(`File ${destPath} already exists. Skipping.`);
                    } catch (e) {
                        FS.writeFile(destPath, FS.readFile(srcPath));
                        console.log(`Copied file ${srcPath} to ${destPath}`);
                    }
                }
            }));
        } catch (error) {
            EngineFS.AlertError(`EngineFS.DirectoryCopyRecursive Error: ${error} - from ${src} -> ${dest}`);
        }
    }

    private static DirectoryDeleteRecursive(path: string) {
        try {
            const files: string[] = FS.readdir(path);

            files.forEach((file: string) => {
                if (file === '.' || file === '..') {
                    return;
                }
                const filePath = path + '/' + file;
                const stat = FS.stat(filePath);

                if (FS.isDir(stat.mode)) {
                    EngineFS.DirectoryDeleteRecursive(filePath);
                } else if (FS.isFile(stat.mode)) {
                    FS.unlink(filePath);
                }
            });

            FS.rmdir(path);
        } catch (error) {
            EngineFS.AlertError(`EngineFS.DirectoryDeleteRecursive Error: ${error} - target -> ${path}`);
        }
    }

    // Other misc stuff
    private static CheckTextFile(fileName: string, content: Uint8Array): boolean {
        const textFileExtensions = ['.txt', '.json', '.md', '.csv', '.html'];
        const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

        if (textFileExtensions.includes(extension))
            return true;

        return content.every(byte => (byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13);
    }
}

export default EngineFS;