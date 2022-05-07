import { m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { sentenceCase, paramCase } from 'change-case';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Table,
  Avatar,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  TableHead,
  CardHeader,
  Typography,
  TableContainer,
  Container,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MotionContainer, varBounce } from '../../animate';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock_
import { _bookings } from '../../../_mock';
// hooks
import { useOwnedCollections, useAccount } from '../../../hooks/web3';
// assets
import { SeverErrorIllustration } from '../../../assets';
// components
import Image from '../../Image';
import Label from '../../Label';
import Iconify from '../../Iconify';
import Scrollbar from '../../Scrollbar';
import MenuPopover from '../../MenuPopover';
import TextMaxLine from '../../TextMaxLine';
// redux
import { getCollections } from '../../../redux/actions/collections';
// context
import { useWeb3 } from '../../../contexts/providers';

// ----------------------------------------------------------------------

export default function Owned() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const dispatch = useDispatch();

  useEffect(() => {
    getCollections(dispatch);
  }, [dispatch]);

  const { collections, isLoading } = useSelector((state) => state.collections);

  // -----------------------------------------------------------------------------------------------
  const { requireInstall } = useWeb3();
  const { account } = useAccount();
  const { ownedCollections } = useOwnedCollections(collections, account.data);

  if (ownedCollections.isEmpty)
    return (
      <Container component={MotionContainer} mt={5}>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              You don&apos;t own any collections!
            </Typography>
          </m.div>
          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we could not find a collection loaded from your account. Perhaps you would like to buy a collection.
          </Typography>

          <m.div variants={varBounce().in}>
            <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>
        </Box>
      </Container>
    );

  if (account.isEmpty)
    return (
      <Container component={MotionContainer} mt={5}>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              Please connect to Metamask
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>
        </Box>
      </Container>
    );

  if (requireInstall)
    return (
      <Container component={MotionContainer} mt={5}>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              Please install Metamask
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>
        </Box>
      </Container>
    );

  return (
    <>
      <Card>
        <CardHeader title="Owned Collections" sx={{ mb: 3 }} />
        {/* {JSON.stringify(ownedCollections.data)} */}
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 240 }}>Title</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>Price</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>Proof</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Status</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {ownedCollections.data?.map((collection) => (
                  <TableRow key={collection._id}>
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <Image
                        disabledEffect
                        alt={collection.title}
                        src={collection.cover}
                        sx={{ borderRadius: 1.5, width: 64, height: 64, mr: 2 }}
                      />
                      <TextMaxLine variant="body2" color="textSecondary" component="h2" line={1}>
                        {collection.ownedCollectionId} - {collection.title}
                      </TextMaxLine>
                    </TableCell>

                    <TableCell>{collection.price} ETH</TableCell>
                    <TableCell>
                      <TextMaxLine variant="body2" component="h2" line={1}>
                        {collection.proof.substring(0, 40)}...
                      </TextMaxLine>
                    </TableCell>
                    {/* <TableCell>{format(new Date(collection.createdAt), 'dd MMM yyyy')}</TableCell> */}

                    <TableCell>
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
                    </TableCell>

                    <TableCell align="right">
                      <MoreMenuButton collection={collection} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
            View All
          </Button>
        </Box>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

function MoreMenuButton({ collection }) {
  const [open, setOpen] = useState(null);
  const linkTo = `${PATH_DASHBOARD.musicWorld.collectionDetails}${paramCase(collection._id)}`;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <MenuItem>
            <Iconify icon={'emojione:headphone'} sx={{ ...ICON }} />
            Listen
          </MenuItem>
        </Link>
        <MenuItem>
          <Iconify icon={'eva:download-fill'} sx={{ ...ICON }} />
          Download
        </MenuItem>

        <MenuItem>
          <Iconify icon={'eva:printer-fill'} sx={{ ...ICON }} />
          Print
        </MenuItem>

        <MenuItem>
          <Iconify icon={'eva:share-fill'} sx={{ ...ICON }} />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
