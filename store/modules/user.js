export default {
	namespaced: true,
	 // 模块的 state 数据
	  state: () => ({
	    address: JSON.parse(uni.getStorageSync('address') || '{}'),
		token: uni.getStorageSync('token') || '',
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}')
	  }),
	  // 模块的 mutations 方法
	  mutations: {
		  updateAddress(state, address){ // 更新地址
			  state.address = address
			  this.commit('user/saveToLocal', 'address')
		  },
		  updateUserInfo(state, userInfo){ // 保存用户信息
			  state.userInfo = userInfo
			  this.commit('user/saveToLocal', 'userInfo')
		  },
		  updateToken(state, token){
			  state.token = token
			  this.commit('user/saveToLocal', 'token')
		  },
		  saveToLocal(state, title){ // 本地化存储地址
		       if(typeof state[title] === 'object'){ // 对象就转换成json格式存储
				   uni.setStorageSync(title, JSON.stringify(state[title]))
			   } else {
				   uni.setStorageSync(title, state[title])
			   }
			   
		  }
	  },
	  // 模块的 getters 属性
	  getters: {
		  AddressStr(state){ // 收货地址拼接
		  	// 如果没有收货地址一级地址返回空字符
		  	if(!state.address.provinceName) return ''
		  	 // 拼接 省，市，区，详细地址 的字符串并返回给用户
		  	    return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		  }
	  },
}