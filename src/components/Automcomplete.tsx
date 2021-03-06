import React, { Component, CSSProperties, HTMLAttributes } from 'react';
import Select from 'react-select';
import {
  createStyles,
  emphasize,
  Theme,
  withStyles,
  withTheme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField, { BaseTextFieldProps } from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { ValueContainerProps } from 'react-select/src/components/containers';
import { ControlProps } from 'react-select/src/components/Control';
import { MenuProps, NoticeProps } from 'react-select/src/components/Menu';
import { OptionProps } from 'react-select/src/components/Option';
import { PlaceholderProps } from 'react-select/src/components/Placeholder';
import { SingleValueProps } from 'react-select/src/components/SingleValue';
import { ValueType } from 'react-select/src/types';
import { Omit } from '@material-ui/types';
import GlobalState from '../types/GlobalState';

type OptionType = {
  label: string;
  value: string;
}

function NoOptionsMessage(props: NoticeProps<OptionType>) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

type InputComponentProps =
  Pick<BaseTextFieldProps, 'inputRef'>
  & HTMLAttributes<HTMLDivElement>;

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: ControlProps<OptionType>) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

function Option(props: OptionProps<OptionType>) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

type MuiPlaceholderProps = Omit<PlaceholderProps<OptionType>, 'innerProps'> &
  Partial<Pick<PlaceholderProps<OptionType>, 'innerProps'>>;

function Placeholder(props: MuiPlaceholderProps) {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography color="textSecondary"
                className={selectProps.classes.placeholder} {...innerProps}>
      {children}
    </Typography>
  );
}

function SingleValue(props: SingleValueProps<OptionType>) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props: ValueContainerProps<OptionType>) {
  return <div
    className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props: MenuProps<OptionType>) {
  return (
    <Paper square
           className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

// noinspection JSUnusedGlobalSymbols
const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

type Props = {
    value: GlobalState['misc']['transaction']['category']
    label: string
    placeholder: string
    suggestions: string[]
  }
  & (
  {
    handleChange: (value: string) => void
    required: true
  } | {
  handleChange: (value: string | undefined) => void
  required?: false
}
  )
  & {
  classes: {
    input: string,
    valueContainer: string,
    chip: string,
    chipFocused: string,
    noOptionsMessage: string,
    singleValue: string,
    placeholder: string,
    paper: string,
    divider: string,
  }
  theme: Theme,
}

const styles = (theme: Theme) => {
  return createStyles({
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto',
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing(2),
    },
  });
};

class Autocomplete extends Component<Props> {
  handleChange = (value: ValueType<OptionType>): void => {
    if (value && 'value' in value) {
      this.props.handleChange(value.value);
    } else if (value === null && !this.props.required) {
      this.props.handleChange(undefined);
    }
  };

  render() {
    const { classes, label, placeholder } = this.props;
    const suggestions = this.props.suggestions.map(suggestion => ({
      value: suggestion,
      label: suggestion,
    }));
    const value = this.props.value === undefined ? undefined : {
      value: this.props.value,
      label: this.props.value,
    };
    const required = this.props.required || false;

    return (
      <NoSsr>
        <Select
          isClearable={!required}
          classes={classes}
          styles={{
            input: (base: CSSProperties) => ({
              ...base,
              color: this.props.theme.palette.text.primary,
              '& input': {
                font: 'inherit',
              },
            }),
          }}
          inputId="react-select-single"
          TextFieldProps={{
            label,
            required,
            InputLabelProps: {
              htmlFor: 'react-select-single',
              shrink: true,
            },
          }}
          placeholder={placeholder}
          options={suggestions}
          components={components}
          value={value}
          onChange={this.handleChange}
        />
      </NoSsr>
    );
  }
}

export default withTheme(withStyles(styles)(Autocomplete));
