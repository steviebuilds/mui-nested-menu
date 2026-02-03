export const zincScale = {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
};

export type PaletteConfig = {
    bg1: string;
    bg2: string;
    bg3: string;
    border1: string;
    brand1: string;
    brand2: string;
    brandAccent: string;
    darkAccent: string;
    disabled: string;
    font1: string;
    font2: string;
    font3: string;
    mode: 'dark' | 'light';
    onBrand1: string;
    statusError: string;
    statusInfo: string;
    statusSuccess: string;
    statusWarning: string;
};

export const lightPalette: PaletteConfig = {
    bg1: '#FFFFFF',
    bg2: zincScale[100],
    bg3: zincScale[200],
    border1: zincScale[200],
    brand1: '#0EA5E9',
    brand2: '#0284C7',
    brandAccent: '#06B6D4',
    darkAccent: zincScale[900],
    disabled: '#00000020',
    font1: zincScale[900],
    font2: zincScale[700],
    font3: zincScale[500],
    mode: 'light',
    onBrand1: '#FFFFFF',
    statusError: '#EF4444',
    statusInfo: '#3B82F6',
    statusSuccess: '#22C55E',
    statusWarning: '#F59E0B',
};

export const darkPalette: PaletteConfig = {
    bg1: zincScale[950],
    bg2: zincScale[900],
    bg3: zincScale[800],
    border1: zincScale[800],
    brand1: '#38BDF8',
    brand2: '#0EA5E9',
    brandAccent: '#22D3EE',
    darkAccent: zincScale[100],
    disabled: '#FFFFFF20',
    font1: zincScale[50],
    font2: zincScale[300],
    font3: zincScale[500],
    mode: 'dark',
    onBrand1: zincScale[950],
    statusError: '#EF4444',
    statusInfo: '#3B82F6',
    statusSuccess: '#22C55E',
    statusWarning: '#F59E0B',
};
