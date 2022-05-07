import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
  Button,
} from '@mui/material';
// redux
import { deleteCart, updateCart } from '../../../../redux/actions/E-commerceActions/cartActions';
// utils
import getColorName from '../../../../utils/getColorName';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import QteProduct from '../QteProduct';



// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
}));


// ----------------------------------------------------------------------

CheckoutProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
};
export default function CheckoutProductList({ cartList, products, onDelete, onIncreaseQuantity, onDecreaseQuantity }) {
  const dispatch = useDispatch();
  const handleDeleteCart = (cartId) => {
    // const deleteCarts = cartList.filter((cart) => !selected.includes(cart._id));
    dispatch(deleteCart(cartId));
  };

  return (
    <TableContainer sx={{ minWidth: 720 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Total Price</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {cartList.map((cart) => {
            // const { id, name, size, price, color, cover, quantity, available } = product;
            return (
              <TableRow key={cart._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Image alt="product image" src={cart.imageItem} sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }} />
                    <Box>
                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                        {cart.nameItem}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {/* <Typography variant="body2">
                          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                            size:&nbsp;
                          </Typography>
                          {cart.priceItem}
                        </Typography>
                        <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
                        <Typography variant="body2">
                          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                            color:&nbsp;
                          </Typography>
                          {cart.oldPriceItem}
                        </Typography> */}
                      </Box>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="left">{cart.priceItem}</TableCell>

                <TableCell align="center">
                  {/* <Incrementer
                    quantity={quantity}
                    available={available}
                    onDecrease={() => onDecreaseQuantity(id)}
                    onIncrease={() => onIncreaseQuantity(id)}
                  /> */}
                  {/* <Button>-</Button>
                  {cart.qteItem}
                  <Button>+</Button> */}
                  <QteProduct cart={cart} />

                </TableCell>

                <TableCell align="right">{cart.totalpriceItem}</TableCell>

                <TableCell align="right">
                  <IconButton onClick={() => handleDeleteCart(cart._id)}>
                    <Iconify icon={'eva:trash-2-outline'} width={20} height={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>

  );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrease, onDecrease }) {
  return (
    <Box sx={{ width: 96, textAlign: 'right' }}>
      <IncrementerStyle>
        <IconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Iconify icon={'eva:minus-fill'} width={16} height={16} />
        </IconButton>
        {quantity}
        <IconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
          <Iconify icon={'eva:plus-fill'} width={16} height={16} />
        </IconButton>
      </IncrementerStyle>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        available: {available}
      </Typography>
    </Box>
  );
}


// import PropTypes from 'prop-types';
// // @mui
// import { styled } from '@mui/material/styles';
// import {
//   Box,
//   Table,
//   Divider,
//   TableRow,
//   TableBody,
//   TableCell,
//   TableHead,
//   Typography,
//   IconButton,
//   TableContainer,
// } from '@mui/material';
// // utils
// import getColorName from '../../../../utils/getColorName';
// import { fCurrency } from '../../../../utils/formatNumber';
// // components
// import Image from '../../../../components/Image';
// import Iconify from '../../../../components/Iconify';

// // ----------------------------------------------------------------------

// const IncrementerStyle = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   marginBottom: theme.spacing(0.5),
//   padding: theme.spacing(0.5, 0.75),
//   borderRadius: theme.shape.borderRadius,
//   border: `solid 1px ${theme.palette.grey[500_32]}`,
// }));

// // ----------------------------------------------------------------------

// CheckoutProductList.propTypes = {
//   products: PropTypes.array.isRequired,
//   onDelete: PropTypes.func,
//   onDecreaseQuantity: PropTypes.func,
//   onIncreaseQuantity: PropTypes.func,
// };
// export default function CheckoutProductList({ carts,products, onDelete, onIncreaseQuantity, onDecreaseQuantity }) {
//   // console.log(products);
//   return (
//     <TableContainer sx={{ minWidth: 720 }}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Product</TableCell>
//             <TableCell align="left">Price</TableCell>
//             <TableCell align="left">Quantity</TableCell>
//             <TableCell align="right">Total Price</TableCell>
//             <TableCell align="right" />
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {products.map((product) => {
//             const { id, name, size, price, color, cover, quantity, available } = product;
//             return (
//               <TableRow key={id}>
//                 <TableCell>
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <Image alt="product image" src={cover} sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }} />
//                     <Box>
//                       <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
//                         {name}
//                       </Typography>

//                       <Box
//                         sx={{
//                           display: 'flex',
//                           alignItems: 'center',
//                         }}
//                       >
//                         <Typography variant="body2">
//                           <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
//                             size:&nbsp;
//                           </Typography>
//                           {size}
//                         </Typography>
//                         <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
//                         <Typography variant="body2">
//                           <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
//                             color:&nbsp;
//                           </Typography>
//                           {getColorName(color)}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Box>
//                 </TableCell>

//                 <TableCell align="left">{fCurrency(price)}</TableCell>

//                 <TableCell align="left">
//                   <Incrementer
//                     quantity={quantity}
//                     available={available}
//                     onDecrease={() => onDecreaseQuantity(id)}
//                     onIncrease={() => onIncreaseQuantity(id)}
//                   />
//                 </TableCell>

//                 <TableCell align="right">{fCurrency(price * quantity)}</TableCell>

//                 <TableCell align="right">
//                   <IconButton onClick={() => onDelete(id)}>
//                     <Iconify icon={'eva:trash-2-outline'} width={20} height={20} />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

// // ----------------------------------------------------------------------

// Incrementer.propTypes = {
//   available: PropTypes.number,
//   quantity: PropTypes.number,
//   onIncrease: PropTypes.func,
//   onDecrease: PropTypes.func,
// };

// function Incrementer({ available, quantity, onIncrease, onDecrease }) {
//   return (
//     <Box sx={{ width: 96, textAlign: 'right' }}>
//       <IncrementerStyle>
//         <IconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
//           <Iconify icon={'eva:minus-fill'} width={16} height={16} />
//         </IconButton>
//         {quantity}
//         <IconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
//           <Iconify icon={'eva:plus-fill'} width={16} height={16} />
//         </IconButton>
//       </IncrementerStyle>
//       <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//         available: {available}
//       </Typography>
//     </Box>
//   );
// }