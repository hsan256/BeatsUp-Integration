import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  Box,
  Card,
  Radio,
  Stack,
  Button,
  Collapse,
  TextField,
  Typography,
  RadioGroup,
  CardHeader,
  CardContent,
  FormHelperText,
  Grid,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import useResponsive from '../../../../hooks/useResponsive';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onGotoStep, onBackStep, onNextStep, applyShipping } from '../../../../redux/slices/product';
import { deleteAllCart, sendEmail } from '../../../../redux/actions/E-commerceActions/cartActions';
// components
import Iconify from '../../../../components/Iconify';
import Image from '../../../../components/Image';
import { FormProvider } from '../../../../components/hook-form';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import Paypal from '../Paypal'


// ----------------------------------------------------------------------
const OptionStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2.5),
  justifyContent: 'space-between',
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

const DELIVERY_OPTIONS = [
  {
    value: 0,
    title: 'Standard delivery (Free)',
    description: 'Delivered on Monday, August 12',
  },
  {
    value: 2,
    title: 'Fast delivery ($2,00)',
    description: 'Delivered on Monday, August 5',
  },
];

const PAYMENT_OPTIONS = [
  {
    value: 'paypal',
    title: 'Pay with Paypal',
    description: 'You will be redirected to PayPal website to complete your purchase securely.',
    icons: ['https://minimal-assets-api.vercel.app/assets/icons/ic_paypal.svg'],
  },
  {
    value: 'credit_card',
    title: 'Credit / Debit Card',
    description: 'We support Mastercard, Visa, Discover and Stripe.',
    icons: [
      'https://minimal-assets-api.vercel.app/assets/icons/ic_mastercard.svg',
      'https://minimal-assets-api.vercel.app/assets/icons/ic_visa.svg',
    ],
  },
  {
    value: 'cash',
    title: 'Cash on CheckoutDelivery',
    description: 'Pay with cash when your order is delivered.',
    icons: [],
  },
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

// const { control } = useFormContext();
// const isDesktop = useResponsive('up', 'sm');

export default function CheckoutPayment({ cartList }) {
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.product);
  const { total, discount, subtotal, shipping } = checkout;
  const result = cartList.reduce((total, currentValue) => total += currentValue.totalpriceItem, 0);
  const [paiid, setPaiid] = useState(false);
  const [mode, setMode] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  const handleApplyShipping = (value) => {
    dispatch(applyShipping(value));
  };

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required!'),
  });

  const defaultValues = {
    delivery: shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [payData, setPayData] = useState({
    mailadresse: user.result.email,
  });

  const onSubmit = async () => {
    try {
      dispatch(sendEmail(payData));
      handleNextStep();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAll = () => {
    dispatch(deleteAllCart());
  };

  const transactionSuccess = () => {
    setPaiid(true);
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutDelivery onApplyShipping={handleApplyShipping} deliveryOptions={DELIVERY_OPTIONS} />
          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            paymentOptions={PAYMENT_OPTIONS}
            cartList={cartList}
          />

          {/* <Card sx={{ my: 3 }}>
            <CardHeader title="Payment options" />
            <CardContent>
              <Controller
                name="payment"
                // control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <RadioGroup row {...field}>
                      <Stack spacing={2}>
                        {paymentOptions.map((method) => {
                          const { value, title, icons, description } = method;

                          const hasChildren = value === 'credit_card';

                          const selected = field.value === value;

                          return (
                            <OptionStyle
                              key={title}
                              sx={{
                                ...(selected && {
                                  boxShadow: (theme) => theme.customShadows.z20,
                                }),
                                ...(hasChildren && { flexWrap: 'wrap' }),
                              }}
                            >
                              <FormControlLabel
                                value={value}
                                control={<Radio checkedIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />} />}
                                label={
                                  <Box sx={{ ml: 1 }}>
                                    <Typography variant="subtitle2">{title}</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {description}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ flexGrow: 1, py: 3 }}
                              />


                              <Stack direction="row" spacing={1} flexShrink={0}>
                                {icons.map((icon) => (
                                  <Image key={icon} alt="logo card" src={icon} />
                                ))}
                              </Stack>



                              {hasChildren && (
                                <Collapse in={field.value === 'credit_card'} sx={{ width: 1 }}>
                                  <TextField select fullWidth label="Cards" SelectProps={{ native: true }}>
                                    {cardOptions.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </TextField>


                                  <Button
                                    size="small"
                                    startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
                                    sx={{ my: 3 }}
                                  >
                                    Add new card
                                  </Button>
                                </Collapse>
                              )}
                            </OptionStyle>
                            
                          );
                        })}
                      </Stack>
                    </RadioGroup>

                    {!!error && (
                      <FormHelperText error sx={{ pt: 1, px: 2 }}>
                        {error.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </CardContent>
          </Card> */}


          <Button
            size="small"
            color="inherit"
            onClick={handleBackStep}
            startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutBillingInfo onBackStep={handleBackStep} />

          <CheckoutSummary
            enableEdit
            cartList={cartList}
            total={total}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            onEdit={() => handleGotoStep(0)}
          />


            <Paypal
              result={result}
              onSucces={transactionSuccess}
            />

          {paiid === false ? (
            <LoadingButton
              fullWidth size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled
            >
              Complete Order
            </LoadingButton>) : (
            <LoadingButton
              fullWidth size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Complete Order
            </LoadingButton>
            
          )}


        </Grid>
      </Grid>
    </FormProvider>
  );
}
