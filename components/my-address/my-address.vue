<template>
	<view>
	  <!-- 选择收货地址的盒子 -->
	  <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
	    <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
	  </view>
	
	  <!-- 渲染收货信息的盒子 -->
	  <view class="address-info-box" v-else @click="chooseAddress()">
	    <view class="row1">
	      <view class="row1-left">
	        <view class="username">收货人：<text>{{address.userName}}</text></view>
	      </view>
	      <view class="row1-right">
	        <view class="phone">电话：<text>{{ address.telNumber }}</text></view>
	        <uni-icons type="arrowright" size="16"></uni-icons>
	      </view>
	    </view>
	    <view class="row2">
	      <view class="row2-left">收货地址：</view>
	      <view class="row2-right">{{AddressStr}} </view>
	    </view>
	  </view>
	
	  <!-- 底部的边框线 -->
	  <image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
	export default {
		name:"my-address",
		data() {
			return {
				 // 收货地址
			   // address: {}
			}
		},
		methods: {
		...mapMutations('user', ['updateAddress']),
		async chooseAddress(){ // 选择地址
			 // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
			    //    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
				// 使用需要在配置文件中配置
				let [ err, success ] = await uni.chooseAddress()
				 // 2. 用户成功的选择了收货地址
				if (err === null && success.errMsg === 'chooseAddress:ok') {
				      // 为 data 里面的收货地址对象赋值
				     // this.address = success
					  this.updateAddress(success)
				    }
				// 3. 用户没有授权
				  if (err) {
					 if(err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response'){
						   this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
					  }
				   
				  }
			}
		},
		computed: {
			...mapState('user', ['address']),
			...mapGetters('user', ['AddressStr'])
		}
	}
</script>

<style lang="scss" scoped>
// 底部边框线的样式
.address-border {
  display: block;
  width: 100%;
  height: 5px;
}

// 选择收货地址的盒子
.address-choose-box {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 渲染收货信息的盒子
.address-info-box {
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;

  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }

  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }
}
</style>