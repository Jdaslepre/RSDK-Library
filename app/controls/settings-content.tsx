'use client';

import * as React from 'react';

// --------------------
// UI Component Imports
// --------------------

import * as Icons from 'lucide-react';

import * as Command from '@/components/ui/command';
import * as Popover from '@/components/ui/popover';
import * as Form from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

// ------------
// Misc Imports
// ------------

import * as Settings from '@/lib/settings';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { z } from 'zod';

// ---------------------
// Component Definitions
// ---------------------

const FormSchema = z.object({
    theme: z.enum(['auto', 'light', 'dark']).default('auto').optional(),
    enablePlus: z.boolean().default(false).optional(),
    deviceProfile: z.string().default('desktop').optional(),
});

export function DeviceProfileCombo() {
    const instSettings = Settings.Load();
    const [open, setOpen] = React.useState(false)
    const [selectedProfile, setSelectedProfile] = React.useState(instSettings.deviceProfile);

    const List = [
        { value: 'desktop', label: 'Desktop' },
        { value: 'mobile', label: 'Mobile' },
    ];

    const onSelect = (val: string) => {
        Settings.Save({ ...instSettings, deviceProfile: val });
        setSelectedProfile(val);
    };

    return (
        <Popover.Popover open={open} onOpenChange={setOpen}>
            <Popover.PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-[200px] justify-between'
                >
                    {selectedProfile ? List.find((item) => item.value === selectedProfile)?.label : 'Select...'}
                    <Icons.ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </Popover.PopoverTrigger>
            <Popover.PopoverContent className='w-[200px] p-0'>
                <Command.Command>
                    <Command.CommandList>
                        <Command.CommandEmpty>que?</Command.CommandEmpty>
                        <Command.CommandGroup>
                            {List.map((item) => (
                                <Command.CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                        onSelect(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Icons.Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedProfile === item.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {item.label}
                                </Command.CommandItem>
                            ))}
                        </Command.CommandGroup>
                    </Command.CommandList>
                </Command.Command>
            </Popover.PopoverContent>
        </Popover.Popover>
    )
}

export function SettingsContent() {
    const instSettings = Settings.Load();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            enablePlus: instSettings.enablePlus ?? false,
            deviceProfile: instSettings.deviceProfile,
        },
    });

    const actionSave = (data: z.infer<typeof FormSchema>) => {
        const settingsToSave: Settings.ISettings = {
            enablePlus: data.enablePlus ?? false,
            deviceProfile: data.deviceProfile || 'desktop',
        };

        try {
            Settings.Save(settingsToSave);
            console.log('Saved settings:', settingsToSave);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <Form.Form {...form}>
            <form className='w-full space-y-6'>
                <div>
                    <div className='space-y-4'>
                        <Form.FormField
                            control={form.control}
                            name='enablePlus'
                            render={({ field }) => (
                                <Form.FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                    <div className='space-y-0.5'>
                                        <Form.FormLabel>Enable Plus DLC</Form.FormLabel>
                                        <Form.FormDescription>
                                            Enables the Plus DLC on supported engines
                                        </Form.FormDescription>
                                    </div>
                                    <Form.FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked);
                                                actionSave({ ...form.getValues(), enablePlus: checked });
                                            }}
                                        />
                                    </Form.FormControl>
                                </Form.FormItem>
                            )}
                        />

                        <Form.FormField
                            control={form.control}
                            name='deviceProfile'
                            render={({ field }) => (
                                <Form.FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                    <div className='space-y-0.5'>
                                        <Form.FormLabel>Device Profile</Form.FormLabel>
                                    </div>
                                    <Form.FormControl>
                                        <DeviceProfileCombo />
                                    </Form.FormControl>
                                </Form.FormItem>
                            )}
                        />
                    </div>
                </div>
            </form>
        </Form.Form>
    );
}
