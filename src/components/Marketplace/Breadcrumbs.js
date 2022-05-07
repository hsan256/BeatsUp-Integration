import { capitalCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import { useAccount } from '../../hooks/web3';
// _mock_
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../_mock';
// components
import Page from '../Page';
import Iconify from '../Iconify';
import HeaderBreadcrumbs from '../HeaderBreadcrumbs';
// sections
import {
  Profile,
  ProfileCover,
  ProfileFriends,
  ProfileGallery,
  ProfileFollowers,
} from '../../sections/@dashboard/user/profile';
import ProfileArtistCollection from '../Profile/Artist/ProfileArtistCollection';
import ProfileArtistMusic from '../Profile/Artist/ProfileArtistMusic';
import Collections from './Collections';

import { getCollections } from '../../redux/actions/collections';
import Owned from './Owned/Owned';
import Managed from './Managed/Managed';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    // justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));
// ----------------------------------------------------------------------

export default function Breadcrumbs() {
  const { themeStretch } = useSettings();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  const [currentTab, setCurrentTab] = useState('Buy');
  const [findFriends, setFindFriends] = useState('');

  const handleChangeTab = (newValue) => {
    setCurrentTab(newValue);
  };

  const handleFindFriends = (value) => {
    setFindFriends(value);
  };

  // ----------------------------------------------------------

  const PROFILE_TABS = [
    {
      value: 'Buy',
      icon: <Iconify icon={'logos:ethereum-color'} width={20} height={20} />,
      component: <Collections />,
    },
    {
      value: 'My Collections',
      icon: <Iconify icon={'emojione-v1:music-ascend'} color="" width={20} height={20} />,
      component: <Owned />,
    },
    {
      value: 'Managed Collections',
      icon: <Iconify icon={'flat-color-icons:manager'} color="" width={20} height={20} />,
      component: <Managed />,
    },
    // lien mte3 el icons https://icon-sets.iconify.design/
  ];

  return (
    <>
      <Card
        sx={{
          mb: 3,
          height: 50,
          position: 'relative',
        }}
      >
        <TabsWrapperStyle>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={(e, value) => handleChangeTab(value)}
          >
            {PROFILE_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalCase(tab.value)} />
            ))}
          </Tabs>
        </TabsWrapperStyle>
      </Card>

      {PROFILE_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </>
  );
}
