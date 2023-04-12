<template>
      <view class="goods-item">
          <!-- 商品左侧图片区域 -->
          <view class="goods-item-left">
			  <!-- uniapp中的radio value属性为标签 动态显示-->
			  <radio :checked='goods.goods_state' color="#C00000" v-if="showRadio" @click="radioChangeHandler"></radio>
            <image :src="goods.goods_small_logo || defaultPic" class="goods-pic" alt = '暂无图片'></image>
          </view>
          <!-- 商品右侧信息区域 -->
          <view class="goods-item-right">
            <!-- 商品标题 -->
            <view class="goods-name">{{goods.goods_name}}</view>
            <view class="goods-info-box">
              <!-- 商品价格 -->
              <view class="goods-price">￥{{goods.goods_price | toFixed}}</view>
			  <uni-number-box :min="1" :value='goods.goods_count' v-if='showNumber' @change='numChangeHandler'></uni-number-box>
            </view>
          </view>
        </view>
</template>

<script>
	export default {
		name:"my-good",
		props:{
		 goods:{
			 type: Object,
			 require: true
		 },
	    showRadio: { // 是否展示单选框
			type: Boolean,
			default: false
		},
		showNumber:{ // 是否显示数字框
			type: Boolean,
			default: false
		}
		},
		data() {
			return {
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			}
		},
		filters: { // 过滤器
			toFixed(num){
				return Number(num).toFixed(2)
			}
		},
		methods: {
			radioChangeHandler(){ // 状态改变
				this.$emit('radio-change', {
					goods_id: this.goods.goods_id,
					goods_state: !this.goods.goods_state
				})
			},
			numChangeHandler(e){ // 数量改变
				this.$emit('num-change', {
					goods_id: this.goods.goods_id,
					goods_count: e
				})
			}
		}
	}
</script>

<style lang="scss">
.goods-item {
	 // 让 goods-item 项占满整个屏幕的宽度
  width: 750rpx;
	  // 设置盒模型为 border-box
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;

  .goods-item-left {
    margin-right: 5px;
   display: flex;
     justify-content: space-between;
     align-items: center;
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }

  .goods-item-right {
    display: flex;
	flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .goods-info-box{
		display: flex;
		justify-content: space-between;
	}
    .goods-name {
      font-size: 13px;
    }

    .goods-price {
      font-size: 16px;
      color: #c00000;
    }
  }
}
</style>