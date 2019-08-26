import React from 'react';
import { Transaction } from '../../types/Transaction';
import { colorFromCategory, iconFromCategory } from '../../helpers';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { makeStyles, Theme } from '@material-ui/core';
import { getContrastRatio } from '@material-ui/core/styles';
import { dark, light } from '@material-ui/core/styles/createPalette';

const useStyles = makeStyles((theme: Theme) => ({
  root: (props: Props) => ({
    fill: getContrastRatio(colorFromCategory(props.category), dark.text.primary) > theme.palette.contrastThreshold ? dark.text.primary : light.text.primary,
  }),
}));

interface Props {
  category: Transaction['category']
}

export default function TransactionIcon(props: Props) {
  const Icon = iconFromCategory(props.category);
  const classes = useStyles(props);
  return (
    <Icon
      component={(svgProps: SvgIconProps) => {
        return (
          <svg className={classes.root} {...svgProps}>
            {React.cloneElement(
              (svgProps.children as React.ReactNodeArray)[0] as React.ReactElement,
              {
                className: classes.root,
              },
            )}
          </svg>
        );
      }}
    />
  );
}
