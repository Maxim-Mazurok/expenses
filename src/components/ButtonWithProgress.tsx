import { Button, CircularProgress } from '@material-ui/core';
import React, { FormEvent } from 'react';
import { ButtonProps } from '@material-ui/core/Button';
import { CircularProgressProps } from '@material-ui/core/CircularProgress';

const loadingIconSize = 24;

interface Props {
  disabled: boolean,
  onClick: (event: FormEvent) => void,
  text: string,
  processing: boolean,
  buttonProps?: ButtonProps,
  circularProgressProps?: CircularProgressProps,
}

export const ButtonWithProgress = (
  {
    disabled,
    onClick,
    text,
    processing,
    buttonProps,
    circularProgressProps,
  }: Props) => (
  <div
    style={{
      position: 'relative',
    }}
  >
    <Button
      type={'submit'}
      disabled={disabled}
      onClick={onClick}
      {...buttonProps}
    >
      {text}
      {processing && <CircularProgress
        color={'secondary'}
        size={loadingIconSize}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: -loadingIconSize / 2,
          marginLeft: -loadingIconSize / 2,
        }}
        disableShrink
        {...circularProgressProps}
      />}
    </Button>
  </div>
);
