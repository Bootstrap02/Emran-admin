import { combineReducers } from 'redux';
import {categoryReducer} from './categoryReducer';
import {activePageReducer} from './activePageReducer';
import {productsDropdownReducer} from './productsDropdownReducer'
import {editServiceReducer} from './editServiceReducer'
import {productToggleReducer} from './productToggleReducer';
import {editProductToggleReducer} from './editProductToggleReducer';
import {newProductReducer} from './newProductReducer';
import {searchKeywordReducer} from './searchKeywordReducer';
import {searchInputsReducer} from './searchInputsReducer';
import {universityReducer} from './universityReducer';
import {editProductReducer} from './EditProductReducer';
import {createProductReducer} from './createProductReducer';
import {createServiceReducer} from './createServiceReducer';
import {conversationIdReducer} from './conversationIdReducer';
const rootReducer = combineReducers({
    category: categoryReducer,
    activePage: activePageReducer,
    productDropdown: productsDropdownReducer,
    editService: editServiceReducer,
    editProductToggle: editProductToggleReducer,
    productToggle: productToggleReducer,
    newProduct: newProductReducer,
    editProduct: editProductReducer,
    createProduct: createProductReducer,
    createService: createServiceReducer,
    conversationId: conversationIdReducer,
    searchKeyword: searchKeywordReducer,
    searchInputs: searchInputsReducer,
    university: universityReducer,
});

export default rootReducer