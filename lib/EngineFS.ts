declare const FS: any;
declare const IDBFS: any;

let once = false;

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
    public actionInProgress: boolean = false;
    public actionProgress: number = 0; 

    constructor() {}

    async Initialize() {
        if (once === true)
            return;

        try {
            FS.mkdir('FileSystem');
            FS.mount(IDBFS, {}, 'FileSystem');

            await this.Init();

            // ['RSDKv2','RSDKv3','RSDKv4','RSDKv5','RSDKv5U'].forEach(dir => FS.mkdir(`FileSystem/${dir}`));

            console.log('FileSystem initialized');
            once = true;
        } catch (errorInit) {
            console.error('Error initializing file system:', errorInit);
            throw errorInit;
        }
    }

    private async Init() {
        return new Promise<void>((resolve, reject) => {
            FS.syncfs(true, function (err: any) {
                if (err) {
                    console.error('Error:', err);
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
                    console.error('Error:', err);
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

    async ItemRename(oldName: string, newName: string) {
        try {
            const oldPath = `${this.currentPath}/${oldName}`;
            const newPath = `${this.currentPath}/${newName}`;
    
            const stat = FS.lookupPath(oldPath);
            if (!stat.node) {
                throw new Error(`Item "${oldName}" does not exist.`);
            }
    
            FS.rename(oldPath, newPath);
            console.log(`Renamed ${oldPath} to ${newPath}`);
    
            await this.Save();
        } catch (error) {
            console.error('Error renaming item:', error);
            throw error;
        }
    }    

    async ItemDelete(fileNames: string[]) {
        try {
            for (const fileName of fileNames) {
                const filePath = `${this.currentPath}/${fileName}`;
                const stat = FS.lookupPath(filePath);
    
                if (!stat.node) {
                    console.warn(`Tried to delete "${fileName}" - which doesn't exist?`);
                    continue;
                }
    
                if (this.DirCheck(filePath)) {
                    FS.rmdir(filePath);
                    console.log(`Directory ${fileName} deleted from ${this.currentPath}`);
                } else {
                    FS.unlink(filePath);
                    console.log(`File ${fileName} deleted from ${this.currentPath}`);
                }
            }
    
            await this.Save();
        } catch (err) {
            console.error('Error deleting items:', err);
            throw err;
        }
    }

    // -----
    // Files
    // -----
/*
    async FileUpload() { // TODO: ZIP EXTRACTION
        return new Promise<void>((resolve, reject) => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.onchange = async () => {
                if (fileInput.files!.length > 0) {

                    for (let i = 0; i < fileInput.files!.length; i++) {
                        const file = fileInput.files![i];
                        const filePath = `${this.currentPath}/${file.name}`;

                        const reader = new FileReader();
                        reader.onload = function (event) {
                            const fileData = new Uint8Array(event.target!.result as ArrayBuffer);
                            FS.writeFile(filePath, fileData, { encoding: 'binary' });

                            if (i === fileInput.files!.length - 1) {
                                FS.syncfs(function (err: any) {
                                    if (err) {
                                        console.error('Error:', err);
                                    } else {
                                        console.log(`Wrote file(s) to FS`);
                                    }
                                    resolve();
                                });
                            }
                        };

                        reader.readAsArrayBuffer(file);
                    }
                } else {
                    reject('No files selected');
                }
            };
            fileInput.click();
        });
    }
        */

    async FileUpload() { // TODO: ZIP EXTRACTION
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
                        const filePath = `${this.currentPath}/${file.name}`;
    
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            const fileData = new Uint8Array(event.target!.result as ArrayBuffer);
                            FS.writeFile(filePath, fileData, { encoding: 'binary' });
    
                            self.actionProgress = Math.round(((i + 1) / totalFiles) * 100);
                            console.log(`Upload Progress: ${self.actionProgress}%`);
    
                            if (i === totalFiles - 1) {
                                FS.syncfs(function (err: any) {
                                    if (err) {
                                        console.error('Error:', err);
                                    } else {
                                        console.log(`Wrote file(s) to FS`);
                                        self.actionInProgress = false;
                                    }
                                    resolve();
                                });
                            }
                        };
    
                        reader.readAsArrayBuffer(file);
                    }
                } else {
                    reject('No files selected');
                }
            };
            fileInput.click();
        });
    }
    

    async FileDownload(filePath: string) {
        try {
            const fileData = FS.readFile(filePath);
            const blob = new Blob([fileData], { type: 'application/octet-stream' });
    
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filePath.split('/').pop() || 'download';
    
            document.body.appendChild(link);
            link.click();
    
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }, 100);
        } catch (error) {
            console.error('Error downloading file:', error);
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

    async DirCreate(dirName: string) {
        try {
            const dirPath = `${this.currentPath}/${dirName}`;
            FS.mkdir(dirPath);

            FS.syncfs(function (err: any) {
                if (err) {
                    console.error('Error:', err);
                } else {
                    console.log(`Wrote ${dirPath} to FS`);
                }
            });
        } catch (err) {
            console.error('Error creating directory:', err);
            throw err;
        }
    }

    async DirChange(dirName: string) {
        if (dirName === '..') {
            const splitPath = this.currentPath.split('/');
            if (splitPath.length > 1) {
                splitPath.pop();
                this.currentPath = splitPath.join('/');
            }
        } else {
            this.currentPath = `${this.currentPath}/${dirName}`.replace(/\/+/g, '/');
        }
        console.log('Current directory:', this.currentPath);
        return this.RetPathItems();
    }

}

export default EngineFS;