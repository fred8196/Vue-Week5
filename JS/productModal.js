export default {
    props: ["product"],
    template: '#itemProductModal',
    data() {
        return {
            modalProduct: {},
            modal: '',
            qty: 1
        };
    },
    watch: {
        product() {
            this.modalProduct = this.product;
        }
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.productModal, {
            keyboard: false,
            backdrop: 'static'
        });
    },
    methods: {
        openModal() {
            this.modal.show();
        },
        hideModal() {
            this.modal.hide();
        },
    },
}