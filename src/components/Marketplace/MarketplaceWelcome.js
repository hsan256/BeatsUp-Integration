import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Typography, Button, Card, CardContent, Grid } from '@mui/material';
// hooks
import { useWalletInfo } from '../../hooks/web3';
// assets
import { SeoIllustration } from '../../assets';
// context
import { useWeb3 } from '../../contexts/providers';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

// ----------------------------------------------------------------------



export default function MarketplaceWelcome() {
  const { requireInstall } = useWeb3();
  const { account, network } = useWalletInfo();

  return (
    <RootStyle>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          color: 'grey.800',
        }}
      >
        <Typography gutterBottom variant="h4">
          Connected Wallet,
          <br /> {!account.data ? '...' : account.data}!
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 720, mx: 'auto' }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde fuga voluptatum perferendis id. Quisquam
          excepturi numquam perferendis autem, corporis ullam nostrum voluptatibus quod nam vel quia facere laborum
          dolorem iusto
        </Typography>

        <Grid container spacing={5}>
          <Grid item xs={6}>
            {requireInstall && (
              <Button variant="contained" to="#" component={RouterLink} color="warning">
                Please install Metamask.
              </Button>
            )}
            {network.data && (
              <Button variant="contained" to="#" component={RouterLink}>
                Connected to: {` `} {network.data}
              </Button>
            )}
          </Grid>
          <Grid item xs={6}>
            {network.hasInitialResponse && !network.isSupported && (
              <Button variant="contained" to="#" component={RouterLink} color="error">
                Wrong Network: {` `} Switch to {network.target} <br />
              </Button>
            )}
          </Grid>
        </Grid>
      </CardContent>

      <SeoIllustration
        sx={{
          p: 3,
          width: 360,
          margin: { xs: 'auto', md: 'inherit' },
        }}
      />
    </RootStyle>
  );
}
