import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { paramCase } from 'change-case';
import { useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Paper,
  CardHeader,
  Chip,
  Link,
  Container,
  CardActionArea,
} from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import { fDateTime } from '../../utils/formatTime';
// components
import TextMaxLine from '../../components/TextMaxLine';
import Page from '../../components/Page';
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import { CarouselArrows } from '../../components/carousel';
import { getCollectionsPaginate } from '../../redux/actions/collections';
// ----------------------------------------------------------------------

export default function Podcast() {
  const dispatch = useDispatch();
  const { collections, isLoading } = useSelector((state) => state.collections);

  useEffect(() => {
    dispatch(getCollectionsPaginate(1));
  }, [dispatch]);

  console.log(collections);

  const theme = useTheme();
  const { themeStretch } = useSettings();
  const carouselRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 3,
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

  return (
    <Box>
        <Box sx={{ py: 2 }}>
          <CardHeader
            title="Trending Collections"
            subheader={`Trending Collections`}
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
            {collections.map((collection) => (
              <CardActionArea key={collection._id}>
                <BookingItem key={collection._id} collection={collection} />
              </CardActionArea>
            ))}
          </Slider>
        </Box>
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
