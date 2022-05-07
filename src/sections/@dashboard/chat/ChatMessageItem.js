import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
// components
import Image from '../../../components/Image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
};

export default function ChatMessageItem({ message }) {
  // const sender = conversation.participants.find((participant) => participant.id === message.senderId);
  // const senderDetails =
  //   message.senderId === '8864c717-587d-472a-929a-8e5f298024da-0'
  //     ? { type: 'me' }
  //     : { avatar: sender?.avatar, name: sender?.name };

  // const isMe = senderDetails.type === 'me';
  // const isImage = message.contentType === 'image';
  // const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

  // const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
  const isMe = message.who === 'user';
  const bot = message.who === 'bot';
  // const contenuMessage = 

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto',
          }),
        }}
      >
        {message.who === 'bot' && (
          <Avatar alt="chatbot" src="https://media.wired.com/photos/5a540c008652c3185cff9b4e/master/w_2560%2Cc_limit/Chatbot-TopArt-879128144.jpg" sx={{ width: 32, height: 32, mr: 2 }} />
        )}

        <div>
          <InfoStyle
            variant="caption"
            sx={{
              ...(isMe && { justifyContent: 'flex-end' }),
            }}
          >
            {/* {!isMe && `${firstName},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true,
            })} */}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && { color: 'grey.800', bgcolor: 'primary.lighter' }),
              // ...(isImage && { p: 0 }),
            }}
          >
            {/* {isImage ? (
              <Image
                alt="attachment"
                src={message.body}
                onClick={() => onOpenLightbox(message.body)}
                sx={{ borderRadius: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              />
            ) : ( */}
            {
              isMe ? (
                <Typography variant="body2">{message.content.text.aytext}</Typography>)
                : (
                  <Typography variant="body2">{message.content.text.text}</Typography>
                )
            }
            {/* )} */}
          </ContentStyle>
        </div>
      </Box>
    </RootStyle>
  );
}