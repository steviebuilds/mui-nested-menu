import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, Fragment, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { CodeBlock } from '@/components/CodeBlock';
import { getPageFromRoute } from '@/core/routes/routeMap';

type PageHeaderProps = {
    /** Page title. Defaults to the route's name. */
    title?: string;
    /** One or two sentences under the title. */
    description?: ReactNode;
    /** Import statement. Defaults to importing the route's name. Pass `false` to hide it. */
    importCode?: string | false;
};

const Title = styled.h1`
    ${({ theme }) => css`
        color: ${theme.palette.font1};
        font-family: ${theme.typeography.family};
        font-size: 2.25rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        line-height: 1.2;
        margin-bottom: 12px;
    `}
`;

const Lead = styled.p`
    ${({ theme }) => css`
        color: ${theme.palette.font3};
        font-family: ${theme.typeography.family};
        font-size: 1.125rem;
        line-height: 1.6;
        margin-bottom: 24px;
    `}
`;

export const PageHeader: FC<PageHeaderProps> = ({ title, description, importCode }) => {
    const location = useLocation();
    const info = getPageFromRoute(location.pathname);
    const pageTitle = title ?? info?.name ?? '';
    const code = importCode ?? `import { ${pageTitle} } from 'mui-nested-menu';`;

    return (
        <Fragment>
            <Title>{pageTitle}</Title>
            {description && <Lead>{description}</Lead>}
            {code && <CodeBlock code={code} />}
        </Fragment>
    );
};
