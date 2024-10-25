declare const FS: any;
declare const PATH: any;
declare const IDBFS: any;

import JSZip from 'jszip';

let once = false;

// Bad programming ahead, be warned

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
    public currentPath: string = "//FileSystem";
    private clipboard: { items: FileItem[], isCut: boolean } | null = null;
    public actionInProgress: boolean = false;
    public actionProgress: number = 0;

    constructor() { }

    async Initialize() {
        if (once === true)
            return;

        try {
            FS.mkdir('FileSystem');
            FS.mount(IDBFS, {}, 'FileSystem');

            await this.Init();

            console.log('FileSystem initialized');
            once = true;
        } catch (errorInit: any) {
            alert('Error initializing file system: ' + errorInit);
            console.error('Error initializing file system:', errorInit);
            throw errorInit;
        }
    }

    private async Init() {
        return new Promise<void>((resolve, reject) => {
            FS.syncfs(true, function (err: any) {
                if (err) {
                    alert('Error syncing FS: ' + err);
                    console.error('Error syncing FS:', err);
                    reject(err);
                } else {
                    console.log('Synchronized FS');
                    resolve();
                }
            });
        });
    }

    async Save() {
        return new Promise<void>((resolve, reject) => {
            FS.syncfs(function (err: any) {
                if (err) {
                    alert('Error syncing FS: ' + err);
                    console.error('Error syncing FS:', err);
                    reject(err);
                } else {
                    console.log('Synchronized FS');
                    resolve();
                }
            });
        });
    }

    // -------
    // General
    // -------

    private PathNormalize(path: string): string {
        return path.replace(/\/+/g, '/').replace(/\/$/, '');
    }

    private CheckSubdir(source: string, destination: string): boolean {
        const srcP = source.split('/');
        const dstP = destination.split('/');

        return dstP.length > srcP.length &&
            srcP.every((part, index) => part === dstP[index]);
    }

    async RetPathItems(): Promise<FileItem[]> {
        const files: FileItem[] = [];
        for (const name of FS.readdir(this.currentPath)) {
            if (name === "." || name === "..")
                continue;

            const path = `${this.currentPath}/${name}`;
            files.push({
                name,
                path,
                isDirectory: this.DirCheck(path),
            });
        }

        return files;
    }

    async ItemCopy(items: FileItem[]) {
        this.clipboard = { items, isCut: false };
        console.log('Copied items:', items);
    }

    private async ItemDoCopy(item: FileItem, src: string, dst: string) {
        if (this.CheckSubdir(this.PathNormalize(src), this.PathNormalize(dst))) {
            alert(`Whoa there!\nThe destination folder is a subfolder of the source folder`);
            return;
        }
        if (item.isDirectory) {
            try {
                FS.stat(dst);
            } catch (e: any) {
                FS.mkdir(dst);
            }
            await this.DirCopyRecursive(src, dst);
            return;
        }
        FS.writeFile(dst, FS.readFile(src));
    }

    async ItemCut(items: FileItem[]) {
        this.clipboard = { items, isCut: true };
        console.log('Cut items:', items);
    }

    async ItemPaste() {
        if (!this.clipboard) {
            console.warn('Clipboard is empty. No items to paste.');
            return;
        }
        const { items, isCut } = this.clipboard;
        const pastePromises = items.map(async (item) => {
            const oldPath = item.path;
            const newPath = `${this.currentPath}/${item.name}`;
            console.log(`Attempting to paste ${isCut ? 'move' : 'copy'}: ${oldPath} -> ${newPath}`);
            this.actionInProgress = true;
            try {
                if (!FS.lookupPath(oldPath).node) {
                    alert('Source path does not exist: ' + oldPath);
                    console.error(`Source path does not exist: ${oldPath}`);
                    this.actionInProgress = false;
                    return;
                }
                if (isCut) {
                    FS.rename(oldPath, newPath);
                    console.log(`Moved ${oldPath} to ${newPath}`);
                } else {
                    await this.ItemDoCopy(item, oldPath, newPath);
                }
            } catch (error) {
                alert('Error pasting ' + item.name + ':' + error);
                console.error(`Error pasting ${item.name}:`, error);
                this.actionInProgress = false;
            }
        });
        await Promise.all(pastePromises);
        await this.Save();
        this.actionInProgress = false;
        this.clipboard = null;
    }

    async ItemRename(srcName: string, dstName: string) {
        try {
            const srcPath = `${this.currentPath}/${srcName}`;
            const dstPath = `${this.currentPath}/${dstName}`;
            if (!FS.lookupPath(srcPath).node) {
                throw new Error(`Item "${srcName}" does not exist.`);
            }
            FS.rename(srcPath, dstPath);
            await this.Save();
        } catch (error) {
            alert('Error renaming item: ' + error)
            console.error('Error renaming item:', error);
            throw error;
        }
    }

    async ItemDelete(names: string[]) {
        try {
            if (!window.confirm(`Are you sure you want to delete the selected items? This action is irreversible.`)) {
                return;
            }
            for (const i of names) {
                const path = `${this.currentPath}/${i}`;
                if (!FS.lookupPath(path).node) {
                    console.warn(`Tried to delete "${i}" - which doesn't exist?`);
                    continue;
                }
                if (this.DirCheck(path)) {
                    this.DirDeleteRecursive(path);
                } else {
                    FS.unlink(path);
                }
            }
            await this.Save();
        } catch (err: any) {
            alert('Error deleting items: ' + err);
            console.error('Error deleting items:', err);
            throw err;
        }
    }

    async ZipExtract(file: File, fsPath: string): Promise<void> {
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
                await this.Save();
                this.actionInProgress = false;
                resolve();
            } catch (error) {
                console.error("Error during ZIP extraction:", error);
                reject(error);
            }
        });
    }

    // -----
    // Files
    // -----

    async FileUpload() {
        return new Promise<void>((resolve, reject) => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
    
            const self = this;
    
            fileInput.onchange = async () => {
                if (fileInput.files!.length > 0) {
                    self.actionInProgress = true;
                    const totalFiles = fileInput.files!.length;
    
                    for (let i = 0; i < totalFiles; i++) {
                        const file = fileInput.files![i];
                        const fileName = file.name.toLowerCase();
                        const filePath = `${this.currentPath}/${file.name}`;
    
                        if (fileName.endsWith('.zip')) {
                            try {
                                await self.ZipExtract(file, this.currentPath);
                                resolve();
                            } catch (error) {
                                alert('Error extracting ZIP file: ' + error);
                                console.error('Error extracting ZIP file:', error);
                            }
                        } else {
                            const reader = new FileReader();
                            reader.onload = async function (event) {
                                const fileData = new Uint8Array(event.target!.result as ArrayBuffer);
                                FS.writeFile(filePath, fileData, { encoding: 'binary' });
    
                                self.actionProgress = Math.round(((i + 1) / totalFiles) * 100);
                                console.log(`Upload Progress: ${self.actionProgress}%`);
    
                                await new Promise(resolve => setTimeout(resolve, 0));
    
                                if (i === totalFiles - 1) {
                                    FS.syncfs(function (err: any) {
                                        if (err) {
                                            alert('Error syncing FS: ' + err);
                                            console.error('Error syncing FS:', err);
                                        } else {
                                            self.actionInProgress = false;
                                        }
                                        resolve();
                                    });
                                }
                            };
                            reader.readAsArrayBuffer(file);
                        }
                    }
                } else {
                    reject('No files selected');
                }
            };
            fileInput.click();
        });
    }

    async FileDownload(paths: string[]) {
        try {
            const zip = new JSZip();

            const ZipFile = async (path: string, zipPath: string) => {
                if (!FS.lookupPath(path).node) {
                    console.warn(`Tried to add ${path} to zip for export. Doesn't exist!`);
                    return;
                }

                if (this.DirCheck(path)) {
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
        } catch (error: any) {
            alert('Error downloading files: ' + error);
            console.error('Error downloading files:', error);
            throw error;
        }
    }

    // This returns in mb
    FileGetSize(path: string) {
        return (FS.stat(path).size / (1024 * 1024)).toFixed(2);
    }

    // -----------
    // Directories
    // -----------

    DirCheck(path: string): boolean {
        const mode = FS.lookupPath(path).node.mode;
        return FS.isDir(mode);
    }

    async DirCreate(name: string) {
        try {
            const dstPath = `${this.currentPath}/${name}`;
            FS.mkdir(dstPath);

            FS.syncfs(function (err: any) {
                if (err) {
                    alert('Error syncing FS ' + err);
                    console.error('Error syncing FS:', err);
                } else {
                    console.log(`Wrote ${dstPath} to FS`);
                }
            });
        } catch (err) {
            alert('Error creating directory: ' + err);
            console.error('Error creating directory:', err);
            throw err;
        }
    }

    // god this is awful
    private async DirCopyRecursive(src: string, dest: string) {
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
                if (this.DirCheck(srcPath)) {
                    await this.DirCopyRecursive(srcPath, destPath);
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
            alert('Error copying directory from ' + src + ' to ' + dest + ': ' + error);
            console.error(`Error copying directory from ${src} to ${dest}:`, error);
        }
    }

    private DirDeleteRecursive(path: string) {
        try {
            const files: string[] = FS.readdir(path);

            files.forEach((file: string) => {
                if (file === '.' || file === '..') {
                    return;
                }
                const filePath = path + '/' + file;
                const stat = FS.stat(filePath);

                if (FS.isDir(stat.mode)) {
                    this.DirDeleteRecursive(filePath);
                } else if (FS.isFile(stat.mode)) {
                    FS.unlink(filePath);
                }
            });

            FS.rmdir(path);
        } catch (err) {
            alert('Failed to delete directory: ' + err);
            console.error('Failed to delete directory:', err);
        }
    }

    async ResetFileSystem() {
        if (!window.confirm(`Are you sure you want to reset the FileSystem?\n"Reset" as in, delete everything. This action is irreversible.`)) {
            return;
        }
        if (!window.confirm(`Are you sure you want to reset the FileSystem?\nJust making sure.`)) {
            return;
        }

        // warned you twice, anything that happens after this is your fault

        try {
            const fsPath = '//FileSystem';

            if (this.DirCheck(fsPath)) {
                this.ResetFSLogic(fsPath);
                await this.Save();
                console.log('FileSystem has been reset successfully.');
            }
        } catch (error) {
            alert('Error resetting FileSystem: ' + error);
            console.error('Error resetting FileSystem:', error);
            throw error;
        }
    }

    // literally just DirDeleteRecursive without the rmdir
    private ResetFSLogic(path: string) {
        try {
            const files: string[] = FS.readdir(path);

            files.forEach((file: string) => {
                if (file === '.' || file === '..') {
                    return;
                }
                const filePath = path + '/' + file;
                const stat = FS.stat(filePath);

                if (FS.isDir(stat.mode)) {
                    this.DirDeleteRecursive(filePath);
                } else if (FS.isFile(stat.mode)) {
                    FS.unlink(filePath);
                }
            });

        } catch (err) {
            alert('Failed to delete directory: ' + err);
            console.error('Failed to delete directory:', err);
        }
    }
}

export default EngineFS;