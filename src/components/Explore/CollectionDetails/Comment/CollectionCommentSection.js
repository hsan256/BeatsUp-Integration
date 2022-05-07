import React, { useState, useRef } from 'react';

// @mui
import {
  Box,
  Button,
  Avatar,
  Divider,
  ListItem,
  TextField,
  Typography,
  ListItemText,
  ListItemAvatar,
  List,
} from '@mui/material';
import { useSelector } from 'react-redux';

const CollectionCommentSection = () => {
  const { collection } = useSelector((state) => state.collections);
  const [comments, setComments] = useState(collection?.comments);

  return (
    <List disablePadding>
      {comments.map((comment) => {
        const username = comment.split(':')[0]
        const content = comment.split(':')[1]
        return (
          <Box>
            <ListItem
              disableGutters
              sx={{
                alignItems: 'flex-start',
                py: 3,
              }}
            >
              <ListItemAvatar>
                <Avatar alt={'name'} src={'avatarUrl'} sx={{ width: 48, height: 48 }} />
              </ListItemAvatar>

              <ListItemText
                primary={username}
                primaryTypographyProps={{ variant: 'subtitle1' }}
                secondary={
                  <>
                    {/* <Typography
                      gutterBottom
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: 'text.disabled',
                      }}
                    >
                      {fDate(postedAt)}
                    </Typography> */}
                    <Typography component="span" variant="body2">
                      <strong>{content}</strong>
                    </Typography>
                  </>
                }
              />

              <Button size="small" onClick={'handleOpenReply'} sx={{ position: 'absolute', right: 0 }}>
                Delete
              </Button>
            </ListItem>

            <Divider
              sx={{
                ml: 'auto',
                width: (theme) => `calc(100% - ${theme.spacing(7)})`,
              }}
            />
          </Box>
        );
      })}
    </List>
  );
};

export default CollectionCommentSection;
