import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

import { TextInput } from './TextInput';
import { MessageLeft, MessageRight } from './Message';

const useStyles = makeStyles(theme => ({
  paper: {
    height: '100%',
    maxWidth: '400px',
    minWidth: '400px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  container: {
    height: '90vh',
    display: 'flex-end',
    alignItems: 'center',
  },
  messageBody: {
    width: '100%',
    height: '100%',
    margin: 10,
    overFlowY: 'scroll',
  }
}));

export const ChatLog = props => {
  const classes = useStyles();

  useEffect(() => {

  }, []);

  return (
    <div className={ classes.container }>
      <Paper className={ classes.paper } zDepth={ 2 }>
        <Paper className={ classes.messageBody }>
          {
            props.messages.map((data, i) => {
              {
                return data.isLocal ? (
                  <MessageRight
                    key={ i }
                    message={ data.message }
                  />
                ) : (
                  <MessageLeft
                  key={ i }
                    message={ data.message }
                  />
                )
              }
            })
          }
        </Paper>
        <TextInput
          handleSendNewChatMessage={ props.handleSendNewChatMessage }
        />
      </Paper>
    </div>
  );
};
