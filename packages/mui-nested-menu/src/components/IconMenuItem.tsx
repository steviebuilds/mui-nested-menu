import type { MenuItemProps, SxProps } from '@mui/material';
import { Box, MenuItem, styled, Typography } from '@mui/material';
import React, { forwardRef, RefObject } from 'react';

const StyledMenuItem = styled(MenuItem)({
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '4px',
    paddingRight: '4px',
});

const StyledTypography = styled(Typography)({
    paddingLeft: '8px',
    paddingRight: '8px',
    textAlign: 'left',
});

const FlexBox = styled(Box)({
    display: 'flex',
});

type IconMenuItemProps = {
    MenuItemProps?: MenuItemProps;
    className?: string;
    disabled?: boolean;
    label?: string;
    renderLabel?: () => React.ReactNode;
    leftIcon?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    ref?: RefObject<HTMLLIElement>;
    rightIcon?: React.ReactNode;
    sx?: SxProps;
};

const toSxArray = (sx?: MenuItemProps['sx']) => (Array.isArray(sx) ? sx : sx === undefined ? [] : [sx]);

export const IconMenuItem = forwardRef<HTMLLIElement, IconMenuItemProps>(function IconMenuItem(
    {
        MenuItemProps: { className: itemClassName, onClick: itemOnClick, sx: itemSx, ...itemProps } = {},
        className,
        disabled,
        label,
        leftIcon,
        onClick,
        renderLabel,
        rightIcon,
        sx,
        ...props
    },
    ref
) {
    const classNames = [itemClassName, className].filter(Boolean).join(' ') || undefined;
    const handleClick =
        itemOnClick || onClick
            ? (event: React.MouseEvent<HTMLLIElement>) => {
                  itemOnClick?.(event);
                  onClick?.(event);
              }
            : undefined;

    return (
        <StyledMenuItem
            {...itemProps}
            {...props}
            ref={ref}
            className={classNames}
            disabled={disabled ?? itemProps.disabled}
            onClick={handleClick}
            sx={[...toSxArray(itemSx), ...toSxArray(sx as MenuItemProps['sx'])]}
        >
            <FlexBox>
                {leftIcon}
                {renderLabel ? renderLabel() : <StyledTypography>{label}</StyledTypography>}
            </FlexBox>
            {rightIcon}
        </StyledMenuItem>
    );
});
