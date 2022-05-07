import * as Yup from 'yup';
import { useState } from 'react';
import { paramCase } from 'change-case';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// @mui
import { styled } from '@mui/material/styles';
import { Chip, Stack, TextField, Button, Autocomplete, Grid } from '@mui/material';

// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// utils
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Image from '../../Image';
import Iconify from '../../Iconify';
import InputStyle from '../../InputStyle';
import SearchNotFound from '../../SearchNotFound';
import { getCollectionsBySearch } from '../../../redux/actions/collections';

// ----------------------------------------------------------------------

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// ----------------------------------------------------------------------

export default function CollectionSearch() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  const searchCollection = () => {
    if (search.trim() || tags) {
      dispatch(getCollectionsBySearch({ search, tags: tags.tag?.join(',') }));
      navigate(`${PATH_DASHBOARD.musicWorld.marketplace}?searchQuery=${search || 'none'}&tags=${tags.tag?.join(',')}`);
    } else {
      navigate(PATH_DASHBOARD.musicWorld.marketplace);
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchCollection();
    }
  };

  const handleAddChip = (tag) => setTags([...tags, tag]);

  const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));

  const top100Tags = [
    'Music', 
    'Artist', 
    'HipHop', 
    'Rock', 
    'Rap',
    'Singer',
    'DJ',
    'Song',
    'Band',
    'Musician',
    'LatestHits',
    'MusicVideo',
    'PartyMusic',
    'HouseMusic',
    'RockBand',
    'CountryBlues',
  ];

  return (
    <Grid>
      <TextField
        onKeyDown={handleKeyPress}
        name="search"
        variant="outlined"
        label="Search Collection"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Grid mt={2}>
        <Autocomplete
          multiple
          id="tags-filled"
          options={top100Tags.map((option) => option)}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
          }
          renderInput={(params) => <TextField {...params} label="Search Tags" />}
          onChange={(e, tag) => setTags({ ...tags, tag })}
        />
      </Grid>
    </Grid>
  );
}
