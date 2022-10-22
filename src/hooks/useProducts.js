import {useSelector} from 'react-redux';
import {PRODUCT_MENU_TYPE} from '../constants/order.constant';

function useProducts() {
  let categories = useSelector(s => s.user.categories);
  let categories1 = useSelector(s => s.user.categories1);
  let subCategories = useSelector(s => s.user.subCategories);
  let subCategories1 = useSelector(s => s.user.subCategories1);
  let categoriesSortable = useSelector(s => s.user.categoriesSortable);
  let selectedCategory = useSelector(s => s.user.selectedCategory);
  let selectedCategory1 = useSelector(s => s.user.selectedCategory1);

  let categoriesSortable1 = useSelector(s => s.user.categoriesSortable1);

  let productMenuType = useSelector(s => s.order.productMenuType);
  let isCatering = productMenuType == PRODUCT_MENU_TYPE.catering.id;
  let _subCategories =
    productMenuType == PRODUCT_MENU_TYPE.restuarant.id
      ? subCategories
      : subCategories1;
  let _categories =
    productMenuType == PRODUCT_MENU_TYPE.restuarant.id
      ? categories
      : categories1;
  let _categoriesSortable =
    productMenuType == PRODUCT_MENU_TYPE.restuarant.id
      ? categoriesSortable
      : categoriesSortable1;
  let _selectedCategory =
    productMenuType == PRODUCT_MENU_TYPE.restuarant.id
      ? selectedCategory
      : selectedCategory1;

  return {
    categories: _categories,
    subCategories: _subCategories,
    categoriesSortable: _categoriesSortable,
    isCatering,
    selectedCategory: _selectedCategory,
    productMenuType,
  };
}

export default useProducts;
