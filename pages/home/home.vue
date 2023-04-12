<template>
	<view>
		<!-- 轮播图 -->
	<swiper indicator-dots autoplay>
		<swiper-item v-for="item in swiperList" :key="item.goods_id">
			<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
				<image :src="item.image_src"></image>
			</navigator>
		</swiper-item>
	</swiper>	
	<!-- 分类导航区域 -->
	<view class="nav-list">
	   <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
	     <image :src="item.image_src" class="nav-img"></image>
	   </view>
	</view>
	<!-- 楼层区域 -->
	<view class="floor-list">
	  <!-- 楼层 item 项 -->
	  <view class="floor-item" v-for="(item, i) in floorList" :key="i">
	    <!-- 楼层标题 -->
	    <image :src="item.floor_title.image_src" class="floor-title"></image>
		<view class="floor-img-box">
		  <!-- 左侧大图片的盒子 -->
		  <navigator class="left-img-box" :url="item.product_list[0].url">
		    <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
		  </navigator>
		  <!-- 右侧 4 个小图片的盒子 -->
		  <view class="right-img-box">
		    <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
		      <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
		    </navigator>
		  </view>
		</view>
	  </view>
	</view>
	</view>
</template>

<script>
import BarBadge from '@/mixins/tabbar-badge.js.js'
	export default {
		data() {
			return {
				swiperList:[],
				navList:[],
				floorList: []
			};
		},
		onLoad(){
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		methods:{
			async getSwiperList(){ // 获取轮播图数据
			const { data:res } = await uni.$http.get('/public/v1/home/swiperdata')
			this.swiperList = res.message
			},
			async getNavList(){ // 获取导航栏信息
				const { data:res } = await uni.$http.get('/public/v1/home/catitems')
				this.navList = res.message
			},
			navClickHandler(item){ // 点击导航栏
				if(item.name === '分类'){// tabBar
					 uni.switchTab({ // 跳转到tabBar的分类
					      url: '/pages/cate/cate'
					    })
				} 
			},
			async getFloorList(){ // 获取楼层信息
				const { data:res } = await uni.$http.get('/public/v1/home/floordata')
				  // 通过双层 forEach 循环，处理 URL 地址
				  res.message.forEach(floor => {
				    floor.product_list.forEach(prod => {
				      prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
				    })
				  })
				this.floorList = res.message
			}
		},
		mixins: [BarBadge]
	}
</script>

<style lang="scss">
swiper {
 height: 330rpx;

 .swiper-item,
 image {
   width: 100%;
   height: 100%;
 }
}
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}
.floor-title {
  height: 60rpx;
  width: 100%;
  display: flex;
}
.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}
</style>
