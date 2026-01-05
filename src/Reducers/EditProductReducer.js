const initstate = {
    editProduct: {
        title: '',
        brand: '',
        location: '',
        color: '',
        description: '',
        details: '',
        category: '',
        condition: '',
        person: '',
        seller: '',
        sellerLocation: '',
        university: '',
        mobile: '',
        mobile2: '',
        price: '',
        promoPrice: '',
        promoQuantity: '',
    }
  };
  
  export const editProductReducer = (state = initstate, action) => {
    switch (action.type) {
        case 'EDIT_GENERAL_DETAILS':
            return {
                ...state,
                editProduct: action.productDetails
            };
        case 'EDIT_PRODUCT_TITLE':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    title: action.productTitle
                }
            };
        case 'EDIT_PRODUCT_LOCATION':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    location: action.productLocation
                }
            };
        case 'EDIT_PRODUCT_BRAND':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    brand: action.productBrand
                }
            };
        case 'EDIT_PRODUCT_COLOR':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    color: action.productColor
                }
            };
        case 'EDIT_PRODUCT_DESCRIPTION':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    description: action.productDescription
                }
            };
        case 'EDIT_PRODUCT_DETAILS':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    details: action.productDetails
                }
            };
        case 'EDIT_PRODUCT_CONDITION':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    condition: action.productCondition
                }
            };
        case 'EDIT_PRODUCT_PERSON':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    person: action.productPerson
                }
            };
        case 'EDIT_PRODUCT_CATEGORY':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    category: action.productCategory
                }
            };
        case 'EDIT_PRODUCT_SELLER':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    seller: action.productSeller
                }
            };
        case 'EDIT_PRODUCT_SELLERLOCATION':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    sellerLocation: action.productSellerLocation
                }
            };
        case 'EDIT_PRODUCT_UNIVERSITY':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    university: action.productUniversity
                }
            };
        case 'EDIT_PRODUCT_MOBILE':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    mobile: action.productMobile
                }
            };
        case 'EDIT_PRODUCT_MOBILE2':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    mobile2: action.productMobile2
                }
            };
        case 'EDIT_PRODUCT_PRICE':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    price: action.productPrice
                }
            };
        case 'EDIT_PRODUCT_PROMOPRICE':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    promoPrice: action.productPromoPrice
                }
            };
        case 'EDIT_PRODUCT_PROMOQUANTITY':
            return {
                ...state,
                editProduct: {
                    ...state.editProduct,
                    promoQuantity: action.productPromoQuantity
                }
            };
        default:
            return state;
    }
  };
  