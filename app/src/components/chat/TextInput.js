import React, { useState, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    width: '95%',
    margin: `${theme.spacing(0)} auto`
  },
  text: {
    width: '100%'
  }
}));

export const TextInput = (props) => {
  const classes = useStyles();
  const [ message, setMessage ] = useState('');
  const textInput = useRef(undefined);

  const handleTextChange = event => {
    setMessage(event.target.value);
  };

  const handleButtonClick = () => {
    setMessage('');
    textInput.current.value = '';
    props.handleSendNewChatMessage(message);
  };

  return (
    <>
      <form className={ classes.form } autoComplete="off">
        <TextField
          id="message"
          label="Enter Message..."
          inputRef={ textInput }
          className={ classes.text }
          onChange={ handleTextChange }
        />

        <Button
          variant="contained"
          color="primary"
          onClick={ handleButtonClick }
        >
          <SendIcon />
        </Button>
      </form>
    </>
  );
}
