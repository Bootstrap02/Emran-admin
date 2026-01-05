const initstate = {
  createProduct: {
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

export const createProductReducer = (state = initstate, action) => {
  switch (action.type) {
      case 'SEND_PRODUCT_TITLE':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  title: action.productTitle
              }
          };
      case 'SEND_PRODUCT_LOCATION':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  location: action.productLocation
              }
          };
      case 'SEND_PRODUCT_BRAND':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  brand: action.productBrand
              }
          };
      case 'SEND_PRODUCT_COLOR':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  color: action.productColor
              }
          };
      case 'SEND_PRODUCT_DESCRIPTION':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  description: action.productDescription
              }
          };
      case 'SEND_PRODUCT_DETAILS':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  details: action.productDetails
              }
          };
      case 'SEND_PRODUCT_CONDITION':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  condition: action.productCondition
              }
          };
      case 'SEND_PRODUCT_PERSON':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  person: action.productPerson
              }
          };
      case 'SEND_PRODUCT_CATEGORY':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  category: action.productCategory
              }
          };
      case 'SEND_PRODUCT_SELLER':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  seller: action.productSeller
              }
          };
      case 'SEND_PRODUCT_SELLERLOCATION':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  sellerLocation: action.productSellerLocation
              }
          };
      case 'SEND_PRODUCT_UNIVERSITY':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  university: action.productUniversity
              }
          };
      case 'SEND_PRODUCT_MOBILE':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  mobile: action.productMobile
              }
          };
      case 'SEND_PRODUCT_MOBILE2':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  mobile2: action.productMobile2
              }
          };
      case 'SEND_PRODUCT_PRICE':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  price: action.productPrice
              }
          };
      case 'SEND_PRODUCT_PROMOPRICE':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  promoPrice: action.productPromoPrice
              }
          };
      case 'SEND_PRODUCT_PROMOQUANTITY':
          return {
              ...state,
              createProduct: {
                  ...state.createProduct,
                  promoQuantity: action.productPromoQuantity
              }
          };
      default:
          return state;
  }
};
