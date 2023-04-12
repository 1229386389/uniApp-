import { mapGetters } from 'vuex'
export default {
	computed: {
		...mapGetters('cart', ['total'])
	},
	onShow(){
		this.setBadge()
	},
	methods:{
		setBadge(){ // 为购物车图标设置购物车数量
			  // 调用 uni.setTabBarBadge() 方法，为 tabBar 某一项的右上角添加文本。
			  uni.setTabBarBadge({
			  	index: 2, // tabBar的哪一项，从左边算起
				text: this.total + '' // 要为字符
			  })
		}
	},
	watch: {
		total(){ // 购物车数量变化重新渲染
			this.setBadge()
		}
	}
}