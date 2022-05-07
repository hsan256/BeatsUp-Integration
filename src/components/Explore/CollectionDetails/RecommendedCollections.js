import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { paramCase } from 'change-case';
import { useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Avatar, Typography, Paper, CardHeader, Chip, Link } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { fDateTime } from '../../../utils/formatTime';
// _mock_
import { _bookingNew } from '../../../_mock';
// components
import TextMaxLine from '../../TextMaxLine';
import Label from '../../Label';
import Image from '../../Image';
import Iconify from '../../Iconify';
import { CarouselArrows } from '../../carousel';

// ----------------------------------------------------------------------
RecommendedCollections.propTypes = {
  recommendedCollections: PropTypes.array,
};

export default function RecommendedCollections({ recommendedCollections }) {
  const theme = useTheme();
  const carouselRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    slidesToShow:
      recommendedCollections.length === 1
        ? 1
        : recommendedCollections.length === 2
        ? 2
        : recommendedCollections.length === 3
        ? 3
        : recommendedCollections.length === 4
        ? 4
        : 4,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  const subheader = `${recommendedCollections.length} Collections`;

  return (
    <Box sx={{ py: 2 }} mt={5}>
      <CardHeader
        title="Recommended Collections"
        subheader={subheader}
        action={
          <CarouselArrows
            customIcon={'ic:round-keyboard-arrow-right'}
            onNext={handleNext}
            onPrevious={handlePrevious}
            sx={{ '& .arrow': { width: 28, height: 28, p: 0 } }}
          />
        }
        sx={{
          p: 0,
          mb: 3,
          '& .MuiCardHeader-action': { alignSelf: 'center' },
        }}
      />

      <Slider ref={carouselRef} {...settings}>
        {recommendedCollections.map((collection) => (
          <BookingItem key={collection._id} collection={collection} />
        ))}
      </Slider>
    </Box>
  );
}

// ----------------------------------------------------------------------

BookingItem.propTypes = {
  collection: PropTypes.shape({
    title: PropTypes.string,
    createdAt: PropTypes.string,
    desc: PropTypes.string,
    creator: PropTypes.object,
    content: PropTypes.array,
    tags: PropTypes.array,
    likes: PropTypes.array,
    cover: PropTypes.string,
    trailer: PropTypes.string,
  }),
};

function BookingItem({ collection }) {
  const { title, desc, creator, content, tags, likes, cover, trailer, createdAt } = collection;

  const linkTo = `${PATH_DASHBOARD.musicWorld.collectionDetails}${paramCase(collection._id)}`;

  return (
    <Paper sx={{ mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral' }}>
      <Stack spacing={2.5} sx={{ p: 3, pb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={creator?.username} src={creator?.imageUrl} />
          <div>
            <Link to={linkTo} color="inherit" component={RouterLink}>
              <TextMaxLine variant="subtitle2" line={1} persistent>
                {collection.title}
              </TextMaxLine>
            </Link>
            <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
              {fDateTime(createdAt)}
            </Typography>
          </div>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={3} sx={{ color: 'text.secondary' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={'akar-icons:hashtag'} width={16} height={16} />
            <TextMaxLine variant="body2" color="textSecondary" component="h2" line={1}>
              {tags.map((tag) => (
                <Chip key={tag} label={`${tag}`} sx={{ m: 0.5 }} />
              ))}
            </TextMaxLine>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={'flat-color-icons:like'} width={16} height={16} />
            <Typography variant="caption">{likes.length}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Box sx={{ p: 1, position: 'relative' }}>
        <Image src={cover} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      </Box>
    </Paper>
  );
}
