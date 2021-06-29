
const url = 'https://vue3-course-api.hexschool.io';
const path = 'fred8196';

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
});

import productModal from "./productModal.js";

const app = Vue.createApp({
    data() {
        return {
            productData: [],
            pagination: {},
            loadingStatus: {
                loadingItemId: '',
            },
            cart: {
                carts: []
            },
            tempProduct: {},
            form: {
                user: {
                    "name": '',
                    "email": '',
                    "tel": '',
                    "address": ''
                },
                message: ''
            },
            isLoading: false
        }
    },
    components: {
        productModal
    },
    methods: {
        getProductData() {
            this.isLoading=true
            axios.get(`${url}/api/${path}/products/all`)
                .then(res => {
                    if (res.data.success) {
                        const { products, pagination } = res.data;
                        this.productData = products;
                        this.pagination = pagination;
                        this.isLoading=false
                        console.log(this.productData, this.pagination);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        addToCart(itemId, itemTitle, qty = 1) {
            this.isLoading=true
            this.loadingStatus.loadingItemId = itemId;
            axios.post(`${url}/api/${path}/cart`, {
                "data": {
                    "product_id": itemId,
                    "qty": qty
                }
            })
                .then(res => {
                    if (res.data.success) {
                        console.log(res);
                        this.$refs.productModal.hideModal();
                        this.getCartList();
                        this.loadingStatus.loadingItemId = '';
                        this.isLoading=false
                        alert(itemTitle + res.data.message)
                    } else {
                        alert(res.data.message)
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        getCartList() {
            this.isLoading=true
            axios.get(`${url}/api/${path}/cart`)
                .then(res => {
                    if (res.data.success) {
                        console.log(res);
                        this.cart = res.data.data;
                        this.isLoading = false;
                        console.log(this.cart);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        deleteAllCarts() {
            axios.delete(`${url}/api/${path}/carts`)
                .then(res => {
                    if (res.data.success) {
                        alert(`${res.data.message}所有購物車品項`)
                        this.getCartList();
                    } else {
                        alert(res.data.message)
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        removeCartItem(itemId, itemTitle) {
            this.loadingStatus.loadingItemId = itemId;
            this.isLoading=true
            axios.delete(`${url}/api/${path}/cart/${itemId}`)
                .then(res => {
                    if (res.data.success) {
                        this.getCartList();
                        this.loadingStatus.loadingItemId = '';
                        this.isLoading=false
                        alert(itemTitle + res.data.message)
                    } else {
                        alert(res.data.message)
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        updateCart(item) {
            this.loadingStatus.loadingItemId = item.id;
            this.isLoading=true
            axios.put(`${url}/api/${path}/cart/${item.id}`, {
                "data": {
                    "product_id": `${item.product.id}`,
                    "qty": item.qty
                }
            })
                .then(res => {
                    if (res.data.success) {
                        this.isLoading=true
                        this.getCartList();
                        this.loadingStatus.loadingItemId = '';
                        this.isLoading=false
                        alert(res.data.message)
                    } else {
                        alert(res.data.message)
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        getModalProduct(itemId) {
            this.loadingStatus.loadingItemId = itemId;
            axios.get(`${url}/api/${path}/product/${itemId}`)
                .then(res => {
                    if (res.data.success) {
                        this.tempProduct = res.data.product;
                        this.$refs.productModal.openModal();
                        this.loadingStatus.loadingItemId = '';
                    } else {
                        alert(res.data.message)
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '請輸入正確電話號碼'
        },
        createOrder() {
            if (this.cart.carts.length === 0) {
                alert('購物車內無品項');
                return;
            }
            this.isLoading=true
            axios.post(`${url}/api/${path}/order`, { "data": this.form })
                .then(res => {
                    if (res.data.success) {
                        this.getCartList();
                        this.$refs.form.resetForm();
                        this.isLoading=false
                        alert(res.data.message);
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    mounted() {
        this.getProductData();
        this.getCartList();
    },
})
app.component('loading', VueLoading)
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');