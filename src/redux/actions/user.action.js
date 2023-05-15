import {apiErrorHandler, apiMessageHandler} from '../../helpers/app.helpers';
import userService from '../../services/user.service';
import {actions} from '../reducers/user.reducer';
import appAction from './app.action';
export default {
  ...actions,

  login(data, showProgress = true, showAlert = true) {
    return (dispatch, getState) => {
      showProgress && dispatch(appAction.showProgress());
      return userService
        .login({
          ...data,
          device_token: getState().user.deviceToken,
        })
        .then(res => {
          let returnResult = res;
          if (res && !res.status) {
            showAlert && apiMessageHandler(res);
            returnResult = false;
          }
          if (returnResult) {
            let data = res.data;
            dispatch(actions.set({userData: data}));
          }
          showProgress && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },

  loginWithPin(data, showProgress = true, showAlert = true) {
    return (dispatch, getState) => {
      showProgress && dispatch(appAction.showProgress());
      return userService
        .loginWithPin({
          ...data,
          device_token: getState().user.deviceToken,
        })
        .then(res => {
          let returnResult = res;
          if (res && !res.status) {
            showAlert && apiMessageHandler(res);
            returnResult = false;
          }
          if (returnResult) {
            let data = res.data;
            dispatch(actions.set({userData: data}));
          }
          showProgress && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },
  getMenus(location_id, showProgress = true) {
    return (dispatch, getState) => {
      showProgress && dispatch(appAction.showProgress());
      return userService
        .getMenus(location_id)
        .then(res => {
          let returnResult = res;
          if (res && !res.status) {
            showAlert && apiMessageHandler(res);
            returnResult = false;
          }
          if (returnResult) {
            let {menu_categories, menu_location} = res.data;
            let {
              menu_categories: unlink_menu_categories,
              menu_items: unlink_menu_items,
            } = res.unlink_data;

            let masterMenu = menu_location
              ? menu_location.menu_categories.map(m => {
                  let menu_items = m.menu_items.map(mi => {
                    let unlinkMi = unlink_menu_items.find(um => {
                      return um.parent_item_id == mi.id;
                    });
                    // console.log('o',unlinkMi,mi.id)
                    if (unlinkMi) {
                      return {...mi, ...unlinkMi, master: false};
                    }
                    return {...mi, master: true};
                  });

                  let unlinkM = unlink_menu_categories.find(um => {
                    return um.parent_id == m.id;
                  });

                  if (unlinkM) {
                    return {
                      ...m,
                      ...unlinkM,
                      menu_items: [...menu_items, ...unlinkM.menu_items],
                      master: false,
                    };
                  }
                  return {
                    ...m,
                    menu_items,
                    master: true,
                  };
                })
              : [];

            let totalMenus = [...masterMenu, ...menu_categories].filter(
              m => !m.deleted_at,
            );

            // console.log('totalMenus',totalMenus)

            let subCategories = {};

            let categories = totalMenus.reduce((r, c) => {
              let menu_items = c.menu_items.filter(mi => {
                return !mi.deleted_at;
              });

              let mitem_ob = menu_items.reduce((mr, mi) => {
                return {
                  ...mr,
                  [mi.id]: {
                    ...mi,
                    master: !!mi.pos_item_id,
                    pos: !!mi.pos_item_id,
                  },
                };
              }, {});

              subCategories = {...subCategories, ...mitem_ob};

              return {
                ...r,
                [c.id]: {
                  ...c,
                  menu_items: menu_items.map(m => m.id),
                  master: !!c.pos_category_id,
                  pos: !!c.pos_category_id,
                },
              };
            }, {});

            let categoriesSortable = totalMenus.map(c => {
              return c.id;
            });

            ///////////////////

            let {catering_menu_categories} = res.data;
            let subCategories1 = {};
            let categories1 = catering_menu_categories.reduce((r, c) => {
              let menu_items = c.catering_menu_items;
              let mitem_ob = menu_items.reduce((mr, mi) => {
                return {...mr, [mi.id]: mi};
              }, {});
              subCategories1 = {...subCategories1, ...mitem_ob};
              return {
                ...r,
                [c.id]: {...c, menu_items: menu_items.map(m => m.id)},
              };
            }, {});

            let categoriesSortable1 = catering_menu_categories.map(c => {
              return c.id;
            });

            // let {productMenuType} = getState().theme;

            dispatch(
              actions.set({
                categories,
                categoriesSortable,
                subCategories,
                selectedCategory: categoriesSortable.length
                  ? categoriesSortable[0]
                  : '',
                selectedCategory1: categoriesSortable1.length
                  ? categoriesSortable1[0]
                  : '',

                categories1,
                categoriesSortable1,
                subCategories1,
              }),
            );

            // dispatch(actions.set({userData: data}));
          }
          showProgress && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },
  getVariations(restaurant_id, showLoader = true) {
    return (dispatch, getState) => {
      showLoader && dispatch(appAction.showProgress());
      return userService
        .getVariations(restaurant_id)
        .then(res => {
          let returnResult = res;

          if (res && !res.status) {
            // apiMessageHandler(res.message);
            returnResult = false;
          }
          if (returnResult) {
            let {variations} = res;
            dispatch(
              actions.set({
                options: variations,
              }),
            );
          }
          showLoader && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },
  getBusinessData(restaurant_id, showLoader = true) {
    return (dispatch, getState) => {
      showLoader && dispatch(appAction.showProgress());
      return userService
        .getBusinessData(restaurant_id)
        .then(res => {
          let returnResult = res;

          if (res && !res.status) {
            // apiMessageHandler(res.message);
            returnResult = false;
          }
          if (returnResult) {
            let {
              locations,
              variations,
              payment_setup,
              pos_type,
              pos_access,
              identity_id,
              merchant_information,
              payment_information,
              onboarding_state,
              verification,
              name,
              delivery_type,

              step,
              domain,
              custom_domain,
              offer_delivery,
              offer_pickup,
              closed,
            } = res.data;
            dispatch(
              actions.set({
                options: variations,
              }),
            );
          }
          showLoader && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },
  getAddons(location_id, category_id, showLoader = true) {
    return (dispatch, getState) => {
      showLoader && dispatch(appAction.showProgress());
      return userService
        .getAddons(location_id, category_id)
        .then(res => {
          let returnResult = res;

          if (res && !res.status) {
            // apiMessageHandler(res.message);
            returnResult = false;
          }
          if (returnResult) {
            let data = res.data;
            dispatch(
              actions.set({
                addonProducts: data,
                addonProductsById: data.reduce((r, d) => {
                  return {...r, [d.id]: d};
                }, {}),
              }),
            );
          }
          showLoader && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },
  getMobileBuilder(res_id, showProgress = true) {
    return (dispatch, getState) => {
      showProgress && dispatch(appAction.showProgress());
      return userService
        .getMobileBuilder(res_id)
        .then(res => {
          let returnResult = res;
          if (res && !res.status) {
            showAlert && apiMessageHandler(res);
            returnResult = false;
          }
          if (returnResult) {
            if (res.data) {
              dispatch(
                actions.set({
                  mobileBuilder: {
                    ...res.data,
                    layout: JSON.parse(res.data.layout),
                  },
                }),
              );
            }
          }
          showProgress && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },
};
