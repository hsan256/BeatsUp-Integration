import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Container, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Iconify from '../../../components/Iconify';
import VideoCall from './VideoCall';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useSettings from '../../../hooks/useSettings';
import ThemeProvider from '../../../theme';

import { PATH_DASHBOARD } from '../../../routes/paths';

function App() {
  const [inCall, setInCall] = useState(false);
  const { themeStretch } = useSettings();
  return (
    <ThemeProvider>
      <div style={{ height: '100%' }}>
        {/* <HeaderBreadcrumbs
          heading="Event"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Event Calendar', href: PATH_DASHBOARD.calendarUser },
            { name: 'Live Event' },
          ]}
        /> */}

        {inCall ? (
          <VideoCall setInCall={setInCall} />
        ) : (
          <Button variant="contained" color="primary" onClick={() => setInCall(true)}>
            <AddCircleOutlineIcon />
            Join Call
          </Button>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
