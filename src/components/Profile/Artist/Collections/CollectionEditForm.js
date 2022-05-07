import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSnackbar } from 'notistack';
import { useNavigate, useLocation } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Chip, Stack, Button, TextField, Typography, Autocomplete, Input, Select } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../hook-form';
// components
import Iconify from '../../../Iconify';
// firebase
import storage from '../../../../firebase';
import { getMusicsById } from '../../../../redux/actions/musics';
import { updateCollection } from '../../../../redux/actions/collections';

// ----------------------------------------------------------------------

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function MusicEditForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  const location = useLocation();
  const { single } = location.state;

  const { musics } = useSelector((state) => state.musics);

  useEffect(() => {
    getMusicsById(dispatch);
  }, [dispatch]);

  const Input = styled('input')({
    display: 'none',
  });

  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewMusicSchema = Yup.object().shape({
    creator: Yup.string().required('Creator is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    // content: Yup.string().min(1000).required('Content is required'),
    // cover: Yup.mixed().required('Cover is required'),
  });

  const defaultValues = {
    creator: '',
    title: '',
    desc: '',
    content: '',
    tags: '',
    cover: '',
    trailer: '',
  };

  const [collectionData, setCollectionData] = useState({
    creator: user.result._id,
    title: single.title,
    desc: single.desc,
    content: [single.content],
    tags: [single.tags],
    cover: single.cover,
    trailer: single.trailer,
  });

  const { tags, content } = single;
  console.log(content);
  const [uploaded, setUploaded] = useState(0);

  const methods = useForm({
    resolver: yupResolver(), // add NewCollectionSchema in params to activate error handling
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      handleClosePreview();
      dispatch(updateCollection(single._id, collectionData));
      enqueueSnackbar('Edit collection success!');
      navigate(PATH_DASHBOARD.artist.profile);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'cover',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/collections/${fileName}`).put(item.file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            setCollectionData((prev) => {
              return { ...prev, [item.label]: url };
            });
            setUploaded((prev) => prev + 1);
          });
        }
      );
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    upload([
      { file: collectionData.cover, label: 'cover' },
      { file: collectionData.trailer, label: 'trailer' },
    ]);
  };

  const handleSelect = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setCollectionData({ ...collectionData, [e.target.name]: value });
  };

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
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="creator" label="Creator's Name" disabled value={user.result.username} />

                <RHFTextField
                  name="title"
                  label="Collection Title"
                  value={collectionData.title}
                  onChange={(e) => setCollectionData({ ...collectionData, title: e.target.value })}
                />

                <RHFTextField
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  value={collectionData.desc}
                  onChange={(e) => setCollectionData({ ...collectionData, desc: e.target.value })}
                />

                <Autocomplete
                  multiple
                  id="tags-filled"
                  options={top100Tags.map((option) => option)}
                  defaultValue={tags.map((option) => option)}
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                  }
                  renderInput={(params) => <TextField {...params} label="Tags" />}
                  onChange={(e, newValue) => setCollectionData({ ...collectionData, tags: newValue })}
                />

                {/* <Select name="content" label="Content" native multiple fullWidth onChange={handleSelect}>
                  {musics.map((music) => (
                    <option key={music._id} value={music._id}>
                      {music.title}
                    </option>
                  ))}
                </Select> */}

                <Autocomplete
                  multiple
                  id="content-outlined"
                  options={musics.map((option) => option)}
                  getOptionLabel={(option) => option.title}
                  defaultValue={content.map((option) => option)}
                  filterSelectedOptions
                  renderInput={(params) => <TextField {...params} label="Songs" />}
                  onChange={(e, newValue) => setCollectionData({ ...collectionData, content: newValue })}
                />

                {/* <div>
                  <LabelStyle>Content</LabelStyle>
                  <RHFEditor name="content" />
                </div> 

                <div>
                  <LabelStyle>Cover</LabelStyle>
                  <RHFUploadSingleFile name="cover" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
                </div> */}

                <Stack direction="row" justifyContent="center" alignItems="center" spacing={12}>
                  <Grid item xs={6}>
                    <div>
                      <LabelStyle>Cover</LabelStyle>
                      <label htmlFor="contained-button-file">
                        <Input
                          id="contained-button-file"
                          name="cover"
                          type="file"
                          multiple={false}
                          onChange={(e) => setCollectionData({ ...collectionData, cover: e.target.files[0] })}
                        />
                        <Button
                          fullWidth
                          variant="contained"
                          component="span"
                          endIcon={<Iconify icon={'dashicons:album'} />}
                        >
                          Upload Cover Image
                        </Button>
                      </label>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <LabelStyle>Trailer</LabelStyle>
                      <label htmlFor="contained-button-file">
                        <Input
                          id="contained-button-file"
                          name="trailer"
                          type="file"
                          multiple={false}
                          onChange={(e) => setCollectionData({ ...collectionData, trailer: e.target.files[0] })}
                        />
                        <Button
                          fullWidth
                          variant="contained"
                          component="span"
                          endIcon={<Iconify icon={'akar-icons:video'} />}
                        >
                          Upload Trailer Video
                        </Button>
                      </label>
                    </div>
                  </Grid>
                </Stack>
              </Stack>
            </Card>
            {uploaded === 2 ? (
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                <Button disabled fullWidth color="inherit" variant="outlined" size="large" onClick={handleOpenPreview}>
                  Upload
                </Button>
                <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Submit
                </LoadingButton>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                <Button fullWidth color="inherit" variant="outlined" size="large" onClick={handleUpload}>
                  Upload
                </Button>
                <LoadingButton disabled fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Submit
                </LoadingButton>
              </Stack>
            )}
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
