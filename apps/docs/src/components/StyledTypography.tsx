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
        scroll-margin-top: 24px;
    `}
`;

type SubheadingProps = {
    children?: ReactNode;
    /** Anchor id, so other pages and issues can link straight to the section. */
    id?: string;
};

export const Subheading: FC<SubheadingProps> = ({ children, ...props }) => (
    <StyledSubheading variant="h3" {...props}>
        {children}
    </StyledSubheading>
);

export const List = styled.ul`
    ${({ theme }) => css`
        color: ${theme.palette.font2};
        font-family: ${theme.typeography.family};
        font-size: 1rem;
        line-height: 1.7;
        margin-bottom: calc(${theme.sizes.padding} * 5);
        padding-left: 1.4em;

        li {
            margin-bottom: 4px;
        }
    `}
`;

export const OrderedList = List.withComponent('ol');

const CalloutContainer = styled.div`
    ${({ theme }) => css`
        background-color: ${theme.palette.mode === 'light' ? '#F0F9FF' : '#0C1A2B'};
        border: 1px solid ${theme.palette.mode === 'light' ? '#BAE6FD' : '#1E3A5F'};
        border-radius: ${theme.sizes.borderRadiusMedium};
        color: ${theme.palette.font2};
        font-family: ${theme.typeography.family};
        font-size: 0.9375rem;
        line-height: 1.65;
        margin: 8px 0 20px;
        padding: 12px 16px;
    `}
`;

type CalloutProps = {
    children?: ReactNode;
};

export const Callout: FC<CalloutProps> = ({ children }) => <CalloutContainer>{children}</CalloutContainer>;
