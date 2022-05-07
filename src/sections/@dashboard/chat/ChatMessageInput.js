import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Input, Divider, IconButton, InputAdornment } from '@mui/material';
// utils
import Axios from 'axios';
import uuidv4 from '../../../utils/uuidv4';
// components
import Iconify from '../../../components/Iconify';
import EmojiPicker from '../../../components/EmojiPicker';
import { saveMessage } from '../../../redux/actions/E-commerceActions/messageActions';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: 56,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  conversationId: PropTypes.string,
  onSend: PropTypes.func,
};

export default function ChatMessageInput({ disabled, conversationId, onSend }) {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!message) {
      return '';
    }
    if (onSend && conversationId) {
      onSend({
        conversationId,
        messageId: uuidv4(),
        message,
        contentType: 'text',
        attachments: [],
        createdAt: new Date(),
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      });
    }
    return setMessage('');
  };

  const dispatch = useDispatch();

  useEffect(() => {
    eventQuery('WelcomeBro')
}, [])

  const textQuery = async (text) => {
    let conversation = {
      who: 'user',
      content: {
        text: {
          aytext: text
        }
      }
    }

    dispatch(saveMessage(conversation));
    // console.log(conversation);

    const textQueryVariables = {
      text
    }
    try {
      const response = await Axios.post('https://beatsup-project.herokuapp.com/api/dialogflow/textQuery', textQueryVariables)
      const botcontent = response.data.fulfillmentMessages[0]

      conversation = {
        who: 'bot',
        content: botcontent
      }

      dispatch(saveMessage(conversation));
      // console.log(conversation);

    } catch (error) {
      conversation = {
        who: 'bot',
        content: {
          text: {
            text: " Error just occured, please check the problem"
          }
        }
      }

      dispatch(saveMessage(conversation));
      // console.log(conversation);
    }
  }

  const eventQuery = async (event) => {

    // We need to take care of the message Chatbot sent 
    const eventQueryVariables = {
        event
    }
    try {
        // I will send request to the textQuery ROUTE 
        const response = await Axios.post('https://beatsup-project.herokuapp.com/api/dialogflow/eventQuery', eventQueryVariables)
        const botcontent = response.data.fulfillmentMessages[0]

            const conversation = {
                who: 'bot',
                content: botcontent
            }
            dispatch(saveMessage(conversation));    

    } catch (error) {
        const conversation = {
            who: 'bot',
            content: {
                text: {
                    text: " Error just occured, please check the problem"
                }
            }
        }
        dispatch(saveMessage(conversation));
    }
}

  const keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      if (!e.target.value) {
        return alert('your need to type something')
      }
    
    textQuery(e.target.value);
    e.target.value = "";
  }}

  return (
    <RootStyle>
      <Input
        disabled={disabled}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message ... "
        onKeyPress={keyPressHandler}
        type="text"
      startAdornment={
        <InputAdornment position="start">
          <EmojiPicker disabled={disabled} value={message} setValue={setMessage} />
        </InputAdornment>
      }
      endAdornment={
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
          <IconButton disabled={disabled} size="small" onClick={handleAttach}>
            <Iconify icon="ic:round-add-photo-alternate" width={22} height={22} />
          </IconButton>
          <IconButton disabled={disabled} size="small" onClick={handleAttach}>
            <Iconify icon="eva:attach-2-fill" width={22} height={22} />
          </IconButton>
          <IconButton disabled={disabled} size="small">
            <Iconify icon="eva:mic-fill" width={22} height={22} />
          </IconButton>
        </Stack>
      }
      />

      <Divider orientation="vertical" flexItem />

      <IconButton color="primary" disabled={!message} onClick={handleSend} sx={{ mx: 1 }}>
        <Iconify icon="ic:round-send" width={22} height={22} />
      </IconButton>

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
    </RootStyle>
  );
}
