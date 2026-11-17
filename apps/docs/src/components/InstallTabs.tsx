import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, useState } from 'react';

import { CodeBlock } from '@/components/CodeBlock';

const managers = {
    npm: 'npm install',
    pnpm: 'pnpm add',
    yarn: 'yarn add',
};

type Manager = keyof typeof managers;

const Tabs = styled.div`
    ${({ theme }) => css`
        background-color: ${theme.palette.bg2};
        border: 1px solid ${theme.palette.border1};
        border-radius: 999px;
        display: inline-flex;
        gap: 2px;
        margin-top: 8px;
        padding: 3px;
    `}
`;

const Tab = styled.button<{ active: boolean }>`
    ${({ theme, active }) => css`
        appearance: none;
        background-color: ${active ? theme.palette.bg1 : 'transparent'};
        border: none;
        border-radius: 999px;
        box-shadow: ${active ? '0 1px 2px rgba(0, 0, 0, 0.12)' : 'none'};
        color: ${active ? theme.palette.font1 : theme.palette.font3};
        cursor: pointer;
        font-family: ${theme.typeography.family};
        font-size: 0.8125rem;
        font-weight: 500;
        padding: 4px 14px;
        transition:
            background-color 150ms ease,
            color 150ms ease;

        &:hover {
            color: ${theme.palette.font1};
        }
    `}
`;

type InstallTabsProps = {
    packages: string;
};

export const InstallTabs: FC<InstallTabsProps> = ({ packages }) => {
    const [manager, setManager] = useState<Manager>('npm');

    return (
        <div>
            <Tabs aria-label="Package manager" role="tablist">
                {(Object.keys(managers) as Manager[]).map((name) => (
                    <Tab
                        active={name === manager}
                        aria-selected={name === manager}
                        key={name}
                        onClick={() => setManager(name)}
                        role="tab"
                    >
                        {name}
                    </Tab>
                ))}
            </Tabs>
            <CodeBlock code={`${managers[manager]} ${packages}`} lang="bash" />
        </div>
    );
};
