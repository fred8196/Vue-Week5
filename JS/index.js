// 產品列表 V
// 單一產品細節 X
// 加入購物車 V
// 購物車列表 V
// 刪除購物車項目（單一、全部） V
// 調整購物車產品數量 V
// 結帳付款 X

// 注意：
// 新增相同產品到購物車時需累加項目 V
// 送出訂單後，購物車需要清除原本項目 X
// 購物車無產品時不建議發出結帳請求 X
// 前台頁面表單驗證（必要完成），驗證內容包含： X

// 姓名：必填
// Email：必填 / 需要符合格式 / input type 為 email
// 電話：必填 / 超過 8 碼 / input type 為 tel
// 地址：必填
// 留言：非必填
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

VeeValidateI18n.loadLocaleFromURL('../zh_TW.json');
// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
});

import productModal from "./productModal.js";

const app = Vue.createApp({
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io',
            path: 'fred8196',
            productData: [],
            pagination: {},
            loadingStatus: {
                loadingItemId: '',
            },
            cart: {},
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
            isLoading: true
        }
    },
    components: {
        productModal
    },
    methods: {
        getProductData() {
            axios.get(`${this.url}/api/${this.path}/products/all`)
                .then(res => {
                    if (res.data.success) {
                        const { products, pagination } = res.data;
                        this.productData = products;
                        this.pagination = pagination;
                        console.log(this.productData, this.pagination);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        addToCart(itemId, itemTitle, qty = 1) {
            this.loadingStatus.loadingItemId = itemId;
            axios.post(`${this.url}/api/${this.path}/cart`, {
                "data": {
                    "product_id": itemId,
                    "qty": qty
                }
            })
                .then(res => {
                    if (res.data.success) {
                        console.log(res);
                        alert(itemTitle + res.data.message)
                        this.$refs.productModal.hideModal();
                        this.getCartList();
                        this.loadingStatus.loadingItemId = '';
                    } else {
                        alert(res.data.message)
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        getCartList() {
            axios.get(`${this.url}/api/${this.path}/cart`)
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
            axios.delete(`${this.url}/api/${this.path}/carts`)
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
            axios.delete(`${this.url}/api/${this.path}/cart/${itemId}`)
                .then(res => {
                    if (res.data.success) {
                        alert(itemTitle + res.data.message)
                        this.getCartList();
                        this.loadingStatus.loadingItemId = '';
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
            axios.put(`${this.url}/api/${this.path}/cart/${item.id}`, {
                "data": {
                    "product_id": `${item.product.id}`,
                    "qty": item.qty
                }
            })
                .then(res => {
                    if (res.data.success) {
                        alert(res.data.message)
                        this.getCartList();
                        this.loadingStatus.loadingItemId = '';
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
            axios.get(`${this.url}/api/${this.path}/product/${itemId}`)
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
            axios.post(`${this.url}/api/${this.path}/order`, { "data": this.form })
                .then(res => {
                    if (res.data.success) {
                        alert(res.data.message);
                        this.getCartList();
                        this.$refs.form.resetForm();
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