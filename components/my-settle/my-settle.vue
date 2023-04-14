<template>
<!-- 最外层的容器 -->
<view class="my-settle-container">
  <!-- 全选区域 -->
  <label class="radio">
    <radio color="#C00000" :checked="isFullCheck" @click="updateAllGoodsState"/><text>全选</text>
  </label>

  <!-- 合计区域 -->
  <view class="amount-box">
    合计:<text class="amount">￥{{checkedPrice}}</text>
  </view>

  <!-- 结算按钮 -->
  <view class="btn-settle" @click="settlement">结算({{checkedTotal}})</view>
</view>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
		seconds: 3,
		// 定时器的 Id
		timer: null
	}
  },
  computed: {
	  ...mapGetters('cart', ['total', 'checkedTotal', 'checkedPrice']),
	  ...mapGetters('user', ['AddressStr']),
	  ...mapState('user', ['token']),
	  ...mapState('cart', ['cart']),
	  isFullCheck() { // 全选
			return this.total === this.checkedTotal
	  }
  },
  methods: {
	  ...mapMutations('cart', ['updateState']),
	  updateAllGoodsState(){ // 全选或取消
		  this.updateState(!this.isFullCheck)
	  },
	  settlement(){ // 结算商品
		  if(!this.checkedTotal){ // 如果没选中结算商品
			  return uni.$showMsg('请选择一样商品')
		  }
		  if(!this.AddressStr){ // 未选择地址
			  return uni.$showMsg('请选择地址')
		  }
		  if(!this.token){ // 未登陆
		  	  return this.delayNavigate()
		  }
		  // 调用支付接口
		  this.payOrder()
	  },
	  showTips(n){ // 提示函数
		  uni.showToast({
		  	icon:'none',
			title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
		     // 为页面添加透明遮罩，防止点击穿透
			 mask: true,
			// 1.5 秒后自动消失
			 duration: 1500
		  })
	  },
	  delayNavigate(){ // 延迟导航到my界面
		  // 提示
		  this.showTips(this.seconds)
		  // 创建定时器让showtips触发
		 this.timer = setInterval(() => {
			  this.seconds--
			  if(this.seconds <= 0){ // 如果倒计时结束 清除定时器并跳转到登陆界面
				  clearInterval(this.timer) 
				   uni.switchTab({
				          url: '/pages/my/my'
				        })
						return
			  }
			  this.showTips(this.seconds)
		  }, 1000)
	  },
	  async payOrder(){
		  let order = { // 订单信息
			  order_price: 0.01, // 价格写死
			  consignee_addr: this.AddressStr,
			  goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
		  }
		  // 调用创建订单接口
		 let { data: res } = await uni.$http.post('/public/v1/my/orders/create', order)
		 // 1.3 得到服务器响应的“订单编号”
		   const orderNumber = res.message.order_number
		 
		    // 2. 订单预支付
		    // 2.1 发起请求获取订单的支付信息
		    const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
		    // 2.2 预付订单生成失败
		    if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
		    // 2.3 得到订单支付相关的必要参数
		    const payInfo = res2.message.pay
		 
		    // 3. 发起微信支付
		    // 3.1 调用 uni.requestPayment() 发起微信支付
		    const [err, succ] = await uni.requestPayment(payInfo)
		    // 3.2 未完成支付
		    if (err) return uni.$showMsg('订单未支付！')
		    // 3.3 完成了支付，进一步查询支付的结果
		    const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
		    // 3.4 检测到订单未支付
		    if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
		    // 3.5 检测到订单支付完成
		    uni.showToast({
		      title: '支付完成！',
		      icon: 'success'
		    })
	  }
  }
}
</script>

<style lang="scss" scoped>
.my-settle-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  // 将背景色从 cyan 改为 white
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  font-size: 14px;

  .radio {
    display: flex;
    align-items: center;
  }

  .amount {
    color: #c00000;
  }

  .btn-settle {
    height: 50px;
    min-width: 100px;
    background-color: #c00000;
    color: white;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
  }
}
</style>