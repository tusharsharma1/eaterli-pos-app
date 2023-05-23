import {useSelector} from 'react-redux';
import {PRODUCT_MENU_TYPE} from '../constants/order.constant';
import {mergeCategorySortable} from '../helpers/order.helper';

function useProducts() {
  let categories = useSelector(s => s.user.categories);
  let selectedMenuTitle = useSelector(s => s.user.selectedMenuTitle);
  let menuItems = useSelector(s => s.user.menuItems);

  let categoriesSortable = useSelector(s => s.user.categoriesSortable);
  let selectedCategory = useSelector(s => s.user.selectedCategory);
  let selectedCategory1 = useSelector(s => s.user.selectedCategory1);

  let categoriesSortable1 = useSelector(s => s.user.categoriesSortable1);

  let productMenuType = useSelector(s => s.order.productMenuType);
  let isCatering = productMenuType == PRODUCT_MENU_TYPE.catering.id;

  let _categoriesSortable =
    productMenuType == PRODUCT_MENU_TYPE.restuarant.id
      ? categoriesSortable
      : categoriesSortable1;
  let _selectedCategory =
    productMenuType == PRODUCT_MENU_TYPE.restuarant.id
      ? selectedCategory
      : selectedCategory1;

  return {
    categories: categories,
    menuItems: menuItems,
    categoriesSortable: mergeCategorySortable(_categoriesSortable),
    menuTitlesIds: Object.keys(_categoriesSortable),
    isCatering,
    selectedCategory: _selectedCategory,
    productMenuType,
    selectedMenuTitle,
    selectedMenuTitleCategories:_categoriesSortable[selectedMenuTitle]||[]
  };
}

export default useProducts;
