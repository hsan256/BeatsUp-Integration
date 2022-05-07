import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { paramCase } from 'change-case';
// @mui
import { Card, Avatar, Box, Button, Typography, Link, CardContent, Stack, CircularProgress, Grid } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import { useWalletInfo } from '../../../hooks/web3';
// utils
import 'react-toastify/dist/ReactToastify.css';
import { withToast } from '../../../utils/toast';
import { fDate } from '../../../utils/formatTime';
import Image from '../../Image';
import TextMaxLine from '../../TextMaxLine';
import SvgIconStyle from '../../SvgIconStyle';
import Iconify from '../../Iconify';
import OrderDialog from '../OrderDialog';
import { likeCollection } from '../../../redux/actions/collections';
import { useStyles } from './styles';
// context
import { useWeb3 } from '../../../contexts/providers';

const Collection = ({ collection, ownedCollections }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const classes = useStyles();

  return (
    <Card elevation={6}>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Avatar
          alt={collection.title}
          src={collection.creator?.imageUrl}
          sx={{
            left: 24,
            zIndex: 9,
            width: 32,
            height: 32,
            bottom: -16,
            position: 'absolute',
          }}
        />
        <Image alt="cover" src={collection.cover} ratio="4/3" />
      </Box>

      <div className={classes.details}>
        <TextMaxLine variant="body2" color="textSecondary" component="h2" line={1}>
          {collection.tags?.map((tag) => `#${tag} `)}
        </TextMaxLine>
      </div>

      <CollectionContent collection={collection} ownedCollections={ownedCollections} />
    </Card>
  );
};

CollectionContent.propTypes = {
  collection: PropTypes.object,
  index: PropTypes.number,
  ownedCollections: PropTypes.object,
};

export function CollectionContent({ collection, index, ownedCollections }) {
  const isDesktop = useResponsive('up', 'md');
  const user = JSON.parse(localStorage.getItem('profile'));
  const linkTo = `${PATH_DASHBOARD.musicWorld.collectionDetails}${paramCase(collection._id)}`;
  const dispatch = useDispatch();
  // --------------------------------------------------------

  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [busyCollectionId, setBusyCollectionId] = useState(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);
  const owned = ownedCollections.lookup[collection._id];
  const isBusy = busyCollectionId === collection._id;

  const purchaseCollection = async (order, collection) => {
    const hexCollectionId = web3.utils.utf8ToHex(collection._id);
    const orderHash = web3.utils.soliditySha3(
      { type: 'bytes32', value: hexCollectionId },
      { type: 'address', value: account.data }
    );

    const value = web3.utils.toWei(String(order.price));

    setBusyCollectionId(collection._id);
    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { type: 'bytes32', value: emailHash },
        { type: 'bytes32', value: orderHash }
      );

      withToast(_purchaseCollection({ hexCollectionId, proof, value }, collection));
    } else {
      withToast(_repurchaseCollection({ collectionHash: orderHash, value }, collection));
    }
  };

  const _purchaseCollection = async ({ hexCollectionId, proof, value }, collection) => {
    try {
      const result = await contract.methods
        .purchaseCollection(hexCollectionId, proof)
        .send({ from: account.data, value });

      ownedCollections.mutate([
        ...ownedCollections.data,
        {
          ...collection,
          proof,
          state: 'purchased',
          owner: account.data,
          price: value,
        },
      ]);
      return result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setBusyCollectionId(null);
    }
  };

  const _repurchaseCollection = async ({ collectionHash, value }, collection) => {
    try {
      const result = await contract.methods.repurchaseCollection(collectionHash).send({ from: account.data, value });
      const index = ownedCollections.data.findIndex((c) => c.id === collection._id);

      if (index >= 0) {
        ownedCollections.data[index].state = 'purchased';
        ownedCollections.mutate(ownedCollections.data);
      } else {
        ownedCollections.mutate();
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setBusyCollectionId(null);
    }
  };

  const cleanupModal = () => {
    setSelectedCollection(null);
    setIsNewPurchase(true);
  };
  // --------------------------------------------------------

  const latestPostLarge = index === 0;
  const latestPostSmall = index === 1 || index === 2;

  const Likes = () => {
    if (collection.likes?.length > 0) {
      return collection.likes.find((like) => like === (user?.result?.googleId || user?.result?._id)) ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {collection.likes?.length > 2
            ? `You and ${collection.likes?.length - 1} others`
            : `${collection.likes?.length} like${collection.likes?.length > 1 ? 's' : ''}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{collection.likes?.length} {collection.likes?.length === 1 ? 'Like' : 'Likes'}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  return (
    <CardContent
      sx={{
        // pt: 4.5,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }),
      }}
    >
      <Typography
        gutterBottom
        variant="caption"
        component="div"
        sx={{
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {fDate(collection.createdAt)}
      </Typography>

      <Link to={linkTo} color="inherit" component={RouterLink}>
        <TextMaxLine variant={isDesktop && latestPostLarge ? 'h5' : 'subtitle2'} line={1} persistent>
          {collection.title}
        </TextMaxLine>
      </Link>

      <Stack
        flexWrap="wrap"
        direction="row"
        justifyContent="flex-start"
        sx={{
          mt: 3,
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {/* <CardActions> */}
        <Stack direction="row" spacing={3} alignItems="flex-end" sx={{ flexGrow: 1 }}>
          {requireInstall ? (
            <Button
              fullWidth
              // variant="contained"
              disabled
              endIcon={<Iconify icon={'logos:metamask-icon'} />}
            >
              Install
            </Button>
          ) : isConnecting ? (
            <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} variant="outlined">
              ...
            </LoadingButton>
          ) : !ownedCollections.hasInitialResponse ? (
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              disabled={!hasConnectedWallet}
              endIcon={<Iconify icon={'cib:ethereum'} />}
            >
              {hasConnectedWallet ? <CircularProgress size={20} /> : 'Connect'}
            </Button>
          ) : owned ? (
            <>
              {owned.state === 'activated' && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  endIcon={<Iconify icon={'ant-design:check-outlined'} />}
                >
                  Yours
                </Button>
              )}
              {owned.state === 'purchased' && (
                <LoadingButton fullWidth loading loadingPosition="start" startIcon={<SaveIcon />} variant="outlined">
                  Pending
                </LoadingButton>
              )}
              {owned.state === 'deactivated' && (
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  disabled={isBusy}
                  onClick={() => {
                    setIsNewPurchase(false);
                    setSelectedCollection(collection);
                  }}
                >
                  {isBusy ? <CircularProgress size={20} /> : <>Activate</>}
                </Button>
              )}
            </>
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              onClick={() => setSelectedCollection(collection)}
              disabled={!hasConnectedWallet || isBusy}
              endIcon={<Iconify icon={'cib:ethereum'} />}
            >
              {isBusy ? <CircularProgress size={20} /> : <>Purchase</>}
            </Button>
          )}
          {selectedCollection && (
            <OrderDialog
              collection={collection}
              isNewPurchase={isNewPurchase}
              onSubmit={(formData, collection) => {
                purchaseCollection(formData, collection);
                cleanupModal();
              }}
              onClose={cleanupModal}
            />
          )}
          <Button
            fullWidth
            variant="contained"
            onClick={() => dispatch(likeCollection(collection._id, user?.result?.googleId || user?.result?._id))}
          >
            <Likes />
          </Button>
        </Stack>
        {/* </CardActions> */}
      </Stack>
    </CardContent>
  );
}

export default Collection;
