import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';

export type PropRow = {
    name: string;
    type: string;
    default?: string;
    description: ReactNode;
    /** Version the prop was added in, shown as a small badge (e.g. '4.1'). */
    since?: string;
    required?: boolean;
};

const TableWrapper = styled.div`
    ${({ theme }) => css`
        border: 1px solid ${theme.palette.border1};
        border-radius: ${theme.sizes.borderRadiusLarge};
        margin: 8px 0 24px;
        overflow-x: auto;
    `}
`;

const Table = styled.table`
    ${({ theme }) => css`
        border-collapse: collapse;
        color: ${theme.palette.font2};
        font-family: ${theme.typeography.family};
        font-size: 0.8125rem;
        line-height: 1.55;
        width: 100%;

        th {
            background-color: ${theme.palette.bg2};
            border-bottom: 1px solid ${theme.palette.border1};
            color: ${theme.palette.font3};
            font-size: 0.6875rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            padding: 8px 12px;
            text-align: left;
            text-transform: uppercase;
            white-space: nowrap;
        }

        td {
            border-bottom: 1px solid ${theme.palette.border1};
            padding: 10px 12px;
            vertical-align: top;
        }

        tr:last-of-type td {
            border-bottom: none;
        }
    `}
`;

const Mono = styled.code`
    ${({ theme }) => css`
        color: ${theme.palette.font1};
        font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
        font-size: 0.75rem;
    `}
`;

const TypeCode = styled.code`
    ${({ theme }) => css`
        color: ${theme.palette.mode === 'light' ? '#7C3AED' : '#C4B5FD'};
        font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
        font-size: 0.75rem;
        white-space: pre-wrap;
        word-break: break-word;
    `}
`;

const Badge = styled.span`
    ${({ theme }) => css`
        background-color: ${theme.palette.mode === 'light' ? '#ECFDF5' : '#052E1C'};
        border: 1px solid ${theme.palette.mode === 'light' ? '#A7F3D0' : '#065F46'};
        border-radius: 999px;
        color: ${theme.palette.mode === 'light' ? '#047857' : '#6EE7B7'};
        display: inline-block;
        font-size: 0.625rem;
        font-weight: 600;
        line-height: 1.4;
        margin-left: 6px;
        padding: 0 6px;
        vertical-align: 1px;
    `}
`;

const Required = styled.span`
    ${({ theme }) => css`
        color: ${theme.palette.statusError};
        margin-left: 2px;
    `}
`;

type PropsTableProps = {
    rows: PropRow[];
    /** Heading of the first column, e.g. 'Field' for data types. */
    nameLabel?: string;
};

export const PropsTable: FC<PropsTableProps> = ({ rows, nameLabel = 'Prop' }) => (
    <TableWrapper>
        <Table>
            <thead>
                <tr>
                    <th>{nameLabel}</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.name}>
                        <td style={{ whiteSpace: 'nowrap' }}>
                            <Mono>{row.name}</Mono>
                            {row.required && <Required title="Required">*</Required>}
                            {row.since && <Badge title={`New in ${row.since}`}>{row.since}</Badge>}
                        </td>
                        <td>
                            <TypeCode>{row.type}</TypeCode>
                        </td>
                        <td>{row.default ? <Mono>{row.default}</Mono> : '–'}</td>
                        <td>{row.description}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </TableWrapper>
);
