<template>
	<view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
		  <swiper-item v-for="(item, i) in goodsInfo.pics" :key="i" @click="preview(i)">
		    <image :src="item.pics_big"></image>
		  </swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
		  <!-- 商品价格 -->
		  <view class="price">￥{{goodsInfo.goods_price}}</view>
		  <!-- 信息主体区域 -->
		  <view class="goods-info-body">
		    <!-- 商品名称 -->
		    <view class="goods-name">{{goodsInfo.goods_name}}</view>
		    <!-- 收藏 -->
		    <view class="favi">
		      <uni-icons type="star" size="18" color="gray"></uni-icons>
		      <text>收藏</text>
		    </view>
		  </view>
		  <!-- 运费 -->
		  <view class="yf">快递：免运费 {{ cart.length }}</view>
		</view>
		<!-- 商品详情信息 -->
		<!-- 通过 rich-text元素将接口返回的商品详情html字符串转换为元素 -->
		<rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
		<!-- 商品导航 -->
		<!-- 商品导航组件 -->
		<view class="goods_nav">
		  <!-- fill 控制右侧按钮的样式 -->
		  <!-- options 左侧按钮的配置项 -->
		  <!-- buttonGroup 右侧按钮的配置项 -->
		  <!-- click 左侧按钮的点击事件处理函数 -->
		  <!-- buttonClick 右侧按钮的点击事件处理函数 -->
		<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick"  />
	    </view>
	</view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
	export default {
		data() {
			return {
				goodsInfo: {},// 商品信息
			    options: [{ // 左侧按钮配置项
                    icon: 'shop',
                 text: '店铺'
                       }, {
                      icon: 'cart',
                text: '购物车',
                 info: 2
                 }],
                buttonGroup: [{ // 右侧按钮组的配置对象
                   text: '加入购物车',
                  backgroundColor: '#ff0000',
                  color: '#fff'
              },
              {
                   text: '立即购买',
                   backgroundColor: '#ffa200',
                 color: '#fff'
                 }
                 ]
            }
		},
		methods: {
			// 映射到methods中
			...mapMutations('cart', ['addToCart']),
			async getGoodsInfo(id){ // 获取商品信息
			let  { data: res } = await uni.$http.get('/public/v1/goods/detail', { goods_id: id })
			// 添加行内样式让图片没有空白 再将webp格式转换为jpg
			res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
			this.goodsInfo = res.message
			},
			preview(index){ // 轮播图预览效果
				uni.previewImage({ // uni ui 的api 调用图片预览功能
					current: index,
					urls: this.goodsInfo.pics.map((item) => { return item.pics_big })
				})
			},
			onClick (e) { // 点击了左侧的按钮
				if(e.content.text === '购物车'){ // 点击了购物车按钮
					uni.switchTab({ // 跳转到购物车界面
					      url: '/pages/cart/cart'
					    })
				}
				  },
			buttonClick (e) { // 点击了右侧的按钮
			      // 2. 组织一个商品的信息对象
			      let goods = {
			         goods_id: this.goodsInfo.goods_id,       // 商品的Id
			         goods_name: this.goodsInfo.goods_name,   // 商品的名称
			         goods_price: this.goodsInfo.goods_price, // 商品的价格
			         goods_count: 1,                           // 商品的数量
			         goods_small_logo: this.goodsInfo.goods_small_logo, // 商品的图片
			         goods_state: true                         // 商品的勾选状态
			      }
				    if(e.content.text === '加入购物车'){
						// 使用vuex中方法加入购物车
						this.addToCart(goods)
						uni.$showMsg('加入成功')
					}
				  }
		},
		onLoad(option){
			// 获取路由商品id然后获取商品信息
			let id = option.goods_id
			this.getGoodsInfo(id)
		},
		computed:{
			// ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
			...mapState('cart', ['cart']),
			...mapGetters('cart', ['total'])
		},
		watch: {
		    // 1. 监听 total 值的变化，通过第一个形参得到变化后的新值
		    total:{ // 监听vuex中total
			handler: function(newVal){
		      // 2. 通过数组的 find() 方法，找到购物车按钮的配置对象
		      const findResult = this.options.find((x) => x.text === '购物车')
		      if (findResult) {
		        // 3. 动态为购物车按钮的 info 属性赋值
		        findResult.info = newVal
		      }
		    },immediate: true}
			}
	}
</script>

<style lang="scss" scoped>
swiper {
  height: 750rpx;

  image {
    width: 100%;
    height: 100%;
  }
}
// 商品信息区域的样式
.goods-info-box {
  padding: 10px;
  padding-right: 0;

  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }

  .goods-info-body {
    display: flex;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
      padding-right: 10px;
    }
    // 收藏区域
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }

  // 运费
  .yf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
}
.goods_nav{
   position: sticky;
   bottom: 0;
   }
</style>
