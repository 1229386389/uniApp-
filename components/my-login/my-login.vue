<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 微信开放能力，获取用户信息 -->
    <button type="primary" class="btn-login"  @click="bindGetUserInfo">一键登录</button>
	<button type="primary" class="btn-login" @click="getLocation">获取精确地理位置</button>
	<button type="primary" class="btn-login" @click="getAuthorize">查看所有已经授权的权限</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
import { mapMutations } from 'vuex'
	export default {
		name:"my-login",
		data() {
			return {
				
			}
		},
		methods: {
			...mapMutations('user', ['updateUserInfo', 'updateToken']),
			bindGetUserInfo(e){ // 登陆
				  wx.getUserInfo({success: (res) => {
					  // 将用户的基本信息存储到 vuex 中
				  this.updateUserInfo(res.userInfo)
				
				  // 获取登录成功后的 Token 字符串
				  this.getToken(res)
				  }})
				  
			},
			getLocation(){ // 获取位置
				uni.authorize({ scope: 'scope.userLocation', success: (res) => {
					uni.$showMsg('获取成功')
				}, fail: (e) => {
					uni.$showMsg('获取失败')
				} })
			},
			getAuthorize(){ // 查看所有已经授权的权限
				uni.openSetting({ success: (res) => {
					console.log(res)				} })
			},
		async getToken(info){ // 获取token
			// 调用微信登录接口获取code
			  let [err, res] = await uni.login().catch(err => err)
			  // 判断是否 uni.login() 调用失败
			  if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
			let query = { // token请求参数
				    code: res.code,
				    encryptedData: info.encryptedData,
				    iv: info.iv,
				    rawData: info.rawData,
				    signature: info.signature
			}
			// 接口报错 token写死
			// let { data: loginResult } = await uni.$http.post('/public/v1/users/wxlogin', query) // 获取token
			// 保存到vuex中
			this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o')
			uni.$showMsg('获取token成功')
			}
		}
	}
</script>

<style lang="scss">
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;

  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }

  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }

  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>