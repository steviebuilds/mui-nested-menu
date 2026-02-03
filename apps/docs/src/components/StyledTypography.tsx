import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';
import { Typography } from 'ui';

const StyledParagraph = styled(Typography)`
    line-height: 1.7;
    margin-bottom: ${({ theme }) => `calc(${theme.sizes.padding} * 5)`};
`;

type ParagraphProps = {
    children?: ReactNode;
};

export const P: FC<ParagraphProps> = ({ children, ...props }) => (
    <StyledParagraph variant="body" {...props}>
        {children}
    </StyledParagraph>
);

const StyledCode = styled.span`
    ${({ theme }) => css`
        background-color: ${theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B'};
        border: 1px solid ${theme.palette.mode === 'light' ? '#E2E8F0' : '#334155'};
        border-radius: ${theme.sizes.borderRadiusSmall};
        color: ${theme.palette.mode === 'light' ? '#0F172A' : '#E2E8F0'};
        display: inline-block;
        font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
        font-size: 0.8125rem;
        line-height: 1.4;
        padding: 2px 6px;
    `};
`;

type CodeProps = {
    children?: ReactNode;
};

export const Code: FC<CodeProps> = ({ children, ...props }) => <StyledCode {...props}>{children}</StyledCode>;

const StyledSubheading = styled(Typography)`
    ${({ theme }) => css`
        border-bottom: 1px solid ${theme.palette.border1};
        margin-top: 32px;
        padding-bottom: 8px;
    `}
`;

type SubheadingProps = {
    children?: ReactNode;
};

export const Subheading: FC<SubheadingProps> = ({ children, ...props }) => (
    <StyledSubheading variant="h3" {...props}>
        {children}
    </StyledSubheading>
);
