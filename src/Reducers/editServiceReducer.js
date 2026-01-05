const initstate = {
    editService: {
        name: '',
        terms: '',
        address: '',
        availability: '',
        description: '',
        duration: '',
        category: '',
        status: '',
        seller: '',
        sellerLocation: '',
        coverage: '',
        university: '',
        mobile: '',
        mobile2: '',
        price1: '',
        price2: '',
        price3: '',
        price4: '',
        service1: '',
        service2: '',
        service3: '',
        service4: '',
        
    }
  };
  
  export const editServiceReducer = (state = initstate, action) => {
    switch (action.type) {
        case 'EDIT_GENERAL_SERVICE_DETAILS':
            return {
                ...state,
                editService: action.serviceGeneralDetails
            };
        case 'EDIT_SERVICE_NAME':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    name: action.serviceName
                }
            };
        case 'EDIT_SERVICE_ADDRESS':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    address: action.serviceAddress
                }
            };
        case 'EDIT_SERVICE_TERMS':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    terms: action.serviceTerms
                }
            };
            case 'EDIT_GENERALSERVICE_DETAILS':
                return {
                    ...state,
                    editService: action.serviceDetails
                };
        case 'EDIT_SERVICE_AVAILABILITY':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    availability: action.serviceAvailability
                }
            };
        case 'EDIT_SERVICE_DESCRIPTION':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    description: action.serviceDescription
                }
            };
        case 'EDIT_SERVICE_DURATION':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    duration: action.serviceDuration
                }
            };
        case 'EDIT_SERVICE_CONDITION':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    condition: action.SERVICECondition
                }
            };
        case 'EDIT_SERVICE_STATUS':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    status: action.serviceStatus
                }
            };
        case 'EDIT_SERVICE_CATEGORY':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    category: action.serviceCategory
                }
            };
        case 'EDIT_SERVICE_SELLER':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    seller: action.serviceSeller
                }
            };
        case 'EDIT_SERVICE_SELLERLOCATION':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    sellerLocation: action.serviceSellerLocation
                }
            };
        case 'EDIT_SERVICE_COVERAGE':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    coverage: action.serviceCoverage
                }
            };
        case 'EDIT_SERVICE_UNIVERSITY':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    university: action.serviceUniversity
                }
            };
        case 'EDIT_SERVICE_MOBILE':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    mobile: action.serviceMobile
                }
            };
        case 'EDIT_SERVICE_MOBILE2':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    mobile2: action.serviceMobile2
                }
            };
        case 'EDIT_SERVICE_PRICE1':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    price1: action.servicePrice1
                }
            };
        case 'EDIT_SERVICE_PRICE2':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    price2: action.servicePrice2
                }
            };
        case 'EDIT_SERVICE_PRICE3':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    price3: action.servicePrice3
                }
            };
        case 'EDIT_SERVICE_PRICE4':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    price4: action.servicePrice4
                }
            };
        case 'EDIT_SERVICE_SERVICE1':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    service1: action.serviceService1
                }
            };
        case 'EDIT_SERVICE_SERVICE2':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    service2: action.serviceService2
                }
            };
        case 'EDIT_SERVICE_SERVICE3':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    service3: action.serviceService3
                }
            };
        case 'EDIT_SERVICE_SERVICE4':
            return {
                ...state,
                editService: {
                    ...state.editService,
                    service4: action.serviceService4
                }
            };
        
        
        default:
            return state;
    }
  };
  