import PropTypes from 'prop-types';
// @mui
import { Card, Stack, Typography, Divider, CircularProgress } from '@mui/material';
// utils
import { fCurrency, fNumber } from '../../utils/formatNumber';
import { useEthPrice, COLLECTION_PRICE } from '../../hooks/useEthPrice';
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

export default function EthPriceInfo() {
  const { eth } = useEthPrice();

  return (
    <Card sx={{ py: 3 }}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Stack width={1} textAlign="center">
          {eth.data ? (
            <>
              <Typography variant="h4">
                <Iconify icon={'logos:ethereum-color'} width={20} height={20} /> = {fCurrency(eth.data)}
              </Typography>
            </>
          ) : (
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0}>
              <CircularProgress thickness={2} />
            </Stack>
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Current Eth Price
          </Typography>
        </Stack>
        <Stack width={1} textAlign="center">
          {eth.data ? (
            <>
              <Typography variant="h4">
                {eth.perItem} <Iconify icon={'logos:ethereum-color'} width={20} height={20} /> = {COLLECTION_PRICE}$
              </Typography>
            </>
          ) : (
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0}>
              <CircularProgress thickness={2} />
            </Stack>
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price per collection
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
