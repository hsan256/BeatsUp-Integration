import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getKaraokes, deleteKaraokes } from '../../redux/actions/karaoke';
// utils
import { fDate } from '../../utils/formatTime';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _bookings } from '../../_mock';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function BookingDetails() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const isLight = theme.palette.mode === 'light';

  useEffect(() => {
    getKaraokes(dispatch);
  }, [dispatch]);

  const Karaokes = useSelector((state) => state.Karaokes);

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Karaoke List"
          links={[
            { name: '' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.karaoke.newPost}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Karaoke
            </Button>
          }
        />
        <Card>
          <CardHeader title="List" sx={{ mb: 3 }} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 720 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 240 }}>Song Name</TableCell>
                    <TableCell sx={{ minWidth: 240 }}>Host</TableCell>
                    <TableCell sx={{ minWidth: 160 }}>Singer</TableCell>
                    <TableCell sx={{ minWidth: 160 }}>Actions</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Karaokes.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={row.KaraokeName} src={row.Karaokephoto} />
                          <Typography variant="subtitle2">{row.KaraokeName}</Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>{row.KaraokeHost}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{row.KaraokeHost}</TableCell>

                      <TableCell align="right">
                        <MoreMenuButton />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function MoreMenuButton() {
  const [open, setOpen] = useState(null);
  const { themeStretch } = useSettings();

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
        <MenuItem>
          <Iconify icon={'eva:share-fill'} sx={{ ...ICON }} />
          Edit
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
