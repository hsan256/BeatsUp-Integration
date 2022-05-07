import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Button } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PanToolIcon from '@mui/icons-material/PanTool';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';

// routes
import { PATH_DASHBOARD, PATH_AUTH } from '../../../routes/paths';
// hooks
// import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { useAccount } from '../../../hooks/web3';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { useWeb3 } from '../../../contexts/providers';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  const { connect, isLoading, requireInstall } = useWeb3();
  const { account } = useAccount();

  // const { user } = useContext(AuthContext);

  const MENU_OPTIONS = [
    {
      label: 'Home',
      linkTo: '/',
    },
    {
      label: 'Profile',
      linkTo: user.result?.isArtist ? PATH_DASHBOARD.artist.profile : PATH_DASHBOARD.user.profile,
      // linkTo: PATH_DASHBOARD.user.profile,
    },
    {
      label: 'Settings',
      linkTo: PATH_DASHBOARD.user.account,
    },
  ];

  // const { user, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch({ type: 'LOGOUT' });
    // localStorage.clear();
    window.location.reload(true);

    setUser(null);
  };

  return (
    <>
      {isLoading ? (
        <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} variant="outlined" onClick={connect}>
          Loading...
        </LoadingButton>
      ) : account.data ? (
        <Button variant="contained" startIcon={<PanToolIcon />}>
          Hi there {account.isAdmin && 'Admin'}
        </Button>
      ) : requireInstall ? (
        <Button
          variant="contained"
          startIcon={<CloudDownloadIcon />}
          onClick={() => window.open('https://metamask.io/download.html', '_blank')}
        >
          Install Metamask
        </Button>
      ) : (
        <Button variant="contained" startIcon={<AccountBalanceWalletIcon />} onClick={connect}>
          Connect Wallet
        </Button>
      )}
      
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.result?.name || user?.result?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.result?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
