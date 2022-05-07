import React from 'react';
// @mui
import { Container, Grow, Grid, Paper, Stack } from '@mui/material';
import { styled } from '@mui/styles';
// hooks
import { useLocation } from 'react-router-dom';
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Collections from '../../components/Explore/Collections';
import Pagination from '../../components/Pagination/Pagination';
import CollectionSearch from '../../components/Explore/Search/CollectionSearch';

// import { getCollections } from '../../redux/actions/collections';

// ----------------------------------------------------------------------

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// ----------------------------------------------------------------------

export default function ExploreMusic() {
  const { themeStretch } = useSettings();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  // -----------------Display Without Pagination----------------

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   getCollections(dispatch);
  // }, [dispatch]);

  // --------------------Pagination Styles----------------------

  const PaginationPaperStyle = styled(Paper)(() => ({
    borderRadius: 4,
    marginTop: '4rem',
    padding: '16px',
  }));

  // -------------------------------------------------

  return (
    <Page title="Music: Explore">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Trending collections"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Music', href: PATH_DASHBOARD.musicWorld.explore },
            { name: 'Explore' },
          ]}
        />
        
        {/* Search */}
        <Grid item xs={12} md={3}>
          <Stack mb={5}>
            <CollectionSearch />
          </Stack>
        </Grid>
        {/* end Search */}

        {/* Collections */}
        <Collections />
        {/* end Collections */}

        {!searchQuery && (
          <PaginationPaperStyle elevation={0}>
            <Pagination page={page} />
          </PaginationPaperStyle>
        )}
      </Container>
    </Page>
  );
}
