import { useEffect, useState } from 'react';
// @mui
import { Container, MenuItem, TextField, Grid, Stack, CircularProgress } from '@mui/material';
// radioApi
import { RadioBrowserApi } from 'radio-browser-api';
// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import MusicPlayerSlider from '../../components/Radio/MediaControlCard';

// ----------------------------------------------------------------------

export default function Radio() {
  const { themeStretch } = useSettings();

  const [stations, setStations] = useState();
  const [stationFilter, setStationFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filters = ['all', 'classical', 'country', 'dance', 'disco', 'house', 'jazz', 'pop', 'rap', 'retro', 'rock'];

  useEffect(() => {
    setupApi(stationFilter, searchFilter).then((data) => {
      setStations(data);
    });
  }, [stationFilter]);

  const setupApi = async (stationFilter, searchFilter) => {
    const api = new RadioBrowserApi(fetch.bind(window), 'My Radio App');

    const stations = await api
      .searchStations({
        // http://all.api.radio-browser.info/json/languages
        // name: 'Mosaique FM',
        // name: searchFilter,
        language: 'french',
        tag: stationFilter,
        limit: 30,
      })
      .then((data) => {
        return data;
      });

    return stations;
  };

  return (
    <Page title="Music: Radio">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Our Radio Stations"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Music', href: PATH_DASHBOARD.musicWorld.explore },
            { name: 'Radio' },
          ]}
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <TextField
            name="search"
            variant="outlined"
            label="Search Radio"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          <TextField defaultValue={filters[0]} select size="small">
            {filters.map((filter, index) => (
              <MenuItem
                key={index}
                value={filter}
                sx={{ mx: 1, my: 0.5, borderRadius: 1 }}
                onClick={() => setStationFilter(filter)}
              >
                {filter}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {!stations ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {stations &&
              stations.map((station, index) => {
                return (
                  <Grid key={index} item xs={12} sm={6} md={6}>
                    <MusicPlayerSlider station={station} />
                  </Grid>
                );
              })}
          </Grid>
        )}
      </Container>
    </Page>
  );
}
