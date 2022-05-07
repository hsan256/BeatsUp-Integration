import { useEffect, useState } from 'react';
import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// @mui
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Divider,
  Container,
  Tab,
  Typography,
  Pagination,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { useAccount, useOwnedCollection } from '../../hooks/web3';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Markdown from '../../components/Markdown';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { SkeletonPost } from '../../components/skeleton';
import CollectionDetailsHero from '../../components/Explore/CollectionDetails/CollectionDetailsHero';
import MusicTable from '../../components/Explore/CollectionDetails/MusicTable';
import RecommendedCollections from '../../components/Explore/CollectionDetails/RecommendedCollections';
import CollectionCommentSection from '../../components/Explore/CollectionDetails/Comment/CollectionCommentSection';
import CollectionCommentForm from '../../components/Explore/CollectionDetails/Comment/CollectionCommentForm';
// redux
import { getCollection, getCollectionsBySearch } from '../../redux/actions/collections';

// ----------------------------------------------------------------------

export default function CollectionDetails() {
  const { themeStretch } = useSettings();

  const [value, setValue] = useState('1');

  const PRODUCT_DESCRIPTION = [
    {
      title: '100% Original',
      description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
      icon: 'ic:round-verified',
    },
    {
      title: '10 Day Replacement',
      description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
      icon: 'cib:ethereum',
    },
    {
      title: 'Year Warranty',
      description: 'Cotton candy gingerbread cake I love sugar sweet.',
      icon: 'ic:round-verified-user',
    },
  ];

  const IconWrapperStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    justifyContent: 'center',
    height: theme.spacing(8),
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
  }));
  // -----------------------------------------------------------------
  const isMountedRef = useIsMountedRef();
  const { title } = useParams();
  const [recentPosts, setRecentPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);
  // -----------------------------------------------------------------
  const dispatch = useDispatch();
  const { collection, collections, isLoading } = useSelector((state) => state.collections);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getCollection(id));
  }, [id]);

  useEffect(() => {
    if (collection) {
      dispatch(getCollectionsBySearch({ search: 'none', tags: collection?.tags.join(',') }));
    }
  }, [collection]);

  // -------------------------web3------------------------------------
  const { account } = useAccount();
  const { ownedCollection } = useOwnedCollection(collection, account.data);
  const collectionState = ownedCollection.data?.state;
  // const collectionState = "activated"

  const isLocked = !collectionState || collectionState === 'purchased' || collectionState === 'deactivated';
  // -----------------------------------------------------------------

  if (isLoading) {
    return (
      <Paper elevation={6}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  if (!collection) return 'Collection Does Not exists';

  const recommendedCollections = collections.filter(({ _id }) => _id !== collection._id);

  return (
    <Page title="Music: Collection Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Collection Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Music', href: PATH_DASHBOARD.musicWorld.explore },
            { name: sentenceCase(collection.title) },
          ]}
        />

        {collectionState && (
          <>
            {collectionState === 'purchased' && (
              <Box sx={{ width: '100%' }}>
                <Collapse in={open}>
                  <Alert
                    severity="warning"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    Collection is purchased and waiting for the activation. Process can take up to 24 hours.
                    <Typography variant="subtitle2" color="inhert">
                      In case of any questions, please contact info@beatsup.com
                    </Typography>
                  </Alert>
                </Collapse>
              </Box>
            )}
            {collectionState === 'activated' && (
              <Box sx={{ width: '100%' }}>
                <Collapse in={open}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    BeatsUp wishes you happy Listening.
                  </Alert>
                </Collapse>
              </Box>
            )}
            {collectionState === 'deactivated' && (
              <Box sx={{ width: '100%' }}>
                <Collapse in={open}>
                  <Alert
                    severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    Collection has been deactivated, due the incorrect purchase data. The functionality to Listen the
                    collection has been temporally disabled.
                    <Typography variant="subtitle2" color="inhert">
                      please contact info@beatsup.com
                    </Typography>
                  </Alert>
                </Collapse>
              </Box>
            )}
          </>
        )}

        {collection && (
          <Card>
            <MusicTable collection={collection} locked={isLocked} collectionState={collectionState} />
          </Card>
        )}

        {!collection && !error && <SkeletonPost />}

        <Grid container sx={{ my: 8 }}>
          {PRODUCT_DESCRIPTION.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                <IconWrapperStyle>
                  <Iconify icon={item.icon} width={36} height={36} />
                </IconWrapperStyle>
                <Typography variant="subtitle1" gutterBottom>
                  {item.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Card>
          <TabContext value={value}>
            <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
              <TabList onChange={(e, value) => setValue(value)}>
                <Tab disableRipple value="1" label="Description" />
                <Tab
                  disableRipple
                  value="2"
                  label="Comments"
                  // label={`Review (${product.reviews.length})`}
                  sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                />
                <Tab disableRipple value="3" label="Reviews" />
              </TabList>
            </Box>

            <Divider />

            <TabPanel value="1">
              <Box sx={{ p: 3 }}>
                <Markdown children={collection.desc} />
              </Box>
            </TabPanel>

            <TabPanel value="2">
              <Card>
                <Box sx={{ p: { xs: 3, md: 5 } }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography variant="h4">Comments</Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                      ({collection.comments.length})
                    </Typography>
                  </Box>

                  <CollectionCommentSection />

                  <Box sx={{ mb: 5, mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Pagination count={8} color="primary" />
                  </Box>

                  <CollectionCommentForm id={collection._id} />
                </Box>
              </Card>
            </TabPanel>

            <TabPanel value="3">{/* <ProductDetailsReview product={product} /> */}</TabPanel>
          </TabContext>
        </Card>

        {/* Related Collections */}
        {!!recommendedCollections.length && <RecommendedCollections recommendedCollections={recommendedCollections} />}
      </Container>
    </Page>
  );
}
