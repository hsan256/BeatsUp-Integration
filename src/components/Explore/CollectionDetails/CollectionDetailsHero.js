import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Avatar, SpeedDial, Typography, SpeedDialAction, Paper, Divider, Button, Chip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
// react-player
import VideoPlayer from 'react-video-js-player';
import moment from 'moment';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import Image from '../../Image';
import Iconify from '../../Iconify';

// ----------------------------------------------------------------------

const CardStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
}));

const SectionStyle = styled('div')(({ theme }) => ({
  borderRadius: '20px',
  margin: '10px',
  flex: 1,
}));

const ImageSectionStyle = styled('div')(({ theme }) => ({
  marginLeft: '20px',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
  },
}));

// ----------------------------------------------------------------------

CollectionDetailsHero.propTypes = {
  collection: PropTypes.object.isRequired,
};

export default function CollectionDetailsHero({ collection }) {
  const { cover, title, likes, tags, trailer, content, creator, comments, createdAt } = collection;
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(true);
  }, []);

  return (
    <>
      <CardStyle>
        <SectionStyle>
          <Typography variant="h3" component="h2">
            {title}
          </Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">
            {tags.map((tag) => (
              <Chip key={tag} label={`#${tag}`} sx={{ m: 0.5 }} />
            ))}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {likes.length} Likes
          </Typography>
          <Typography variant="h6">
            Created by:{' '}
            <Box component="span" color="green">
              {creator?.username}
            </Box>
          </Typography>
          <Typography variant="body1">{fDate(createdAt)}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1">
            <strong>Album contains {content?.length} Songs</strong>
          </Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1">
            <strong>Album contains {comments?.length} Comments</strong>
          </Typography>
          <Divider style={{ margin: '20px 0' }} />
          {!isLoading ? (
            <LoadingButton
              fullWidth
              size="large"
              loading
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
            >
              Loading Please Wait...
            </LoadingButton>
          ) : (
            <Button
              fullWidth
              size="large"
              color="primary"
              variant="contained"
              startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
              component={RouterLink}
              to={`${PATH_DASHBOARD.musicWorld.collectionContent}${id}`}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Access Album
            </Button>
          )}
        </SectionStyle>
        <ImageSectionStyle>
          <VideoPlayer src={trailer} poster={cover} width="600" height="400" />
        </ImageSectionStyle>
      </CardStyle>
    </>
  );
}
