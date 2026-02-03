/* eslint-disable simple-import-sort/imports */
/* eslint-disable import/no-named-as-default-member */
import Prism from 'prismjs';
import '@/core/styles/prism.css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Fragment, useEffect, useRef, useState, memo } from 'react';
import { Row, useSnackbar } from 'ui';

type CodeBlockProps = {
    code?: string;
    collapsable?: boolean;
    noCopy?: boolean;
    lang?: 'tsx' | 'typescript';
};

const CodeBlockContainer = styled.div`
    ${({ theme }) => css`
        background-color: ${theme.palette.mode === 'light' ? '#1E293B' : '#0F172A'};
        border: 1px solid ${theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B'};
        border-radius: ${theme.sizes.borderRadiusLarge};
        margin: 8px 0 16px;
        overflow: hidden;
    `}
`;

const CodeBlockHeader = styled.div`
    ${({ theme }) => css`
        align-items: center;
        border-bottom: 1px solid ${theme.palette.mode === 'light' ? '#334155' : '#1E293B'};
        display: flex;
        justify-content: flex-end;
        padding: 4px 8px;
    `}
`;

const CodeButton = styled.button`
    appearance: none;
    background: none;
    border: none;
    border-radius: 6px;
    color: #94A3B8;
    cursor: pointer;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.75rem;
    padding: 4px 10px;
    transition: color 150ms ease;

    &:hover {
        color: #E2E8F0;
    }
`;

const Pre = styled.pre<{ restrictHeight: number }>`
    margin: 0;
    max-height: ${({ restrictHeight }) => (restrictHeight ? '185px' : '1000px')};
    overflow: auto;
    padding: 1rem 1.25rem;
    transition: max-height 300ms ease-in-out;
`;

const Code = styled.code`
    ${({ theme }) => css`
        border-radius: ${theme.sizes.borderRadiusMedium};
        font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
        font-size: 0.8125rem;
        line-height: 1.7;
    `};
`;

export const CodeBlock = memo(function CodeBlock({
    code,
    collapsable,
    lang = 'tsx',
    noCopy,
    ...props
}: CodeBlockProps) {
    const snackbar = useSnackbar();
    const ref = useRef(null);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsable ?? false);

    useEffect(() => {
        if (ref.current) {
            Prism.highlightElement(ref.current);
        }
    }, [ref.current, code]);

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
        setTimeout(() => {
            if (ref && ref.current) {
                Prism.highlightElement(ref.current);
            }
        }, 5);
    };

    const handleCopyClicked = () => {
        navigator.clipboard.writeText(code ?? '').then(() => snackbar.success('Copied to clipboard'));
    };

    const restrictHeight = collapsable && isCollapsed;

    return (
        <CodeBlockContainer>
            <CodeBlockHeader>
                {collapsable && (
                    <CodeButton onClick={toggleCollapse}>
                        {isCollapsed ? 'Expand' : 'Collapse'}
                    </CodeButton>
                )}
                {!noCopy && (
                    <CodeButton onClick={handleCopyClicked}>
                        Copy
                    </CodeButton>
                )}
            </CodeBlockHeader>
            <Pre restrictHeight={restrictHeight ? 1 : 0} {...props}>
                <Code className={`language-${lang}`} ref={ref}>
                    {code}
                </Code>
            </Pre>
        </CodeBlockContainer>
    );
});
