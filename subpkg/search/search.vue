<template>
		<view class="search-box">
		  <!-- 使用 uni-ui 提供的搜索组件 -->
		  <uni-search-bar @input="input" :radius="100" cancelButton="none"  ></uni-search-bar>
		  
		  <!-- 搜索建议列表 -->
		  <view class="sugg-list" v-if="searchResults.length !== 0">
		    <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
		      <view class="goods-name">{{item.goods_name}}</view>
		      <uni-icons type="arrowright" size="16"></uni-icons>
		    </view>
		  </view>
		  <!-- 搜索历史  当搜索建议为空时显示历史记录-->
		  <view class="history-box" v-else>
		    <!-- 标题区域 -->
		    <view class="history-title">
		      <text>搜索历史</text>
		      <uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
		    </view>
		    <!-- 列表区域 -->
		    <view class="history-list">
		      <uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
		    </view>
		  </view>
		</view>
</template>

<script>
	export default {
		name:"uni-search-bar",
		data() {
			return {
				timer:null,
				kw:'', // 搜索关键词
			    searchResults: [],// 搜索结果列表
				historyList:[]
			};
		},
		methods:{
			input(e){ // 搜索框输入
				  // 清除 timer 对应的延时器
				  clearTimeout(this.timer)
				  // 重新启动一个延时器，并把 timerId 赋值给 this.timer
				  this.timer = setTimeout(() => {
				    // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
				    this.kw = e
					// 加入搜索历史
					this.saveHistory(this.kw)
					// 查询搜索结果
					this.getSearchList()
				  }, 500)
			},
			// 根据搜索关键词，搜索商品建议列表
			async getSearchList() {
			  // 判断关键词是否为空
			  if (this.kw === '') {
			    this.searchResults = []
			    return
			  }
			  // 发起请求，获取搜索建议列表
			  const { data: res } = await uni.$http.get('/public/v1/goods/qsearch', { query: this.kw })
			  this.searchResults = res.message
			},
			saveHistory(text){ // 保存历史记录
				// 加入历史头部
				this.historyList.unshift(text)
				// 对数组进行去重
				let set = new Set(this.historyList)
				this.historyList = Array.from(set)
				// 存储到本地中
				uni.setStorageSync('historyList', JSON.stringify(this.historyList))
			},
			clearHistory(){ // 清除历史记录
				this.historyList = []
				uni.setStorageSync('historyList', '[]')
			},
            gotoGoodsList(kw) { // 点击跳转到商品列表页面
                uni.navigateTo({
                   url: '/subpkg/goods_list/goods_list?query=' + kw
                       })
              }
			
		},
		onLoad(){
			// 获取历史记录
			this.historyList = JSON.parse(uni.getStorageSync('historyList') || '[]') 
		}
	}
</script>

<style lang="scss">
.uni-search-bar {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  position: relative;
  padding: 16rpx;
  /* 将默认的 #FFFFFF 改为 #C00000 */
  background-color: #c00000;
}
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 5px;

  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
