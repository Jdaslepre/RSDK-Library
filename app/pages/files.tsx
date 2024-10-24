'use client';

import * as React from 'react';

// --------------------
// UI Component Imports
// --------------------

import * as Icons from 'lucide-react';

import * as CtxMenu from '@/components/ui/context-menu'
import * as Tooltip from '@/components/ui/tooltip';
import * as AlertDialog from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

// ------------
// Misc Imports
// ------------

import EngineFS from '@/lib/EngineFS';
import { FileItem } from '@/lib/EngineFS';

// -------------------------
// Home UI Component Imports
// -------------------------

import { useBreadcrumb } from '@/components/home/breadcrumb';

// ---------------------
// Component Definitions
// ---------------------

const FilesPage: React.FC = () => {
    const engineFS = React.useRef(new EngineFS()).current;
    const { items, AddNode } = useBreadcrumb();

    const [files, setFiles] = React.useState<FileItem[]>([]);
    const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);

    const [actionFinished, setActionFinished] = React.useState(false);
    const [actionProgress, setActionProgress] = React.useState(0);

    const joinPath = (...parts: string[]): string => parts.join('/').replace(/\/+/g, '/');

    const RefreshFileList = async () => {
        const entries = await engineFS.RetPathItems();
        setFiles(entries);
    };

    React.useEffect(() => {
        const loadFiles = async () => {
            try {
                await engineFS.Initialize();
                await RefreshFileList();
                UpdateBreadcrumb(engineFS.currentPath);
            } catch (error) {
                console.error('Error loading files:', error);
            }
        };
        loadFiles();
    }, [engineFS]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActionFinished(engineFS.actionInProgress);
            setActionProgress(engineFS.actionProgress);
        }, 100);

        return () => clearInterval(interval);
    }, [engineFS]);

    const UpdateBreadcrumb = (path: string) => {
        const pathParts = path.split('/').filter(Boolean);
        items.forEach((item) => {
            if (item.path !== path) {
                item.onClick = undefined;
            }
        });
        pathParts.forEach((part, index) => {
            const cumulativePath = joinPath('/', ...pathParts.slice(0, index + 1));
            if (!items.some(item => item.path === cumulativePath)) {
                AddNode(part, cumulativePath, () => ChangeDir(cumulativePath));
            }
        });
    };

    const ChangeDir = async (path: string) => {
        engineFS.currentPath = path;
        await RefreshFileList();
        UpdateBreadcrumb(path);
    };

    // -------------------
    // Toolbar Item Events
    // -------------------

    const Toolbar_NewFolder_OnClick = async () => {
        const folderName = prompt('Folder name:');
        if (folderName) {
            await engineFS.DirCreate(folderName);
            await RefreshFileList();
        }
    };

    const Toolbar_Export_OnClick = async () => {
        if (selectedFiles.length !== 1) {
            // todo: allow multiple (via zip?)
            return;
        }

        const fileName = selectedFiles[0];
        const filePath = joinPath(engineFS.currentPath, fileName);
        try {
            await engineFS.FileDownload(filePath);
        } catch (error) {
            console.error('Error exporting file:', error);
        }
    };

    const Toolbar_Rename_OnClick = async () => {
        // TODO: shadcn dialog?

        if (selectedFiles.length !== 1) {
            return;
        }
        const name = selectedFiles[0];
        const nameRen = prompt('New item name:', name);
        if (nameRen && nameRen !== name) {
            try {
                await engineFS.ItemRename(name, nameRen);
                await RefreshFileList();
            } catch (error) {
                console.error('Error renaming item:', error);
            }
        }
    };

    const Toolbar_Delete_OnClick = async () => {
        await engineFS.ItemDelete(selectedFiles);
        await RefreshFileList();
        setSelectedFiles([]);
    };

    const FileItem_OnClick = (file: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (event.ctrlKey) {
            setSelectedFiles(prev =>
                prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file]
            );
        } else {
            setSelectedFiles([file]);
        }
    };

    const FileItem_OnDblClick = async (file: FileItem) => {
        if (file.isDirectory) {
            ChangeDir(joinPath(engineFS.currentPath, file.name));
        }
    };

    const FileList_OnClick = () => {
        setSelectedFiles([]);

        // TODO: Dragging rect?
    };

    return (
        <div className='flex flex-col h-full'>
            {/* Upload progress dialog */}
            <AlertDialog.AlertDialog open={actionFinished}>
                <AlertDialog.AlertDialogTrigger />
                <AlertDialog.AlertDialogContent>
                    <AlertDialog.AlertDialogTitle>Upload Progress</AlertDialog.AlertDialogTitle>
                    <AlertDialog.AlertDialogDescription>
                        Uploading... {actionProgress.toFixed(2)}%
                    </AlertDialog.AlertDialogDescription>
                </AlertDialog.AlertDialogContent>
            </AlertDialog.AlertDialog>

            {/* Toolbar */}
            <div className='flex flex-wrap items-center gap-2'>
                <Tooltip.TooltipProvider>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={async () => {
                                await engineFS.FileUpload();
                                RefreshFileList();
                            }}>
                                <Icons.Upload />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Add new item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={Toolbar_Export_OnClick}>
                                <Icons.Download />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Export item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={Toolbar_NewFolder_OnClick}>
                                <Icons.FolderClosed />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Create new folder</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Separator orientation='vertical' className='ml-2 mr-2 h-4' />
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={() => { /* cut */ }}>
                                <Icons.Scissors />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Cut selected item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={() => { /* copy */ }}>
                                <Icons.Copy />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Copy selected item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={() => { /* paste */ }}>
                                <Icons.Clipboard />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Paste item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={Toolbar_Rename_OnClick}>
                                <Icons.TextCursorInput />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Rename item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={Toolbar_Delete_OnClick}>
                                <Icons.Trash />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Delete selected item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                </Tooltip.TooltipProvider>
            </div>
            <div className='flex-1 mt-4 overflow-y-auto' onClick={FileList_OnClick}>
                <ul className='file-list flex flex-col w-full gap-y-1'>
                    {files.map((file, index) => (
                        <CtxMenu.ContextMenu key={index}>
                            <CtxMenu.ContextMenuTrigger>
                                <Toggle
                                    className={`inline-flex items-center justify-start h-8 px-3 w-full file-item ${selectedFiles.includes(file.name) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                                    aria-pressed={selectedFiles.includes(file.name)}
                                    data-state={selectedFiles.includes(file.name) ? 'on' : 'off'}
                                    onClick={(event) => FileItem_OnClick(file.name, event)}
                                    onDoubleClick={() => FileItem_OnDblClick(file)}
                                >
                                    <a className='flex items-center gap-2 w-full'>
                                        {file.isDirectory ? <Icons.FolderClosed width={'16px'} height={'16px'} /> : <Icons.File width={'16px'} height={'16px'} />}
                                        <span>{file.name}</span>
                                    </a>
                                </Toggle>
                            </CtxMenu.ContextMenuTrigger>
                            <CtxMenu.ContextMenuContent>
                                <CtxMenu.ContextMenuItem onClick={() => console.log('View')}>
                                    <Icons.Eye width={'16px'} height={'16px'} className='mr-2' />
                                    View
                                </CtxMenu.ContextMenuItem>
                                <CtxMenu.ContextMenuItem onClick={() => console.log('Edit')}>
                                    <Icons.Edit width={'16px'} height={'16px'} className='mr-2' />
                                    Edit
                                </CtxMenu.ContextMenuItem>
                                <CtxMenu.ContextMenuItem onClick={() => console.log('Rename')}>
                                    <Icons.TextCursorInput width={'16px'} height={'16px'} className='mr-2' />
                                    Rename
                                </CtxMenu.ContextMenuItem>
                                <CtxMenu.ContextMenuItem onClick={() => console.log('Delete')}>
                                    <Icons.Trash width={'16px'} height={'16px'} className='mr-2' />
                                    Delete
                                </CtxMenu.ContextMenuItem>
                            </CtxMenu.ContextMenuContent>
                        </CtxMenu.ContextMenu>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FilesPage;
