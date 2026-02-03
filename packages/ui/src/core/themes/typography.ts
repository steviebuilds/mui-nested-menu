import { css } from '@emotion/react';

export type TypographyConfig = {
    family: string;
};

export const themeTypography: TypographyConfig = {
    family: `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, 'Noto Sans', Ubuntu, Cantarell, 'Helvetica Neue', Arial,
        sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
        'Noto Color Emoji'`,
};

const h1 = css`
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.167;
    margin: 0 0 0.35em;
`;

const h2 = css`
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.2;
    margin: 0 0 0.35em;
`;

const h3 = css`
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.167;
    margin: 0 0 0.35em;
`;

const h4 = css`
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.005em;
    line-height: 1.235;
    margin: 0 0 0.35em;
`;

const h5 = css`
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 1.125rem;
    font-weight: 500;
    letter-spacing: 0em;
    line-height: 1.334;
    margin: 0 0 0.35em;
`;

const h6 = css`
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0em;
    line-height: 1.6;
    margin: 0 0 0.35em;
`;

const overline = css`
    display: block;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    line-height: 1.66;
    margin: 0 0 0.35em;
    text-transform: uppercase;
`;

const subtitle = css`
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 0.00938em;
    line-height: 1.75;
    margin: 0 0 0.35em;
`;

const subtitle2 = css`
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.00714em;
    line-height: 1.57;
    margin: 0 0 0.35em;
`;

const body = css`
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 0.00938em;
    line-height: 1.7;
    margin: 0 0 0.35em;
`;

const body2 = css`
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0.01071em;
    line-height: 1.5;
    margin: 0 0 0.35em;
`;

export const typography = {
    body,
    body2,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    overline,
    subtitle,
    subtitle2,
};
