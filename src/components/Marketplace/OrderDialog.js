import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/styles';
import {
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
// hooks
import { useEthPrice } from '../../hooks/useEthPrice';
// components
import { FormProvider, RHFTextField } from '../hook-form';
import Iconify from '../Iconify';

const defaultOrder = {
  price: '',
  email: '',
  confirmationEmail: '',
};

const _createFormState = (isDisabled = false, message = '') => ({ isDisabled, message });

const createFormState = ({ price, email, confirmationEmail }, hasAgreedTOS, isNewPurchase) => {
  if (!price || Number(price) <= 0) {
    return _createFormState(true, 'Price is not valid.');
  }
  if (isNewPurchase) {
    if (confirmationEmail.length === 0 || email.length === 0) {
      return _createFormState(true);
    }
    if (email !== confirmationEmail) {
      return _createFormState(true, 'Email are not matching.');
    }
  }
  if (!hasAgreedTOS) {
    return _createFormState(true, 'You need to agree with terms of service in order to submit the form');
  }

  return _createFormState();
};

export default function OrderDialog({ collection, onClose, onSubmit, isNewPurchase }) {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(defaultOrder);
  const [enablePrice, setEnablePrice] = useState(false);
  const [hasAgreedTOS, setHasAgreedTOS] = useState(false);
  const { eth } = useEthPrice();

  useEffect(() => {
    if (!!collection) {
      setOpen(true);
      setOrder({
        ...defaultOrder,
        price: eth.perItem,
      });
    }
  }, [collection]);

  const closeModal = () => {
    setOpen(false);
    setOrder(defaultOrder);
    setEnablePrice(false);
    setHasAgreedTOS(false);
    onClose();
  };

  const formState = createFormState(order, hasAgreedTOS, isNewPurchase);

  // ----------------------------------------------------------------------

  const { enqueueSnackbar } = useSnackbar();

  const NewOrderSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().min(1000).required('Content is required'),
    cover: Yup.mixed().required('Cover is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewOrderSchema),
    defaultOrder,
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

  return (
    <>
      <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{collection.title}</DialogTitle>

        <DialogContent>
          {formState.message && (
            <Snackbar open={open} autoHideDuration={4000}>
              <Alert severity="warning" sx={{ width: '100%' }}>
                {formState.message}
              </Alert>
            </Snackbar>
          )}
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} mt={1}>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={enablePrice}
                        onChange={({ target: { checked } }) => {
                          setOrder({
                            ...order,
                            price: checked ? order.price : eth.perItem,
                          });
                          setEnablePrice(checked);
                        }}
                        color="primary"
                      />
                    }
                    label="Adjust Price - only when the price is not correct"
                  />

                  <RHFTextField
                    disabled={!enablePrice}
                    name="price"
                    label="Price (Eth)"
                    value={order.price}
                    onChange={({ target: { value } }) => {
                      if (Number.isNaN(value)) {
                        return;
                      }
                      setOrder({
                        ...order,
                        price: value,
                      });
                    }}
                  />
                  <Typography variant="subtitle2" color="grey">
                    Price will be verified at the time of the order. If the price will be lower, order can be declined
                    (+- 2% slipage is allowed).
                  </Typography>
                </Stack>
                {isNewPurchase && (
                  <>
                    <Stack spacing={1} mt={3}>
                      <RHFTextField
                        name="email"
                        type="email"
                        id="email"
                        placeholder="x@y.com"
                        label="Email"
                        onChange={({ target: { value } }) => {
                          setOrder({
                            ...order,
                            email: value.trim(),
                          });
                        }}
                      />
                      <Typography variant="subtitle2" color="grey">
                        It&apos;s important to fill a correct email, otherwise the order cannot be verified. We are not
                        storing your email anywhere.
                      </Typography>
                    </Stack>
                    <Stack spacing={1} mt={3}>
                      <RHFTextField
                        type="email"
                        name="confirmationEmail"
                        id="confirmationEmail"
                        label="Repeat Email"
                        onChange={({ target: { value } }) => {
                          setOrder({
                            ...order,
                            confirmationEmail: value.trim(),
                          });
                        }}
                      />
                    </Stack>
                  </>
                )}
                <Stack spacing={1} mt={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="remember"
                        color="primary"
                        checked={hasAgreedTOS}
                        onChange={({ target: { checked } }) => {
                          setHasAgreedTOS(checked);
                        }}
                      />
                    }
                    label="I accept BeatsUp 'terms of service' and I agree that my order can be rejected in the case data provided above are not correct"
                  />
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            disabled={formState.isDisabled}
            onClick={() => {
              onSubmit(order, collection);
            }}
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
