'use client';

import * as React from 'react';

// --------------------
// UI Component Imports
// --------------------

import * as Icons from 'lucide-react';

import * as Tooltip from '@/components/ui/tooltip';
import * as AlertDialog from '@/components/ui/alert-dialog'
import * as Dropdown from '@/components/ui/dropdown-menu';

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

import { useBreadcrumb } from '@/app/controls/breadcrumb';

// ---------------------
// Component Definitions
// ---------------------

const FilesPage: React.FC = () => {
    const engineFS = React.useRef(new EngineFS()).current;
    const { AddNode, ResetNodes } = useBreadcrumb();

    const [files, setFiles] = React.useState<FileItem[]>([]);
    const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);

    const [actionFinished, setActionFinished] = React.useState(false);
    const [actionProgress, setActionProgress] = React.useState(0);

    const joinPath = (...parts: string[]): string => parts.join('/').replace(/\/+/g, '/');

    const DoRefresh = async () => {
        const entries = await engineFS.RetPathItems();
        setFiles(entries);
        UpdateBreadcrumb(engineFS.currentPath);
    };

    React.useEffect(() => {
        const loadFiles = async () => {
            try {
                await engineFS.Initialize();
                await DoRefresh();
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
        const parts = path.split('/').filter(Boolean);
        ResetNodes();
        parts.forEach((part, index) => {
            const currentPath = joinPath('/', ...parts.slice(0, index + 1));
            AddNode(part, currentPath, () => ChangeDir(currentPath));
        });
    };

    const ChangeDir = async (path: string) => {
        engineFS.currentPath = path;
        await DoRefresh();
    };

    // -------------------
    // Toolbar Item Events
    // -------------------

    const Toolbar_NewFolder_OnClick = async () => {
        const name = prompt('Folder name:');
        if (name) {
            await engineFS.DirCreate(name);
            await DoRefresh();
        }
    };

    const Toolbar_Export_OnClick = async () => {
        if (selectedFiles.length !== 1) {
            // todo: allow multiple (via zip?)
            alert('Currently, only one item is allowed');
            return;
        }
        const path = joinPath(engineFS.currentPath, selectedFiles[0]);
        await engineFS.FileDownload(path);
    };

    const Toolbar_ItemCut_OnClick = async () => {
        const selectedItems = files.filter(file => selectedFiles.includes(file.name));
        await engineFS.ItemCut(selectedItems);
    };
    const Toolbar_ItemCopy_OnClick = async () => {
        const selectedItems = files.filter(file => selectedFiles.includes(file.name));
        await engineFS.ItemCopy(selectedItems);
    };
    const Toolbar_ItemPaste_OnClick = async () => {
        await engineFS.ItemPaste();
        await DoRefresh();
    };

    const Toolbar_Rename_OnClick = async () => {
        if (selectedFiles.length !== 1) {
            alert('You can only rename one item at a time.');
            return;
        }
        const name = selectedFiles[0];
        const nameRen = prompt('New item name:', name);
        if (nameRen && nameRen !== name) {
            try {
                await engineFS.ItemRename(name, nameRen);
                await DoRefresh();
            } catch (error) {
                console.error('Error renaming item:', error);
            }
        }
    };

    const Toolbar_Delete_OnClick = async () => {
        await engineFS.ItemDelete(selectedFiles);
        await DoRefresh();
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

    const FileList_OnClick = () => setSelectedFiles([]);

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
                            <Button variant='outline' size='icon' onClick={async () => {
                                await engineFS.FileUpload();
                                DoRefresh();
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
                            <Button variant='outline' size='icon' onClick={Toolbar_Export_OnClick}>
                                <Icons.Download />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Export item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' size='icon' onClick={Toolbar_NewFolder_OnClick}>
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
                            <Button variant='outline' size='icon' onClick={Toolbar_ItemCut_OnClick}>
                                <Icons.Scissors />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Cut selected item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' size='icon' onClick={Toolbar_ItemCopy_OnClick}>
                                <Icons.Copy />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Copy selected item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' size='icon' onClick={Toolbar_ItemPaste_OnClick}>
                                <Icons.Clipboard />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Paste item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' size='icon' onClick={Toolbar_Rename_OnClick}>
                                <Icons.Edit />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Rename item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' size='icon' onClick={Toolbar_Delete_OnClick}>
                                <Icons.Trash />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Delete selected item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Separator orientation='vertical' className='ml-2 mr-2 h-4' />
                    <Dropdown.DropdownMenu>
                        <Dropdown.DropdownMenuTrigger asChild>
                            <Button variant='outline' size='icon'><Icons.Settings /></Button>
                        </Dropdown.DropdownMenuTrigger>
                        <Dropdown.DropdownMenuContent className="w-56">
                            <Dropdown.DropdownMenuLabel>Options</Dropdown.DropdownMenuLabel>
                            <Dropdown.DropdownMenuSeparator />
                            <Dropdown.DropdownMenuGroup>

                                {/* TODO: Zip */}
                                <Dropdown.DropdownMenuItem>
                                    <Icons.FolderArchive />
                                    <span>Export FileSystem as .zip</span>
                                </Dropdown.DropdownMenuItem>

                                <Dropdown.DropdownMenuItem onClick={async () => {
                                    await engineFS.ResetFileSystem();
                                    DoRefresh();
                                }}>
                                    <Icons.FolderClosed />
                                    <span>Reset FileSystem</span>
                                </Dropdown.DropdownMenuItem>

                            </Dropdown.DropdownMenuGroup>
                        </Dropdown.DropdownMenuContent>
                    </Dropdown.DropdownMenu>
                </Tooltip.TooltipProvider>
            </div>

            {/* File List Container */}
            <div className='flex-1 mt-4 overflow-y-auto flex flex-col' onClick={FileList_OnClick}>
                {files.map((file, index) => (
                    <Toggle
                        key={index}
                        className={`h-8 px-3 w-full items-center justify-start file-item flex-shrink-0`}
                        aria-pressed={selectedFiles.includes(file.name)}
                        data-state={selectedFiles.includes(file.name) ? 'on' : 'off'}
                        onClick={(event) => FileItem_OnClick(file.name, event)}
                        onDoubleClick={() => FileItem_OnDblClick(file)}>
                        <a className='flex items-center gap-2 w-full'>
                            {file.isDirectory ? <Icons.FolderClosed width={'16px'} height={'16px'} /> : <Icons.File width={'16px'} height={'16px'} />}
                            <span>{file.name}</span>
                        </a>
                    </Toggle>
                ))}
            </div>
        </div>
    );
};

export default FilesPage;
