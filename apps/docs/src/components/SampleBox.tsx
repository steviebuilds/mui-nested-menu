import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { FC, ReactNode, useMemo } from 'react';
import { useTheme } from 'ui';

type SampleBoxProps = {
    children?: ReactNode;
    /** Short hint shown under the demo, e.g. how to open it. */
    hint?: ReactNode;
    /** Horizontal alignment of the demo content. */
    justify?: 'center' | 'flex-end' | 'flex-start' | 'space-around';
};

const SampleContainer = styled.div`
    ${({ theme }) => css`
        background-color: ${theme.palette.mode === 'light' ? '#FAFAFA' : '#18181B'};
        background-image: radial-gradient(
            ${theme.palette.mode === 'light' ? '#E4E4E7' : '#27272A'} 1px,
            transparent 1px
        );
        background-size: 16px 16px;
        border: 1px solid ${theme.palette.border1};
        border-radius: ${theme.sizes.borderRadiusLarge};
        color: ${theme.palette.font1};
        margin: 8px 0;
        padding: calc(${theme.sizes.padding} * 8);
    `}
`;

const DemoRow = styled.div<{ justify: string }>`
    ${({ justify }) => css`
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        justify-content: ${justify};
        min-height: 56px;
        width: 100%;
    `}
`;

const Hint = styled.p`
    ${({ theme }) => css`
        color: ${theme.palette.font3};
        font-family: ${theme.typeography.family};
        font-size: 0.75rem;
        margin-top: 16px;
        text-align: center;
    `}
`;

/**
 * Wraps a live demo. Demos get an MUI theme that follows the site's light or dark mode,
 * so the menus look the way they would in a real app.
 */
export const SampleBox: FC<SampleBoxProps> = ({ children, hint, justify = 'space-around' }) => {
    const siteTheme = useTheme();
    const mode = siteTheme.palette.mode;
    const muiTheme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

    return (
        <SampleContainer>
            <MuiThemeProvider theme={muiTheme}>
                <DemoRow justify={justify}>{children}</DemoRow>
            </MuiThemeProvider>
            {hint && <Hint>{hint}</Hint>}
        </SampleContainer>
    );
};
