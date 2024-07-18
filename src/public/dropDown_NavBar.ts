// dropdownData.ts

import {groupsData} from './data';
export const wall = [
    {
        items: [
            { label: 'Kaplan1', to: '/waldl?option=Kaplan1' },
            { label: 'Yossi1', to: '/wall?option=Yossi1' },
            { label: 'Tal1', to: '/wall?option=Tal1' },
            { label: 'Kaplan2', to: '/wall?option=Kaplan2' },
            { label: 'Yossi2', to: '/wall?option=Yossi2' },
            { label: 'Tal2', to: '/wall?option=Tal2' },
            { label: 'Kaplan3', to: '/wall?option=Kaplan3' },
            { label: 'Yossi3', to: '/wall?option=Yossi3' },
            { label: 'Tal3', to: '/wall?option=Tal3' }
        ]
    }
];

export const piano = [
    {
        items: [
            { label: groupsData[0], to: '/piano?option='+groupsData[0] },
            { label: 'Megama2', to: '/piano?option=megama2' },
            { label: 'Megama3', to: '/piano?option=megama3' }
        ]
    }
];

export const megama = [
    {
        items: [
            { label: 'Megama1', to: '/Megame?option=megama1' },
            { label: 'Megama2', to: '/Megame?option=megama2' },
            { label: 'Megama3', to: '/Megame?option=megama3' }
        ]
    }
];

export const matrics = [
    {
        items: [
            { label: 'Option 1', to: '/matricsOption1' },
            { label: 'Option 2', to: '/matricsOption2' },
            { label: 'Option 3', to: '/matricsOption3' },
            { label: 'Option 4', to: '/matricsOption4' }
        ]
    }
];
