'use client';

import * as React from 'react';

// --------------------
// UI Component Imports
// --------------------

import * as Icons from 'lucide-react';

import * as Card from '@/components/ui/card';
import * as Accordion from '@/components/ui/accordion';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// ---------------
// Home Components
// ---------------

const HomePage: React.FC = () => {
    return (
        <div className='space-y-2'>

            <a className='flex items-center gap-4'>
                <Icons.Home />
                <h1 className='text-2xl font-bold'>Home</h1>
            </a>

            <p className='text-base text-muted-foreground'>
                <Label>Lorem ipsum dolor sit amet. Et suscipit corporis ut consequuntur enim est quia aliquam et quas esse vel laudantium quas cu deleniti velit.</Label>
                <span
                    data-br=':r2g:'
                    data-brr='1'
                    style={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        textDecoration: 'inherit',
                        maxWidth: '436px'
                    }}
                >

                </span>
            </p>

            {/* TEMP until real implementation - Recents */}

            <div className='pt-6'>
                <Label>Recently Used</Label>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-2'>
                <Card.Card>
                    <Card.CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <Card.CardTitle className='text-sm font-medium'>Engine 1</Card.CardTitle>
                        <Icons.DollarSign className='h-4 w-4 text-muted-foreground' />
                    </Card.CardHeader>
                    <Card.CardContent>
                        <div className='text-2xl font-bold'>Content</div>
                        <p className='text-xs text-muted-foreground'>Description</p>
                    </Card.CardContent>
                    <Card.CardFooter className='flex justify-between'>
                        <Button variant='outline'>Button</Button>
                    </Card.CardFooter>
                </Card.Card>

                <Card.Card>
                    <Card.CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <Card.CardTitle className='text-sm font-medium'>Engine 2</Card.CardTitle>
                        <Icons.DollarSign className='h-4 w-4 text-muted-foreground' />
                    </Card.CardHeader>
                    <Card.CardContent>
                        <div className='text-2xl font-bold'>Content</div>
                        <p className='text-xs text-muted-foreground'>Description</p>
                    </Card.CardContent>
                    <Card.CardFooter className='flex justify-between'>
                        <Button variant='outline'>Button</Button>
                    </Card.CardFooter>
                </Card.Card>

                <Card.Card>
                    <Card.CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <Card.CardTitle className='text-sm font-medium'>Tool</Card.CardTitle>
                        <Icons.DollarSign className='h-4 w-4 text-muted-foreground' />
                    </Card.CardHeader>
                    <Card.CardContent>
                        <div className='text-2xl font-bold'>Content</div>
                        <p className='text-xs text-muted-foreground'>Description</p>
                    </Card.CardContent>
                    <Card.CardFooter className='flex justify-between'>
                        <Button variant='outline'>Button</Button>
                    </Card.CardFooter>
                </Card.Card>

                <Card.Card>
                    <Card.CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <Card.CardTitle className='text-sm font-medium'>Engine 3</Card.CardTitle>
                        <Icons.DollarSign className='h-4 w-4 text-muted-foreground' />
                    </Card.CardHeader>
                    <Card.CardContent>
                        <div className='text-2xl font-bold'>Content</div>
                        <p className='text-xs text-muted-foreground'>Description</p>
                    </Card.CardContent>
                    <Card.CardFooter className='flex justify-between'>
                        <Button variant='outline'>Button</Button>
                    </Card.CardFooter>
                </Card.Card>
            </div>

            <div className='pt-6'>
                <Label>Help/Support</Label>
            </div>

            {/* Disable react/no-unescaped-entities */}
            <Accordion.Accordion type='single' collapsible>
                <Accordion.AccordionItem value='item-1'>
                    <Accordion.AccordionTrigger>Bug reporting</Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                        Bug something something make sure that its a bug with RSDK-Library
                        and not a decomp bug something submit decomp bugs here something
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>
                <Accordion.AccordionItem value='item-2'>
                    <Accordion.AccordionTrigger>How do I use RSDK-Libray?</Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                        Add files via File manager hyperlink settings.ini something something
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>
                <Accordion.AccordionItem value='item-3'>
                    <Accordion.AccordionTrigger>RSDK wont start</Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                        a
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>
                <Accordion.AccordionItem value='item-4'>
                    <Accordion.AccordionTrigger>Can I use Plus?</Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                        something about decomp license allowing toggle go to settings yes
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>
            </Accordion.Accordion>

        </div>
    )
}

export default HomePage;