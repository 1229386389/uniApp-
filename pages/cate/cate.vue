<template> 
  <view>
	  <view class="search-box">
	  <!-- 搜索组件 -->
	  <my-search @click = 'gotoSearch'></my-search>
	  </view>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <view :class="['left-scroll-view-item', index === currIndex ? 'active' : '']" v-for="(item, index) in ScrollList" :key="index" @click="changeCurr(index)">{{item.cat_name}}</view>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
		  <!-- 二级分类 -->
           <view class="cate-lv2" v-for="(item2, i2) in ScrollList2" :key="i2">
                 <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
				 <view class="cate-lv3-list">
				       <!-- 三级分类 Item 项 -->
				       <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
				         <!-- 图片 -->
				         <image :src="item3.cat_icon"></image>
				         <!-- 文本 -->
				         <text>{{item3.cat_name}}</text>
				       </view>
				     </view>
           </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import BarBadge from '@/mixins/tabbar-badge.js.js'
  export default {
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0,
		ScrollList:[], // 一级列表
		currIndex:0,
		ScrollList2: [], // 二级列表
		scrollTop: 0 // 右边的头部位置即点击后回到顶部
      };
    },
    onLoad() {
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      // 为 wh 窗口可用高度动态赋值
      this.wh = sysInfo.windowHeight - 50
	  // 获取数据
	  this.getScrollList()
    },
	methods:{
	async getScrollList(){ // 获取数据
			const { data:res } = await uni.$http.get('/public/v1/categories')
			this.ScrollList = res.message
			this.ScrollList2 = res.message[0].children
		},
		changeCurr(index){
			this.currIndex = index // 点击后切换二级列表
			this.ScrollList2 = this.ScrollList[index].children 
			this.scrollTop = this.scrollTop ? 0 : 1 // 点击后复原至头部
		},
		// 点击三级分类项跳转到商品列表页面
		gotoGoodsList(item3) {
		  uni.navigateTo({
		    url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
		  })
		},
		gotoSearch(){
			uni.navigateTo({
				url: '/subpkg/search/search'
			})
		}
	},
	mixins: [BarBadge]
  }
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;

  .left-scroll-view {
    width: 120px;

    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;

      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;
  
    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
  
      image {
        width: 60px;
        height: 60px;
      }
  
      text {
        font-size: 12px;
      }
    }
  }
}
.search-box{
	top: 0;
	z-index: 999;
	// 需要父级overflow：visible（这是默认值），当这个值是hidden或其他值的时候
	position: sticky; // 粘性布局 这个属性的表现有点像position:relative;和position:absolute;的结合体，设置了该属性的盒子首先会根据正常流计算其在文档中的位置，一旦达到了你设置的某个阀值，就会相对他的 containing block（最近的块级祖先元素）来定位(这时候表象的就像 absolute一样)。而这里设置的阈值一般都是top, bottom, left, right 其中之一
}
</style>
