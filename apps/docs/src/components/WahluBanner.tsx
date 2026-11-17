import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC } from 'react';

import { WAHLU_BANNER_URL } from '@/core/links';

const BannerLink = styled.a`
    ${({ theme }) => css`
        border: 1px solid ${theme.palette.border1};
        border-radius: ${theme.sizes.borderRadiusLarge};
        display: block;
        line-height: 0;
        overflow: hidden;
        transition: box-shadow 150ms ease;

        &:hover {
            box-shadow: 0 6px 24px rgba(0, 0, 0, ${theme.palette.mode === 'light' ? 0.08 : 0.35});
        }

        &:focus-visible {
            outline: 2px solid ${theme.palette.brand1};
            outline-offset: 2px;
        }

        img {
            aspect-ratio: 4 / 1;
            display: block;
            height: auto;
            width: 100%;
        }
    `}
`;

const Caption = styled.span`
    ${({ theme }) => css`
        color: ${theme.palette.font3};
        display: block;
        font-size: 0.6875rem;
        letter-spacing: 0.04em;
        margin-top: 6px;
        text-align: right;
    `}
`;

export const WahluBanner: FC = () => (
    <div>
        <BannerLink href={WAHLU_BANNER_URL} rel="noopener sponsored" target="_blank">
            <img
                alt="Wahlu: Social media, run by your AI agent. Connect Claude, ChatGPT or Cursor and let it plan and schedule posts for Instagram, TikTok, LinkedIn, X and more. Start for $1."
                height={640}
                src="/wahlu-banner.png"
                width={2560}
            />
        </BannerLink>
        <Caption>Sponsor</Caption>
    </div>
);
