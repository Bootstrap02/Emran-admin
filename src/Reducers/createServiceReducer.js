const initstate = {
    createService: {
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
  
  export const createServiceReducer = (state = initstate, action) => {
    switch (action.type) {
        case 'SEND_SERVICE_NAME':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    name: action.serviceName
                }
            };
        case 'SEND_SERVICE_ADDRESS':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    address: action.serviceAddress
                }
            };
        case 'SEND_SERVICE_TERMS':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    terms: action.serviceTerms
                }
            };
        case 'SEND_SERVICE_AVAILABILITY':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    availability: action.serviceAvailability
                }
            };
        case 'SEND_SERVICE_DESCRIPTION':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    description: action.serviceDescription
                }
            };
        case 'SEND_SERVICE_DURATION':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    duration: action.serviceDuration
                }
            };
        case 'SEND_SERVICE_CONDITION':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    condition: action.SERVICECondition
                }
            };
        case 'SEND_SERVICE_STATUS':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    status: action.serviceStatus
                }
            };
        case 'SEND_SERVICE_CATEGORY':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    category: action.serviceCategory
                }
            };
        case 'SEND_SERVICE_SELLER':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    seller: action.serviceSeller
                }
            };
        case 'SEND_SERVICE_SELLERLOCATION':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    sellerLocation: action.serviceSellerLocation
                }
            };
        case 'SEND_SERVICE_COVERAGE':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    coverage: action.serviceCoverage
                }
            };
        case 'SEND_SERVICE_UNIVERSITY':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    university: action.serviceUniversity
                }
            };
        case 'SEND_SERVICE_MOBILE':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    mobile: action.serviceMobile
                }
            };
        case 'SEND_SERVICE_MOBILE2':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    mobile2: action.serviceMobile2
                }
            };
        case 'SEND_SERVICE_PRICE1':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    price1: action.servicePrice1
                }
            };
        case 'SEND_SERVICE_PRICE2':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    price2: action.servicePrice2
                }
            };
        case 'SEND_SERVICE_PRICE3':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    price3: action.servicePrice3
                }
            };
        case 'SEND_SERVICE_PRICE4':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    price4: action.servicePrice4
                }
            };
        case 'SEND_SERVICE_SERVICE1':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    service1: action.serviceService1
                }
            };
        case 'SEND_SERVICE_SERVICE2':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    service2: action.serviceService2
                }
            };
        case 'SEND_SERVICE_SERVICE3':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    service3: action.serviceService3
                }
            };
        case 'SEND_SERVICE_SERVICE4':
            return {
                ...state,
                createService: {
                    ...state.createService,
                    service4: action.serviceService4
                }
            };
        
        
        default:
            return state;
    }
  };
  