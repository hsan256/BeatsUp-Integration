import React, { useEffect } from 'react';
// @mui
import { Container, Grow, Grid, Paper, Stack } from '@mui/material';
import { styled } from '@mui/styles';
// hooks
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useAccount, useNetwork } from '../../../hooks/web3';
import { useEthPrice } from '../../../hooks/useEthPrice';
import useSettings from '../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// context
import { useWeb3 } from '../../../contexts/providers';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Collections from '../../../components/Marketplace/Collections';
import Pagination from '../../../components/Pagination/Pagination';
import CollectionSearch from '../../../components/Marketplace/Search/CollectionSearch';
import MarketplaceWelcome from '../../../components/Marketplace/MarketplaceWelcome';
import EthPriceInfo from '../../../components/Marketplace/EthPriceInfo';
import Breadcrumbs from '../../../components/Marketplace/Breadcrumbs';

import { getCollections } from '../../../redux/actions/collections';

// ----------------------------------------------------------------------

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// ----------------------------------------------------------------------

export default function Marketplace() {
  const { themeStretch } = useSettings();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  // -----------------Web3 info----------------

  // const { connect, isLoading, isWeb3Loaded } = useWeb3();
  // const { account } = useAccount();
  // const { network } = useNetwork();
  // const eth = useEthPrice();

  // --------------------Pagination Styles----------------------

  const PaginationPaperStyle = styled(Paper)(() => ({
    borderRadius: 4,
    marginTop: '4rem',
    padding: '16px',
  }));

  // -------------------------------------------------

  return (
    <Page title="Music: Marketplace">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Marketplace"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Music', href: PATH_DASHBOARD.musicWorld.explore },
            { name: 'Marketplace' },
          ]}
        />
        <Grid item xs={12} md={12} mb={3}>
          <MarketplaceWelcome />
        </Grid>

        {/* Search */}
        <Grid container spacing={2}>
          <Grid item xs={3} mb={5}>
            <CollectionSearch />
          </Grid>
          <Grid item xs={4}>
            <></>
          </Grid>
          <Grid item xs={5} mt={1}>
            <EthPriceInfo />
          </Grid>
        </Grid>
        {/* end Search */}

        {/* Breadcrumbs */}

        <Breadcrumbs />

        {/* Breadcrumbs end */}

        {/* <Collections /> */}

        {/* {!searchQuery && (
          <PaginationPaperStyle elevation={0}>
            <Pagination page={page} />
          </PaginationPaperStyle>
        )} */}
      </Container>
    </Page>
  );
}
