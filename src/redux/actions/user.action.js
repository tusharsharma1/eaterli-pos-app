import {PRODUCT_MENU_TYPE} from '../../constants/order.constant';
import {apiErrorHandler, apiMessageHandler} from '../../helpers/app.helpers';
import userService from '../../services/user.service';
import {actions} from '../reducers/user.reducer';
import appAction from './app.action';
import _ from 'lodash';
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

            totalMenus = _.uniqBy(totalMenus, 'id');

            console.log('totalMenus', totalMenus);

            let menuItems = {};

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

              menuItems = {...menuItems, ...mitem_ob};

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
            let titles = totalMenus.reduce((a, b) => {
              let titles = b.menu_titles || [];
              // console.log("totalMenus menu_titles", b);

              let valid = b.type == PRODUCT_MENU_TYPE.restuarant.id;
              // if (type == -1) {
              //   valid = true;
              // }
              let title_ids = titles
                .filter(t => !a.includes(t.id))
                .map(t => t.id);
              if (valid) {
                return [...a, ...title_ids];
              }
              // if (valid && title && !a.includes(title.id)) {
              //   return [...a, title.id];
              // }

              return a;
            }, []);
            console.log('totalMenus title', titles);
            // console.log("totalMenus", menuItems, categories, titles);

            let categoriesSortable = titles.reduce((m, t_id) => {
              let fc = totalMenus
                .filter(o => {
                  let valid = o.type == PRODUCT_MENU_TYPE.restuarant.id;
                  // if (type == -1) {
                  //   valid = true;
                  // }
                  // console.log()

                  let menu_titles = o.menu_titles || [];
                  // valid &&
                  //   console.log(
                  //     "totalMenus - ",
                  //     t_id,
                  //     valid,
                  //     o.id,
                  //     menu_titles.map((d) => d.id),
                  //     menu_titles.map((d) => d.id).includes(t_id)
                  //   );
                  return valid && menu_titles.map(d => d.id).includes(t_id); //o.menu_titles?.[0]?.id == t_id;
                })
                .map(c1 => c1.id);
              // console.log("totalMenus fc", fc);

              return {...m, [t_id]: fc};
            }, {});
            // console.log('totalMenus categoriesSortable', categoriesSortable);
            ///////////////////
            let titles1 = totalMenus.reduce((a, b) => {
              let title = b.menu_titles?.[0];
              let valid = b.type == PRODUCT_MENU_TYPE.catering.id;

              if (valid && title && !a.includes(title.id)) {
                return [...a, title.id];
              }
              return a;
            }, []);
            // console.log("totalMenus", totalMenus, categories, titles);

            let categoriesSortable1 = titles1.reduce((m, t_id) => {
              let fc = totalMenus
                .filter(o => {
                  let valid = o.type == PRODUCT_MENU_TYPE.catering.id;

                  return valid && o.menu_titles?.[0]?.id == t_id;
                })
                .map(c1 => c1.id);
              // console.log("totalMenus fc", fc);

              return {...m, [t_id]: fc};
            }, {});

            dispatch(
              actions.set({
                categories,
                categoriesSortable,
                menuItems,
                categoriesSortable1,
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

  getMenuTitle(restaurant_id, showLoader = true) {
    return (dispatch, getState) => {
      showLoader && dispatch(appAction.showProgress());
      return userService
        .getMenuTitle(restaurant_id)
        .then(res => {
          let returnResult = res;

          if (res && !res.status) {
            // apiMessageHandler(res.message);
            returnResult = false;
          }
          if (returnResult) {
            dispatch(
              actions.set({
                menuTitles: res.data,
              }),
            );
          }
          showLoader && dispatch(appAction.hideProgress());
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
  createOrder(data, showProgress = true) {
    return (dispatch, getState) => {
      showProgress && dispatch(appAction.showProgress());
      return userService
        .createOrder(data)
        .then(res => {
          let returnResult = res;
          if (res && !res.status) {
            showAlert && apiMessageHandler(res);
            returnResult = false;
          }
          if (returnResult) {
          }
          showProgress && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },
  getOrders(restaurant_location_id, showLoader = true) {
    return (dispatch, getState) => {
      showLoader && dispatch(appAction.showProgress());
      return userService
        .getOrders(restaurant_location_id)
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
                orders: data,
              }),
            );
          }
          showLoader && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },

  updateSubCategory(
    data,
    id,
    config = { isformData: false, method: "PATCH", showLoader: false }
  ) {
    let { showLoader = false, isformData = false, method = "PATCH" } = config;
 
    return (dispatch, getState) => {
      showLoader && dispatch(appAction.showProgress());
      return userService
      .updateSubCategory(data, id, { isformData, method })
        .then(res => {
          let returnResult = res;
          if (res && !res.status) {
            showAlert && apiMessageHandler(res);
            returnResult = false;
          }
          if (returnResult) {
          }
          showLoader && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },
};
