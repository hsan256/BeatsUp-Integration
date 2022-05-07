import PropTypes from 'prop-types';
import { m } from 'framer-motion';
import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment,
  Alert,
  Container,
  Grid,
  MenuItem,
} from '@mui/material';
// utils
import { sentenceCase } from 'change-case';
import { useSnackbar } from 'notistack';
import { MotionContainer, varBounce } from '../../animate';
import { normalizeOwnedCollection } from '../../../utils/normalize';
import 'react-toastify/dist/ReactToastify.css';
import { withToast } from '../../../utils/toast';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../Iconify';
import Label from '../../Label';
import HeaderBreadcrumbs from '../../HeaderBreadcrumbs';
// hooks
import { useAdmin, useManagedCollections } from '../../../hooks/web3';
import { useWeb3 } from '../../../contexts/providers';
// assets
import { CheckOutIllustration, PageNotFoundIllustration } from '../../../assets';


// ----------------------------------------------------------------------

const VerificationInput = ({ onVerify }) => {
  const [email, setEmail] = useState('');

  return (
    <TextField
      fullWidth
      placeholder="example@example.com"
      value={email}
      onChange={({ target: { value } }) => setEmail(value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={() => {
                onVerify(email);
              }}
              sx={{ mr: -0.5 }}
            >
              Verify
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
};
export default function Managed() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const [searchText, setSearchText] = useState('');
  const [proofedOwnership, setProofedOwnership] = useState({});
  const [searchedCollection, setSearchedCollection] = useState(null);
  const [filters, setFilters] = useState({ state: 'all' });
  const OPTIONS = ['all', 'purchased', 'activated', 'deactivated'];

  const { web3, contract } = useWeb3();
  // const { account } = useAdmin({ redirectTo: PATH_DASHBOARD.musicWorld.marketplace });
  const { account } = useAdmin();
  const { managedCollections } = useManagedCollections(account);

  const verifyCollection = (email, { hash, proof }) => {
    if (!email) {
      return
    }
    
    const emailHash = web3.utils.sha3(email);
    const proofToCheck = web3.utils.soliditySha3(
      { type: 'bytes32', value: emailHash },
      { type: 'bytes32', value: hash }
    );

    proofToCheck === proof
      ? setProofedOwnership({
          ...proofedOwnership,
          [hash]: true,
        })
      : setProofedOwnership({
          ...proofedOwnership,
          [hash]: false,
        });
  };

  const changeCollectionState = async (collectionHash, method) => {
    try {
      const result = await contract.methods[method](collectionHash).send({
        from: account.data,
      });
      return result
    } catch (e) {
      throw new Error(e.message)
    }
  };

  const activateCollection = async (collectionHash) => {
    withToast(changeCollectionState(collectionHash, "activateCollection"))
  };

  const deactivateCollection = async (collectionHash) => {
    withToast(changeCollectionState(collectionHash, "deactivateCollection"))
  };

  const searchCollection = async (hash) => {
    const re = /[0-9A-Fa-f]{6}/g;

    if (hash && hash.length === 66 && re.test(hash)) {
      const collection = await contract.methods.getCollectionByHash(hash).call();

      if (collection.owner !== '0x0000000000000000000000000000000000000000') {
        const normalized = normalizeOwnedCollection(web3)({ hash }, collection);
        setSearchedCollection(normalized);
        console.log(normalized);
        return;
      }
    }

    setSearchedCollection(null);
  };

  // ---------------Snackbar---------------
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onCopy = async () => {
    enqueueSnackbar('No connection!', {
      variant: 'error',
      persist: true,
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));
    closeSnackbar();
  };

  useEffect(() => {
    console.log(filters);
  }, [filters]);
  // --------------------------------------

  const renderCard = (collection) => {
    return (
      <Card sx={{ mb: 3 }} key={collection.ownedCollectionId}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Hash
              </Typography>
              <Typography variant="subtitle2">{collection.hash}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OwnedCollectionId
              </Typography>
              <Typography variant="subtitle2">{collection.ownedCollectionId}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Proof
              </Typography>
              <Typography variant="subtitle2">{collection.proof}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Owned
              </Typography>
              <Typography variant="subtitle2">{collection.owned}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                State
              </Typography>
              <Label
                variant={isLight ? 'ghost' : 'filled'}
                color={
                  (collection.state === 'purchased' && 'warning') ||
                  (collection.state === 'activated' && 'success') ||
                  (collection.state === 'deactivated' && 'error') ||
                  'error'
                }
              >
                {sentenceCase(collection.state)}
              </Label>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1">Price</Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                  {collection.price} ETH
                </Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                  (VAT included if applicable)
                </Typography>
              </Box>
            </Stack>

            <VerificationInput
              onVerify={(email) => {
                verifyCollection(email, {
                  hash: collection.hash,
                  proof: collection.proof,
                });
              }}
            />
          </Stack>
          {proofedOwnership[collection.hash] && (
            <Stack mt={2}>
              <Alert severity="success">Verified!</Alert>
            </Stack>
          )}
          {proofedOwnership[collection.hash] === false && (
            <Stack mt={2}>
              <Alert severity="error" mt={3}>
                Wrong Proof!
              </Alert>
            </Stack>
          )}
          {collection.state === 'purchased' && (
            <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center" mt={2}>
              <Grid item>
                <Button variant="contained" onClick={() => activateCollection(collection.hash)}>
                  Activate
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={() => deactivateCollection(collection.hash)} color="error">
                  Deactivate
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!account.isAdmin) {
    return (
      <Container component={MotionContainer} mt={5}>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              Permission Denied
            </Typography>
          </m.div>
          <Typography sx={{ color: 'text.secondary' }}>You do not have permission to access this page</Typography>

          <m.div variants={varBounce().in}>
            <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>
        </Box>
      </Container>
    );
  }

  const filteredCollections = managedCollections.data
    ?.filter((collection) => {
      if (filters.state === 'all') {
        return true;
      }
      return collection.state === filters.state;
    })
    .map((collection) => renderCard(collection));

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Managed Collections"
          // action={
          //   <Button size="small" startIcon={<Iconify icon={'eva:edit-fill'} />}>
          //     Edit
          //   </Button>
          // }
        />

        <Grid container spacing={5}>
          <Grid item xs />
          <Grid item xs={6} mt={3} mb={5}>
            <TextField
              fullWidth
              onChange={({ target: { value } }) => setSearchText(value)}
              name="collectionHash"
              id="collectionHash"
              value={searchText}
              placeholder="0x2341ab..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => searchCollection(searchText)} variant="contained" sx={{ mr: -0.5 }}>
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={3} mt={3} mb={5}>
            <TextField
              defaultValue={OPTIONS[0]}
              select
              onChange={({ target: { value } }) => setFilters({ state: value })}
            >
              {OPTIONS.map((option, index) => (
                <MenuItem key={index} value={option} sx={{ mx: 1, my: 0.5, borderRadius: 1 }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Card>
      {searchedCollection && (
        <Grid component={MotionContainer}>
          <m.div variants={varBounce().in}>
            <HeaderBreadcrumbs heading="Search Result" links={[{ name: '' }]} />
            {renderCard(searchedCollection, true)}
          </m.div>
        </Grid>
      )}
      <HeaderBreadcrumbs heading="All collections" links={[{ name: '' }]} />
      {filteredCollections}
      {filteredCollections?.length === 0 && (
        <HeaderBreadcrumbs heading="No collections to display" links={[{ name: '' }]} />
      )}
    </>
  );
}
