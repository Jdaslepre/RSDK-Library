'use client'

import * as React from 'react'
import * as Icons from 'lucide-react'

// --------------------
// UI Component Imports
// --------------------

import * as Tooltip from 'ui/tooltip'
import * as Drawer from 'ui/drawer'
import * as AlertDialog from 'ui/alert-dialog'

import { Button } from 'ui/button'
import { Toggle } from 'ui/toggle'
import { Separator } from 'ui/separator'
import { Progress } from 'ui/progress'
import { Toaster } from 'sonner'

// ------------
// Misc Imports
// ------------

import EngineFS from 'lib/EngineFS'
import { FileItem } from 'lib/EngineFS'

import { useIsMobile } from 'hooks/use-mobile'

// -------------------------
// Home UI Component Imports
// -------------------------

import { useBreadcrumb } from '@/app/controls/breadcrumb'

// ---------------------
// Component Definitions
// ---------------------

declare const FS: any

interface Props {
    id: string
}

const FilesPage: React.FC<Props> = ({ id }) => {
    const { AddNode, ResetNodes } = useBreadcrumb()
    const isMobile = useIsMobile()

    const [files, setFiles] = React.useState<FileItem[]>([])
    const [selectedFiles, setSelectedFiles] = React.useState<string[]>([])

    const joinPath = (...parts: string[]): string => parts.join('/').replace(/\/+/g, '/')

    const DoRefresh = async () => {
        const entries = await EngineFS.GetPathItems()
        setFiles(entries)
        UpdateBreadcrumb(EngineFS.fspath)
    }

    const [actionFinished, setActionFinished] = React.useState(false)
    const [actionProgress, setActionProgress] = React.useState(0)
    React.useEffect(() => {
        const loadFiles = async () => {
            try {
                await EngineFS.Init(id)
                await DoRefresh()
            } catch (error) {
                console.error('Error loading files:', error)
            }
        }
        loadFiles()
        const interval = setInterval(() => {
            setActionFinished(EngineFS.actionInProgress)
            setActionProgress(EngineFS.actionProgress)
        }, 100)

        return () => clearInterval(interval)
    }, [id])

    const UpdateBreadcrumb = (path: string) => {
        const parts = path.split('/').filter(Boolean)
        ResetNodes()
        parts.forEach((part, index) => {
            const currentPath = joinPath('/', ...parts.slice(0, index + 1))
            AddNode(part, currentPath, () => ChangeDir(currentPath))
        })
    }

    const ChangeDir = async (path: string) => {
        EngineFS.fspath = path
        await DoRefresh()
    }

    // -------------------
    // Toolbar Item Events
    // -------------------

    const Toolbar_NewFolder_OnClick = async () => {
        const name = prompt('Folder name:')
        if (name) {
            EngineFS.DirectoryCreate(name)
            await DoRefresh()
        }
    }
    const Toolbar_Export_OnClick = async () => {
        if (selectedFiles.length === 0) {
            return
        }
        const paths = selectedFiles.map(file => joinPath(EngineFS.fspath, file))
        await EngineFS.FileDownload(paths)
    }

    const Toolbar_ItemCut_OnClick = async () => {
        const selectedItems = files.filter(file => selectedFiles.includes(file.name))
        await EngineFS.Cut(selectedItems)
    }
    const Toolbar_ItemCopy_OnClick = async () => {
        const selectedItems = files.filter(file => selectedFiles.includes(file.name))
        await EngineFS.Copy(selectedItems)
    }
    const Toolbar_ItemPaste_OnClick = async () => {
        await EngineFS.Paste()
        await DoRefresh()
    }

    const Toolbar_Rename_OnClick = async () => {
        if (selectedFiles.length !== 1) {
            alert('You can only rename one item at a time.')
            return
        }
        const name = selectedFiles[0]
        const nameRen = prompt('New item name:', name)
        if (nameRen && nameRen !== name) {
            try {
                await EngineFS.Rename(name, nameRen)
                await DoRefresh()
            } catch (error) {
                console.error('Error renaming item:', error)
            }
        }
    }

    const Toolbar_Delete_OnClick = async () => {
        await EngineFS.Delete(selectedFiles)
        await DoRefresh()
        setSelectedFiles([])
    }

    const [lastSelected, setLastSelected] = React.useState<number | null>(null)
    const FileItem_OnClick = (file: string, event: React.MouseEvent, index: number) => {
        event.stopPropagation()

        setSelectedFiles(prev => {
            if (event.ctrlKey) {
                return prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file]
            } else if (event.shiftKey && lastSelected !== null) {
                const lstStart = Math.min(lastSelected, index)
                const lstEnd = Math.max(lastSelected, index)
                const selectionNew = files.slice(lstStart, lstEnd + 1).map(f => f.name)
                const selectResult = Array.from(new Set([...prev, ...selectionNew]))
                return selectResult
            } else {
                setLastSelected(index)
                return [file]
            }
        })
    }
    const FileItem_OnDblClick = async (file: FileItem) => {
        if (file.isDirectory) {
            ChangeDir(joinPath(EngineFS.fspath, file.name))
        }
    }

    const [dragging, setDragging] = React.useState(false)
    const FileList_OnClick = () => setSelectedFiles([])
    const FileList_OnDragOver = (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setDragging(true)
    }
    const FileList_OnDragEnter = (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setDragging(true)
    }
    const FileList_OnDragLeave = (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setDragging(false)
    }

    const FileList_OnDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
        event.preventDefault()
        event.stopPropagation()
        setDragging(false)

        const items = Array.from(event.dataTransfer.items)
        let doSave = false

        for (const item of items) {
            if (item.kind === 'file' && item.webkitGetAsEntry) {
                const entry = item.webkitGetAsEntry() as FileSystemEntry
                if (entry.isFile) {
                    const file = item.getAsFile()
                    if (file) {
                        await EngineFS.FileUploadCommon([file], false, EngineFS.fspath)
                        doSave = true
                    }
                } else if (entry.isDirectory) {
                    const newDirPath = joinPath(EngineFS.fspath, entry.name)
                    await FS.mkdir(newDirPath)
                    await DirectoryHandleDrop(entry as FileSystemDirectoryEntry, newDirPath)
                    doSave = true
                }
            }
        }
        if (doSave)
            await EngineFS.Save()
        await DoRefresh()
    }

    const DirectoryHandleDrop = async (directoryEntry: FileSystemDirectoryEntry, parentDir: string): Promise<void> => {
        const reader = directoryEntry.createReader()
        const entries: FileSystemEntry[] = []
        const EntryRead = (): Promise<FileSystemEntry[]> => {
            return new Promise((resolve) => {
                reader.readEntries((results) => {
                    if (results.length) {
                        entries.push(...results)
                        EntryRead().then(resolve)
                    } else {
                        resolve(entries)
                    }
                })
            })
        }
        const EntryAsFile = async (entry: FileSystemEntry): Promise<File> => {
            return new Promise((resolve, reject) => {
                (entry as FileSystemFileEntry).file(resolve, reject)
            })
        }
        const _ent = await EntryRead()
        for (const i of _ent) {
            if (i.isFile) {
                const file = await EntryAsFile(i)
                await EngineFS.FileUploadCommon([file], false, parentDir)
            } else if (i.isDirectory) {
                const subDirPath = joinPath(parentDir, i.name)
                await FS.mkdir(subDirPath)
                await DirectoryHandleDrop(i as FileSystemDirectoryEntry, subDirPath)
            }
        }
    }

    const actions = [
        {
            icon: <Icons.FilePlus />,
            label: 'Add New File',
            onClick: async () => {
                await EngineFS.FileUpload(false)
                await DoRefresh()
            }
        },
        {
            icon: <Icons.FolderPlus />,
            label: 'Add New Folder',
            onClick: async () => {
                await EngineFS.FileUpload(true)
                await DoRefresh()
            }
        },
        {
            icon: <Icons.FolderClosed />,
            label: 'Create New Folder',
            onClick: Toolbar_NewFolder_OnClick
        },
        {
            icon: <Icons.Download />,
            label: 'Download Selected Item(s)',
            onClick: Toolbar_Export_OnClick
        }
    ]

    return (
        <div className='flex flex-col h-full'>

            {/* Upload progress dialog */}
            <AlertDialog.AlertDialog open={actionFinished}>
                <AlertDialog.AlertDialogTrigger />
                <AlertDialog.AlertDialogContent>
                    <AlertDialog.AlertDialogTitle>
                        <div className='flex items-center justify-start space-x-2'>
                            <Icons.FolderClosed />
                            <span>Uploading Files</span>
                        </div>
                    </AlertDialog.AlertDialogTitle>
                    <AlertDialog.AlertDialogDescription>
                        {EngineFS.actionStatus} {actionProgress.toFixed(2)}%
                    </AlertDialog.AlertDialogDescription>
                    <AlertDialog.AlertDialogFooter>
                        <Progress className='h-2' value={actionProgress} />
                    </AlertDialog.AlertDialogFooter>
                </AlertDialog.AlertDialogContent>
            </AlertDialog.AlertDialog>

            {/* Toolbar */}
            <div className={`flex flex-wrap items-center gap-2 ${isMobile ? 'fixed bottom-0 left-0 w-full border-t bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60' : ''}`}>
                <Tooltip.TooltipProvider>
                    {isMobile ? (
                        <Drawer.Drawer shouldScaleBackground={true}>
                            <Drawer.DrawerTrigger asChild>
                                <Button variant='outline' className='flex-grow h-16'>
                                    <Icons.FolderClosed />
                                </Button>
                            </Drawer.DrawerTrigger>
                            <Drawer.DrawerContent>
                                <Drawer.DrawerHeader>
                                    <Drawer.DrawerTitle>File Actions</Drawer.DrawerTitle>
                                    <Drawer.DrawerDescription>Additional file creation options.</Drawer.DrawerDescription>
                                </Drawer.DrawerHeader>
                                <Drawer.DrawerFooter className='flex flex-col w-full h-full'>
                                    {actions.map((action, index) => (
                                        <Button key={index} variant='outline' onClick={action.onClick} className='gap-2 justify-start w-full flex-grow'>
                                            {action.icon}
                                            <span>{action.label}</span>
                                        </Button>
                                    ))}
                                    <Drawer.DrawerClose asChild>
                                        <Button className='w-full justify-center mt-2 flex-grow'>Close</Button>
                                    </Drawer.DrawerClose>
                                </Drawer.DrawerFooter>
                            </Drawer.DrawerContent>
                        </Drawer.Drawer>
                    ) : (
                        <>
                            {actions.map((action, index) => (
                                <Tooltip.Tooltip key={index}>
                                    <Tooltip.TooltipTrigger asChild>
                                        <Button variant='outline' onClick={action.onClick}>
                                            {action.icon}
                                        </Button>
                                    </Tooltip.TooltipTrigger>
                                    <Tooltip.TooltipContent>
                                        <p>{action.label}</p>
                                    </Tooltip.TooltipContent>
                                </Tooltip.Tooltip>
                            ))}
                        </>
                    )}
                    <Separator orientation='vertical' className='h-4' />
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={Toolbar_ItemCut_OnClick} className={`${isMobile ? 'flex-grow h-16' : ''}`}>
                                <Icons.Scissors />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Cut selected item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={Toolbar_ItemCopy_OnClick} className={`${isMobile ? 'flex-grow h-16' : ''}`}>
                                <Icons.CopySlash />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Copy selected item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={Toolbar_ItemPaste_OnClick} className={`${isMobile ? 'flex-grow h-16' : ''}`}>
                                <Icons.Clipboard />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Paste item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={Toolbar_Rename_OnClick} className={`${isMobile ? 'flex-grow h-16' : ''}`}>
                                <Icons.Edit />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Rename item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant='outline' onClick={Toolbar_Delete_OnClick} className={`${isMobile ? 'flex-grow h-16' : ''}`}>
                                <Icons.Trash2 />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>Delete selected item</p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                </Tooltip.TooltipProvider>
            </div>

            {/* File List Container */}
            <div className={`flex-1 ${isMobile ? 'mt-0 pb-20 gap-2' : 'mt-4'} overflow-y-auto flex flex-col`}
                onClick={FileList_OnClick}
                onDragOver={FileList_OnDragOver}
                onDragEnter={FileList_OnDragEnter}
                onDragLeave={FileList_OnDragLeave}
                onDrop={FileList_OnDrop}
            >
                {files.map((file, index) => (
                    <Toggle
                        key={index}
                        className={`${isMobile ? '' : 'h-8'} px-3 w-full items-center justify-start file-item flex-shrink-0`}
                        aria-pressed={selectedFiles.includes(file.name)}
                        data-state={selectedFiles.includes(file.name) ? 'on' : 'off'}
                        onClick={(event) => FileItem_OnClick(file.name, event, index)}
                        onDoubleClick={() => FileItem_OnDblClick(file)}>
                        <a className='flex items-center gap-2 w-full'>
                            {file.isDirectory ? <Icons.FolderClosed width={'16px'} height={'16px'} /> : <Icons.File width={'16px'} height={'16px'} />}
                            <span>{file.name}</span>
                        </a>
                    </Toggle>
                ))}
            </div>
            <Toaster />
        </div>
    )
}

export default FilesPage
