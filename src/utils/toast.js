import { Box, Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { toast } from 'react-toastify';

export const withToast = (promise) => {
  toast.promise(
    promise,
    {
      pending: {
        render() {
          return (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Grid>
                <CircularProgress color="info" size={20} />
              </Grid>
              <Grid>
                <Typography variant="subtitle2">Your transaction is being processed.</Typography>
              </Grid>
            </Stack>
          );
        },
        icon: false,
      },
      success: {
        render({ data }) {
          return (
            <Grid>
              <Box sx={{ typography: 'subtitle2' }}>Tx: {data.transactionHash.slice(0, 20)}...</Box>
              <Typography variant="subtitle2">Has been successfully processed.</Typography>
              <Button
                rel="noopener"
                onClick={() => window.open(`https://ropsten.etherscan.io/tx/${data.transactionHash}`, '_blank')}
              >
                <Typography variant="subtitle2" color="info">
                  See Tx Details
                </Typography>
              </Button>
            </Grid>
          );
        },
        // other options
        icon: '🟢',
      },
      error: {
        render({ data }) {
          // When the promise reject, data will contains the error
          return <Typography variant="subtitle2">{data.message ?? 'Transaction has failed'}</Typography>;
        },
      },
    },
    {
      closeButton: true,
    }
  );
};
