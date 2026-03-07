// src/theme/index.js
import {createTheme, Button, ActionIcon} from '@mantine/core';

export const myTheme = createTheme({
    primaryColor: 'brand-primary',
    primaryShade: 6,
    defaultRadius: 'md',

    colors: {
        'brand-primary': [
            "#f0f4fa", "#dee4ee", "#b9c7de", "#91a8d0", "#708ec3",
            "#5b7ebc", "#5075ba", "#4164a4", "#385993", "#1b3052"
        ],
        'brand-secondary': [
            '#fff0f6', '#ffdeeb', '#f7b6d2', '#f08cb1', '#e86a94',
            '#e14b7d', '#da396e', '#c2275d', '#ae1b50', '#981144'
        ],
    },

    components: {
        Button: Button.extend({
            defaultProps: {
                fw: 500,
            },
        }),
        Text: {
            defaultProps: {
                c: 'gray.7',
            },
        },
        Title: {
            defaultProps: {
                c: 'gray.9',
            },
        },
    },
});