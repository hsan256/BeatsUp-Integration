import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert, Button, FormControlLabel, Switch, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
// import useAuth from '../../hooks/useAuth';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Iconify from '../Iconify';
import { FormProvider, RHFTextField, RHFRadioGroup } from '../hook-form';
import Icon from './icon';
import { register } from '../../redux/actions/auth';

// ----------------------------------------------------------------------

export default function RegisterArtistForm() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  // const { register } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    // firstName: Yup.string().required('First name required'),
    // lastName: Yup.string().required('Last name required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    // firstName: '',
    // lastName: '',
    username: '',
    email: '',
    password: '',
    wallet: '',
    isArtist: true,
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,

    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log(data);
      dispatch(register(data));
      enqueueSnackbar('Register success!');
      navigate('/');
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField
          name="wallet"
          label="Wallet Address"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => window.open('https://metamask.io/download.html', '_blank')}>
                  <Iconify icon={'logos:metamask-icon'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {/* <RHFTextField name="firstName" label="First name" /> */}
          {/* <RHFTextField name="lastName" label="Last name" /> */}
          <RHFTextField name="username" label="Username" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          labelPlacement="start"
          control={
            <Controller
              name="isArtist"
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={field.value !== false}
                  onChange={(event) => field.onChange(event.target.checked && true)}
                />
              )}
            />
          }
          label={
            <>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Artist
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Apply To Register As Artist
              </Typography>
            </>
          }
          sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
