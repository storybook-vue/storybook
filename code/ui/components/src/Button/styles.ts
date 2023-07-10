import type { ReactNode } from 'react';
import { styled } from '@storybook/theming';
import { darken, lighten, rgba, transparentize } from 'polished';
import type { ButtonProps } from './Button';

export const ButtonWrapper = styled.button<{
  btnType: ButtonProps['type'];
  size: ButtonProps['size'];
  variant: ButtonProps['variant'];
  disabled: ButtonProps['disabled'];
}>(({ theme, btnType, size, variant, disabled }) => ({
  border: 0,
  cursor: disabled ? 'not-allowed !important' : 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  overflow: 'hidden',
  padding: '0 16px',
  height: size === 'small' ? '28px' : '32px',
  position: 'relative',
  textAlign: 'center',
  textDecoration: 'none',
  transitionProperty: 'background, box-shadow',
  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-out',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  opacity: disabled ? 0.5 : 1,
  margin: 0,
  fontSize: `${theme.typography.size.s1}px`,
  fontWeight: theme.typography.weight.bold,
  lineHeight: '1',
  background: `${(() => {
    if (btnType === 'primary' && variant === 'solid') return theme.color.secondary;
    if (btnType === 'secondary' && variant === 'solid') return theme.button.background;
    return 'transparent';
  })()}`,
  color: `${(() => {
    if (btnType === 'primary' && variant === 'solid') return theme.color.lightest;
    if (btnType === 'secondary') return theme.color.darkest;
    if (variant === 'outline') return theme.color.darkest;
    return theme.color.darkest;
  })()}`,
  boxShadow:
    variant === 'solid' && btnType === 'primary'
      ? 'none'
      : `${theme.button.border} 0 0 0 1px inset`,
  borderRadius: theme.input.borderRadius,

  '&:hover': {
    background: `${(() => {
      let bgColor = theme.color.secondary;
      if (btnType === 'primary' && variant === 'solid') bgColor = theme.color.secondary;
      if (btnType === 'secondary' && variant === 'solid') bgColor = theme.button.background;
      if (btnType === 'primary' && variant === 'outline') bgColor = theme.button.background;
      if (btnType === 'secondary' && variant === 'outline') bgColor = theme.button.background;

      return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
    })()}`,
  },

  '&:active': {
    // background: theme.button.background,
    background: `${(() => {
      let bgColor = theme.color.secondary;
      if (btnType === 'primary' && variant === 'solid') bgColor = theme.color.secondary;
      if (btnType === 'secondary') bgColor = theme.button.background;

      return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
    })()}`,
  },

  '&:focus': {
    boxShadow: `${rgba(theme.color.secondary, 1)} 0 0 0 1px inset`,
    outline: 'none',
  },
}));

export const ButtonWrapperDepreciated = styled.button<{
  isLink?: boolean;
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  gray?: boolean;
  inForm?: boolean;
  disabled?: boolean;
  small?: boolean;
  outline?: boolean;
  containsIcon?: boolean;
  children?: ReactNode;
  href?: string;
}>(
  ({ small, theme }) => ({
    border: 0,
    borderRadius: '3em',
    cursor: 'pointer',
    display: 'inline-block',
    overflow: 'hidden',
    padding: small ? '8px 16px' : '13px 20px',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transitionProperty: 'background, box-shadow',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-out',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    opacity: 1,
    margin: 0,
    background: 'transparent',

    fontSize: `${small ? theme.typography.size.s1 : theme.typography.size.s2 - 1}px`,
    fontWeight: theme.typography.weight.bold,
    lineHeight: '1',

    svg: {
      display: 'inline-block',
      height: small ? 12 : 14,
      width: small ? 12 : 14,

      verticalAlign: 'top',
      marginRight: small ? 4 : 6,
      marginTop: small ? 0 : -1,
      marginBottom: small ? 0 : -1,

      /* Necessary for js mouse events to not glitch out when hovering on svgs */
      pointerEvents: 'none',

      path: {
        fill: 'currentColor',
      },
    },
  }),
  ({ disabled }) =>
    disabled
      ? {
          cursor: 'not-allowed !important',
          opacity: 0.5,
          '&:hover': {
            transform: 'none',
          },
        }
      : {},
  ({ containsIcon, small }) =>
    containsIcon
      ? {
          svg: {
            display: 'block',
            margin: 0,
          },
          ...(small ? { padding: 10 } : { padding: 13 }),
        }
      : {},
  ({ theme, primary, secondary, gray }) => {
    let color;

    if (gray) {
      color = theme.color.mediumlight;
    } else if (secondary) {
      color = theme.color.secondary;
    } else if (primary) {
      color = theme.color.primary;
    }

    return color
      ? {
          background: color,
          color: gray ? theme.color.darkest : theme.color.lightest,

          '&:hover': {
            background: darken(0.05, color),
          },
          '&:active': {
            boxShadow: 'rgba(0, 0, 0, 0.1) 0 0 0 3em inset',
          },
          '&:focus': {
            boxShadow: `${rgba(color, 1)} 0 1px 9px 2px`,
            outline: 'none',
          },
          '&:focus:hover': {
            boxShadow: `${rgba(color, 0.2)} 0 8px 18px 0px`,
          },
        }
      : {};
  },
  ({ theme, tertiary, inForm, small }) =>
    tertiary
      ? {
          background: theme.button.background,
          color: theme.input.color,
          boxShadow: `${theme.button.border} 0 0 0 1px inset`,
          borderRadius: theme.input.borderRadius,

          ...(inForm && small ? { padding: '10px 16px' } : {}),

          '&:hover': {
            background:
              theme.base === 'light'
                ? darken(0.02, theme.button.background)
                : lighten(0.03, theme.button.background),
            ...(inForm
              ? {}
              : {
                  boxShadow: 'rgba(0,0,0,.2) 0 2px 6px 0, rgba(0,0,0,.1) 0 0 0 1px inset',
                }),
          },
          '&:active': {
            background: theme.button.background,
          },
          '&:focus': {
            boxShadow: `${rgba(theme.color.secondary, 1)} 0 0 0 1px inset`,
            outline: 'none',
          },
        }
      : {},
  ({ theme, outline }) =>
    outline
      ? {
          boxShadow: `${transparentize(0.8, theme.color.defaultText)} 0 0 0 1px inset`,
          color: transparentize(0.3, theme.color.defaultText),
          background: 'transparent',

          '&:hover, &:focus': {
            boxShadow: `${transparentize(0.5, theme.color.defaultText)} 0 0 0 1px inset`,
            outline: 'none',
          },

          '&:active': {
            boxShadow: `${transparentize(0.5, theme.color.defaultText)} 0 0 0 2px inset`,
            color: transparentize(0, theme.color.defaultText),
          },
        }
      : {},
  ({ theme, outline, primary }) => {
    const color = theme.color.primary;

    return outline && primary
      ? {
          boxShadow: `${color} 0 0 0 1px inset`,
          color,

          'svg path': {
            fill: color,
          },

          '&:hover': {
            boxShadow: `${color} 0 0 0 1px inset`,
            background: 'transparent',
          },

          '&:active': {
            background: color,
            boxShadow: `${color} 0 0 0 1px inset`,
            color: theme.color.tertiary,
          },
          '&:focus': {
            boxShadow: `${color} 0 0 0 1px inset, ${rgba(color, 0.4)} 0 1px 9px 2px`,
            outline: 'none',
          },
          '&:focus:hover': {
            boxShadow: `${color} 0 0 0 1px inset, ${rgba(color, 0.2)} 0 8px 18px 0px`,
          },
        }
      : {};
  },
  ({ theme, outline, primary, secondary }) => {
    let color;

    if (secondary) {
      color = theme.color.secondary;
    } else if (primary) {
      color = theme.color.primary;
    }

    return outline && color
      ? {
          boxShadow: `${color} 0 0 0 1px inset`,
          color,

          'svg path': {
            fill: color,
          },

          '&:hover': {
            boxShadow: `${color} 0 0 0 1px inset`,
            background: 'transparent',
          },

          '&:active': {
            background: color,
            boxShadow: `${color} 0 0 0 1px inset`,
            color: theme.color.tertiary,
          },
          '&:focus': {
            boxShadow: `${color} 0 0 0 1px inset, ${rgba(color, 0.4)} 0 1px 9px 2px`,
            outline: 'none',
          },
          '&:focus:hover': {
            boxShadow: `${color} 0 0 0 1px inset, ${rgba(color, 0.2)} 0 8px 18px 0px`,
          },
        }
      : {};
  }
);