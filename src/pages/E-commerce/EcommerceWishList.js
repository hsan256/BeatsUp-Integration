// import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  MenuItem,
  Button,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getWishlists, deleteWishlist } from '../../redux/actions/E-commerceActions/wishlistActions';
// utils
import { fDate } from '../../utils/formatTime';

// import { fCurrency } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Image from '../../components/Image';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import EmptyContent from '../../components/EmptyContent'
// sections
import {
  ProductMoreMenu,
  ProductListHead,
  WishListHead,
  ProductListToolbar,
} from '../../sections/@dashboard/e-commerce/product-list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Product', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'Stock', label: 'Stock', alignRight: false },
  { id: 'cart', label: '', alignRight: false },
  
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceProductList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [wishlistList, setWishlistList] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

  const handleDeleteWishlist = (wishlistId) => {
    const deleteWishliist = wishlistList.filter((wishlist) => wishlist._id !== wishlistId);
    dispatch(deleteWishlist(wishlistId));
    setSelected([]);
    setWishlistList(deleteWishliist);
  };

  const riguel =(wishlist)=>{ 
    if (wishlist.idUser === user.result._id)
    setWishlistList([...wishlistList, wishlist])
  }

  useEffect(() => {
    getWishlists(dispatch);
  }, [dispatch]);
  const wishlists = useSelector((state) => state.wishlists);
  console.log(wishlists);

  useEffect(() => {
    if (wishlists.length) {
      setWishlistList(wishlists);
    }
  }, [wishlists]);
 
  // console.log(user.result._id);
  // console.log(wishlists.idUser);

   useEffect(() => {
    const newWish = wishlists.filter((wishlist) =>
    
      (wishlist.idUser === user.result._id)
    //   {
    //  return (wishlist);
    //   }
    //   return ;

    // riguel(wishlist)
    )
    setWishlistList(newWish)
      // console.log("new");
      // console.log(newWish);
   }, [wishlists]);

  console.log("f jdiid");
  console.log(wishlistList);



  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = wishlistList.map((n) => n._id);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (id) => {
  //   const selectedIndex = selected.indexOf(id);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, id);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
  //   }
  //   setSelected(newSelected);
  // };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

    const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
  };

  // const handleDeleteProduct = (produitId) => {
  //   const deleteProduiit = wishlistList.filter((produit) => produit._id !== produitId);
  //   // dispatch(deleteProduit(produitId));
  //   setSelected([]);
  //   setProduitList(deleteProduiit);
  // };

  // const handleDeleteProducts = (selected) => {
  //   const deleteProduits = produitList.filter((produit) => !selected.includes(produit._id));
  //   selected.map((produitId) => dispatch(deleteProduit(produitId)));
  //   setSelected([]);
  //   setProduitList(deleteProduits);
  //   // window.location.reload();
  // };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - wishlistList.length) : 0;
  const filteredProduits = applySortFilter(wishlistList, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredProduits.length && Boolean(filterName);

  return (
    <Page title="Ecommerce: WishList">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="WishList"
          links={[
            // { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'WishList' },
            { name: user.result.username }
          ]}
        />
{wishlistList.length !==0 ? (
        <Card>
          {/* <ProductListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            // onDeleteProducts={() => handleDeleteProducts(selected)}
          /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <WishListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={wishlists.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {filteredProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((wishlist) => {
                    const isItemSelected = selected.indexOf(wishlist._id) !== -1;
                    
                    return (
                     
                      <TableRow
                        hover
                        key={wishlist._id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </TableCell> */}
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Image
                            disabledEffect
                            alt={wishlist.nameProduit}
                            src={wishlist.imageProduit}
                            sx={{ borderRadius: 1.5, width: 64, height: 64, mr: 2 }}
                          />
                        </TableCell>
                        <TableCell align="left">{(wishlist.nameProduit)}</TableCell>
                        <TableCell align="left">{(wishlist.priceProduit)} DT</TableCell>
                        <TableCell align="left">{wishlist.countInStockProduit === 0 ? 'out of Stock' : 'in Stock'}</TableCell>
                        {
                        wishlist.countInStockProduit===0?
                        <TableCell align="left"><Button disabled >Add To Cart</Button></TableCell>
                          :
                        <TableCell align="left"><Button >Add To Cart</Button></TableCell>
                        }
                        <TableCell align="right">
                          {/* <ProductMoreMenu
                            productName={wishlist.nameProduit}
                            id={wishlist._id}
                            // onDelete={() => handleDeleteProduct(produit._id)}
                            produit={produit}
                          /> */}
                        <MenuItem onClick={() => handleDeleteWishlist(wishlist._id)}sx={{ color: 'error.main' }}>
                        <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} /></MenuItem>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={wishlistList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        ):(
          <EmptyContent

              img= "https://2.bp.blogspot.com/-QfSOClZc8r0/XNr6srFlzjI/AAAAAAAAGlA/lzs505eFFiEdyAytzKkMabdUTihKywcqwCLcBGAs/s1600/EXAM360%2B-%2BNo%2BWishlist.png"
            />
        )
        }
        <Button
          color="inherit"
          component={RouterLink}
          to={PATH_DASHBOARD.eCommerce.root}
          startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
        >
          Continue Shopping
        </Button>        
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return array.filter((_product) => _product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}