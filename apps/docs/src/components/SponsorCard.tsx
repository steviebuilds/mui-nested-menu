import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC } from 'react';

import { WAHLU_CARD_URL } from '@/core/links';

const WAHLU_GRADIENT =
    'linear-gradient(90deg, #1a87e1 0%, #21b5d6 14%, #6dd17a 29%, #c0db61 43%, #efaf5e 57%, #e77c76 71%, #e04b9d 86%, #ca16bf 100%)';

const Card = styled.a`
    ${({ theme }) => css`
        background-color: ${theme.palette.bg1};
        border: 1px solid ${theme.palette.border1};
        border-radius: ${theme.sizes.borderRadiusLarge};
        color: ${theme.palette.font2};
        display: block;
        font-family: ${theme.typeography.family};
        overflow: hidden;
        position: relative;
        text-decoration: none;
        transition:
            border-color 150ms ease,
            box-shadow 150ms ease;
        width: 100%;

        &::before {
            background: ${WAHLU_GRADIENT};
            content: '';
            display: block;
            height: 3px;
        }

        &:hover {
            border-color: ${theme.palette.font3};
            box-shadow: 0 4px 16px rgba(0, 0, 0, ${theme.palette.mode === 'light' ? 0.06 : 0.3});
        }

        &:focus-visible {
            outline: 2px solid ${theme.palette.brand1};
            outline-offset: 2px;
        }
    `}
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px 14px;
`;

const Label = styled.span`
    ${({ theme }) => css`
        color: ${theme.palette.font3};
        font-size: 0.625rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    `}
`;

const Brand = styled.span`
    ${({ theme }) => css`
        align-items: center;
        color: ${theme.palette.font1};
        display: flex;
        font-size: 0.9375rem;
        font-weight: 600;
        gap: 6px;
    `}
`;

const Headline = styled.span`
    ${({ theme }) => css`
        color: ${theme.palette.font1};
        font-size: 0.8125rem;
        font-weight: 500;
        line-height: 1.4;
    `}
`;

const Text = styled.span`
    ${({ theme }) => css`
        color: ${theme.palette.font3};
        font-size: 0.75rem;
        line-height: 1.5;
    `}
`;

const Cta = styled.span`
    ${({ theme }) => css`
        color: ${theme.palette.font1};
        font-size: 0.75rem;
        font-weight: 600;
        margin-top: 2px;
    `}
`;

export const SponsorCard: FC = () => (
    <Card href={WAHLU_CARD_URL} rel="noopener sponsored" target="_blank">
        <Body>
            <Label>Sponsor</Label>
            <Brand>
                <img alt="" height={20} src="/wahlu-mark.svg" width={20} />
                Wahlu
            </Brand>
            <Headline>Social media, run by your AI agent.</Headline>
            <Text>Connect Claude, ChatGPT or Cursor and let it plan and schedule your posts.</Text>
            <Cta>Start for $1 →</Cta>
        </Body>
    </Card>
);
