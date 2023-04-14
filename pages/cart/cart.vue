<template>
	<view class="cart-container" v-if="cart.length !== 0">
	<!-- 地址组件 -->
	<my-address></my-address>
	 <!-- 购物车商品列表的标题区域 -->
	<view class="cart-title">
		 <!-- 左侧的图标 -->
		  <uni-icons type="shop" size="18"></uni-icons>
		  <!-- 描述文本 -->
		  <text class="cart-title-text">购物车</text>
		 
	</view> 
	<!-- 商品列表区域 -->
	<!-- uni-swipe-action 是最外层包裹性质的容器 -->
	<uni-swipe-action>
	      <view v-for="(goods, i) in cart" :key="i">
			   <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 right-options为右滑配置
			   可以使用v—slot指定左右滑动出现的结构
			   <template v-slot:left>
			   			<view><text>置顶</text></view>
			   		</template>
			   -->
			  <uni-swipe-action-item :right-options='options' @click='swipeActionClickHandler(goods)'>
		    <my-good :goods="goods" :show-radio="true" :show-number="true" @radioChange='CartUpdate' @numChange='CartUpdate'></my-good>
		      </uni-swipe-action-item>
		  </view>
	</uni-swipe-action>
   <!-- 结算区域 -->
   <my-settle></my-settle>
	</view>
	<!-- 空白购物车区域 -->
	  <view class="empty-cart" v-else>
	    <image src="@/static/cart_empty@2x.png" class="empty-img"></image>
	    <text class="tip-text">空空如也~</text>
	  </view>
</template>

<script>
import BarBadge from '@/mixins/tabbar-badge.js.js'
import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				   options:[
				     {
				            text: '删除',
				            style: {
				                backgroundColor: '#dd524d'
				            }
				        }
				      ]
			}
		},
		onLoad(){
		},
		mixins: [BarBadge],
		computed: {
			...mapState('cart', ['cart']) // 购物车数量
		},
		methods: {
			...mapMutations('cart', ['updateCart', 'deleteCart']),
            CartUpdate(e){ // 触发更新事件
				this.updateCart(e)
			},
			swipeActionClickHandler(goods){ // 点击了滑动事件后
			    // 删除指定商品
				this.deleteCart(goods.goods_id)
			},
			
		}
	}
</script>

<style lang="scss">
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text {
    margin-left: 10px;
  }
}
.cart-container {
  padding-bottom: 50px;
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;

  .empty-img {
    width: 90px;
    height: 90px;
  }

  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
