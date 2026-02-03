import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';
import { Row } from 'ui';

type SampleBoxProps = {
    children?: ReactNode;
    contrast?: boolean;
};

const SampleContainer = styled.div`
    ${({ theme }) => css`
        background-color: ${theme.palette.mode === 'light' ? '#FAFAFA' : '#18181B'};
        border: 1px solid ${theme.palette.border1};
        border-radius: ${theme.sizes.borderRadiusLarge};
        color: ${theme.palette.font1};
        padding: calc(${theme.sizes.padding} * 8);
    `}
`;

export const SampleBox: FC<SampleBoxProps> = ({ children }) => {
    return (
        <SampleContainer>
            <Row justify="space-around">{children}</Row>
        </SampleContainer>
    );
};
