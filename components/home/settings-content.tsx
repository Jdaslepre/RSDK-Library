"use client";

// --------------------
// settings-content.tsx
// --------------------

import * as React from "react"

import * as Settings from "@/lib/settings"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button";

// -------------------------------
// Device Profile Combobox Control
// -------------------------------

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"

export function DeviceProfileCombo() {
    const instSettings = Settings.Load();
    const [selectedProfile, setSelectedProfile] = React.useState(instSettings.deviceProfile);
    const [open, setOpen] = React.useState(false)

    const list = [
        {
            value: "desktop",
            label: "Desktop",
        },
        {
            value: "mobile",
            label: "Mobile",
        },
    ]

    const onSelect = (val: string) => {
        const newSettings = { ...instSettings, deviceProfile: val };
        Settings.Save(newSettings);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selectedProfile ? list.find((item) => item.value === selectedProfile)?.label : "Select..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>que?</CommandEmpty>
                        <CommandGroup>
                            {list.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                        onSelect(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedProfile === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

const FormSchema = z.object({
    theme: z.enum(['auto', 'light', 'dark']).default('auto').optional(),
    enablePlus: z.boolean().default(false).optional(),
    enableConsole: z.boolean().default(false).optional(),
    deviceProfile: z.string().default('desktop').optional(),
});

// ----------------------------
// Settings Dialog Content Host
// ----------------------------

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

export function SettingsContent() {
    const instSettings = Settings.Load();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            enablePlus: instSettings.enablePlus ?? false,
            enableConsole: instSettings.enableConsole ?? false,
            deviceProfile: instSettings.deviceProfile,
        },
    });

    const actionSave = (data: z.infer<typeof FormSchema>) => {
        const settingsToSave: Settings.ISettings = {
            enablePlus: data.enablePlus ?? false,
            enableConsole: data.enableConsole ?? false,
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
        <Form {...form}>
            <form className="w-full space-y-6">
                <div>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="enablePlus"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Enable Plus DLC</FormLabel>
                                        <FormDescription>
                                            Enables the Plus DLC on supported engines
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked);
                                                actionSave({ ...form.getValues(), enablePlus: checked });
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="enableConsole"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Enable Console</FormLabel>
                                        <FormDescription>
                                            Enables the emscripten console for the engines
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked);
                                                actionSave({ ...form.getValues(), enableConsole: checked });
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="deviceProfile"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Device Profile</FormLabel>
                                    </div>
                                    <FormControl>
                                        <DeviceProfileCombo />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </form>
        </Form>
    );
}
