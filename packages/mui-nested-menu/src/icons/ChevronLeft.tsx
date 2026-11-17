import type { SvgIconProps } from '@mui/material';
import { SvgIcon } from '@mui/material';

export const ChevronLeft = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M14.71 6.71c.39.39.39 1.02 0 1.41L10.83 12l3.88 3.88c.39.39.39 1.02 0 1.41-.39.39-1.02.39-1.41 0l-4.59-4.59c-.39-.39-.39-1.02 0-1.41l4.59-4.59c.38-.38 1.02-.38 1.41 0z"></path>
        </SvgIcon>
    );
};
