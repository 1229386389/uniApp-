<template>
  <view>
    <view class="goods-list">
		<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
			<my-good  :goods="goods"/>
		</view>
      
    </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
				reqParams: { // 请求参数
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				goodsList: [] ,// 商品列表
				total: 0 ,// 总数
				loading : false // 节流阀 
				
			}
		},
		methods: {
			async getGoodsList(callback){ // 获取数据
			    this.loading = true
				let { data: res } = await uni.$http.get('/public/v1/goods/search', this.reqParams)
				this.loading = false
				// 数据请求完调用传入的回调函数
				callback && callback()
				this.total = res.message.total
				this.goodsList = [...this.goodsList, ...res.message.goods]
				
			},
			gotoDetail(goods){
				 uni.navigateTo({
				    url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				  })
			}
		},
		onLoad(options) { // 获取路由参数
		  // 将页面参数转存到 this.reqParams 对象中
		  this.reqParams.query = options.query || ''
		  this.reqParams.cid = options.cid || ''
		  this.getGoodsList()
		},
		onReachBottom(){ // 触底触发事件
		if(this.reqParams.pagesize * this.reqParams.pagenum >= this.total){ // 说明数据到底
			return uni.$showMsg('数据加载到底了')
		}
		if(this.loading){
			return
		}
		// 页码加一并且重新请求
	         this.reqParams.pagenum ++
			this.getGoodsList()
		},
		onPullDownRefresh(){ // 下拉刷星时触发数据
			 this.reqParams.pagenum = 1
			 this.total = 0
			 this.isloading = false
			 this.goodsList = []
			 // 传入参数为停止页面刷新函数
			 this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss" scoped>

</style>
