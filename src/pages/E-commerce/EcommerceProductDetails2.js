import { sentenceCase } from 'change-case';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import {
  Box, Tab, Card, Grid, Divider, Container, IconButton,
  Button, Stack, Typography, Rating, Avatar
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// form
import { Controller, useForm } from 'react-hook-form';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getProduits } from '../../redux/actions/E-commerceActions/productActions';
import { createCart } from '../../redux/actions/E-commerceActions/cartActions';
import { createWishlist, getWishlists } from '../../redux/actions/E-commerceActions/wishlistActions';
import { getCourses } from '../../redux/actions/E-LearningActions/courses';
import { getComments } from '../../redux/actions/E-commerceActions/commentActions';
import { getProduct, addCart, onGotoStep } from '../../redux/slices/product';
// utils
import { fShortenNumber, fCurrency } from '../../utils/formatNumber';
import { fDate } from '../../utils/formatTime';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Label from '../../components/Label';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Markdown from '../../components/Markdown';
// import { SkeletonProduct } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { FormProvider, RHFSelect, RHFTextField } from '../../components/hook-form';
// sections
import {
  ProductDetailsSummary,
  ProductDetailsReview,
} from '../../sections/@dashboard/e-commerce/product-details';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';
import Image from '../../components/Image';
// import { addToCart } from 'src/redux/actions/E-commerceActions/cartActions';
// import { ConnectedTvOutlined } from '@mui/icons-material';
// sections
import {
  BookingNewestBooking,
} from '../../sections/@dashboard/general/booking';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

export default function EcommerceProductDetails2() {
  const theme = useTheme();
  const location = useLocation();
  const { single } = location.state;
  const singleId = single._id;
  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { name = '' } = useParams();
  const { product, error, checkout } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
  const [qte, setQte] = useState(1);
  const [value, setValue] = useState('1');
  const [listSugg, setListSugg] = useState([]);
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    getComments(dispatch);
  }, [dispatch]);
  const comments = useSelector((state) => state.comments);

  useEffect(() => {
    const newComment = comments.filter((comment) =>
      (comment.idProduit === single._id))
    setCommentList(newComment)
   }, [comments]);
  //  console.log(commentList);

   const totalReviews = commentList.reduce((total, currentValue) => total += currentValue.review,0);
   const ReviewProduit = ((totalReviews) / (commentList.length));
console.log(ReviewProduit);
  const inc = () => {
    if (qte < single.countInStock) {
      setQte(qte + 1);
      setCartData({ ...cartData, qteItem: qte + 1, totalpriceItem: (qte + 1) * single.price })
    }
    else {
      setQte(single.countInStock);
      alert("max limit reached");
    }
  };
  const dec = () => {
    if (qte > 1) {
      setQte(qte - 1);
      setCartData({ ...cartData, qteItem: qte - 1, totalpriceItem: (qte - 1) * single.price })
    }
    else {
      setQte(1);
      alert("min limit reached");
    }
  };


  const [wishlistData, setWishlisttData] = useState({
    nameProduit: single.name,
    statusProduit: single.status,
    descriptionProduit: single.description,
    imageProduit: single.image,
    countInStockProduit: single.countInStock,
    priceProduit: single.price,
    oldPriceProduit: single.oldPrice,
    familleProduit: single.famille,
    idUser: user.result._id,
    idProduit: single._id,
  });
  const defaultValues = {
  };

  const [cartData, setCartData] = useState({
    nameItem: single.name,
    statusItem: single.status,
    descriptionItem: single.description,
    imageItem: single.image,
    countInStockItem: single.countInStock,
    priceItem: single.price,
    totalpriceItem: single.price * qte,
    qteItem: 1,
    oldPriceItem: single.oldPrice,
    familleItem: single.famille,
    idUser: user.result._id,
    idItem: single._id,
  });


  const onSubmit = async () => {
    try {
      // if (!alreadyProduct) {
      //   onAddCart({
      //     ...data,
      //     subtotal: data.price * data.quantity,
      //   });
      // }
      // setCartItems([...cartItems, qte]);
      // onGotoStep(0);
      // navigate(PATH_DASHBOARD.eCommerce.checkout, { state: { cartItems } });
      setCartData({ ...cartData, totalpriceItem: qte * cartData.priceItem })
      dispatch(createCart(cartData));
      enqueueSnackbar('Product Added to Cart!');
      navigate(PATH_DASHBOARD.eCommerce.checkout);

    } catch (error) {
      console.error(error);
    }
  };

  const methods = useForm({
    defaultValues,
  });

  const { watch, control, handleSubmit } = methods;

  const values = watch();

  // console.log("details");
  // console.log(single);
  console.log(cartData);

  // useEffect(() => {
  //   dispatch(getProduct(name));
  // }, [dispatch, name]);

  const handleAddCart = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    getWishlists(dispatch);
  }, [dispatch]);
  const wishlists = useSelector((state) => state.wishlists);
  // console.log(wishlists);

  const handleAddWishlist = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      // handleClosePreview();
      dispatch(createWishlist(wishlistData));
      enqueueSnackbar('Product Added to Wishlist!');
      navigate(PATH_DASHBOARD.eCommerce.wishlist);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  useEffect(() => {
    getCourses(dispatch);
  }, [dispatch]);
  const courses = useSelector((state) => state.cources);
  // console.log(courses);

  useEffect(() => {
    const newSugg = courses.filter((course) =>
      (course.famille === single.famille)
    )
    setListSugg(newSugg)
   }, [courses]);

  return (
    <Page title="Ecommerce: Product Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            {
              name: 'Shop',
              href: PATH_DASHBOARD.eCommerce.shop,
            },
            { name: single.name },
          ]}
        />

        <CartWidget />

        {single && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <Box sx={{ p: 1 }}>
                    <Box sx={{ zIndex: 0, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                      <Image
                        alt="large image"
                        src={single.image}
                        ratio="1/1"
                        sx={{ cursor: 'zoom-in' }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <RootStyle>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      // color={single.inStock === 'in_stock' ? 'success' : 'error'}
                      color={single.countInStock === 0 ? 'error' : 'success'}
                      sx={{ textTransform: 'uppercase' }}
                    >

                      {single.countInStock === 0 ? 'out of Stock' : 'in Stock'
                      }
                    </Label>
                    <Typography
                      variant="overline"
                      sx={{
                        mt: 2,
                        mb: 1,
                        display: 'block',
                        color: single.status === 'used' ? 'error.main' : 'info.main',
                      }}
                    >
                      {single.status} Product
                    </Typography>
                    {single.nameUser !== 'Admin' &&
                      <Stack spacing={2.5} sx={{ p: 1, pb: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={name} src={single.imageUser} />
                          <div>
                            <Typography variant="subtitle2">{single.nameUser}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
                              {fDate(single.createdAt)}
                            </Typography>
                          </div>
                        </Stack>
                      </Stack>
                    }
                    <Typography variant="h3" paragraph>
                      {single.name}
                      {/* Famille : {single.famille} */}
                    </Typography>
                   

                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Rating value={ReviewProduit} precision={0.1} readOnly />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      
                        ({fShortenNumber(commentList.length)}&nbsp;
                        reviews)
                      </Typography>
                    </Stack>

                    <Typography variant="h4" sx={{ mb: 3 }}>
                      {
                        single.oldPrice !== 0 &&

                        <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                          {single.oldPrice} DT
                        </Box>
                      }
                      &nbsp; &nbsp;{single.price} DT
                    </Typography>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <Grid>
                      <Typography variant="h6" paragraph>
                        Description
                      </Typography>
                      {single.description}
                    </Grid>
                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

                      {single.countInStock !== 0 &&
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>

                          <Typography variant="subtitle1" sx={{ mt: 3 }}>
                            Quantity
                          </Typography>

                          <Typography sx={{ mt: 3 }}>
                            {/* <Incrementer
                              name="quantity"
                              quantity={values.quantity}
                              // available={available}
                              onIncrementQuantity={() => setValue('quantity', values.quantity + 1)}
                              onDecrementQuantity={() => setValue('quantity', values.quantity - 1)}
                            /> */}

                            <Button onClick={dec} >-</Button>

                            {qte}
                            <Button onClick={inc}>+</Button>
                            {/* <RHFTextField
                            name="name"
                            value={qte}
                            onChange={(e) => setQte(e.target.value)}
                            /> */}
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ mt: 7, textAlign: 'right', color: 'text.secondary' }}>
                            Available: {single.countInStock}
                            {/* {user.result.username} */}
                          </Typography>
                        </Stack>
                      }
                      <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                        <Button
                          fullWidth
                          // disabled={isMaxQuantity}
                          size="large"
                          color="warning"
                          variant="contained"
                          onClick={handleAddWishlist}
                        >
                          Add to Wishlist
                        </Button>

                        {single.countInStock !== 0 &&
                          <Button
                            fullWidth
                            size="large"
                            type="submit"
                            sx={{ whiteSpace: 'nowrap' }}
                            startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
                            variant="contained"
                          // onClick={handleAddCart} 
                          >
                            Add To Cart
                          </Button>
                        }
                      </Stack>
                    </FormProvider>
                    {/* <ProductDetailsSummary
                    single={single}
                    product={product}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                  /> */}
                  </RootStyle>
                </Grid>
              </Grid>
            </Card>


            <Card>
              <TabContext value={value}>
                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                  <TabList onChange={(e, value) => setValue(value)}>
                    <Tab disableRipple value="1" label="Description" />
                    <Tab
                      disableRipple
                      value="2"
                      // label= {`Review (${commentList.length})`}
                      label= "Reviews"
                      sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                    />
                  </TabList>
                </Box>

                <Divider />

                <TabPanel value="1">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={single.description} />
                    
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <ProductDetailsReview product = {product} single={single} />
                </TabPanel>
              </TabContext>
            </Card>


            {/* <Card>
            <ProductDetailsReview product={product} />
            </Card> */}
          </>
        )}

        {/* {!product && <SkeletonProduct />}
        {error && <Typography variant="h6">404 Product not found</Typography>} */}
      </Container>

      {/* Suggestion  */}
      
        <Grid item xs={12}>
          <BookingNewestBooking listSugg = {listSugg}/>
        </Grid>
    </Page>

  );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrementQuantity: PropTypes.func,
  onDecrementQuantity: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrementQuantity, onDecrementQuantity }) {
  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032',
      }}
    >
      <IconButton size="small" color="inherit" disabled={quantity <= 1} onClick={onDecrementQuantity}>
        <Iconify icon={'eva:minus-fill'} width={14} height={14} />
      </IconButton>

      <Typography variant="body2" component="span" sx={{ width: 40, textAlign: 'center' }}>
        {quantity}
      </Typography>

      <IconButton size="small" color="inherit" disabled={quantity >= available} onClick={onIncrementQuantity}>
        <Iconify icon={'eva:plus-fill'} width={14} height={14} />
      </IconButton>
    </Box>
  );
}