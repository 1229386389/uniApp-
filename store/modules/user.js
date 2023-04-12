export default {
	namespaced: true,
	 // 模块的 state 数据
	  state: () => ({
	    address: JSON.parse(uni.getStorageSync('address') || '{}')
	  }),
	  // 模块的 mutations 方法
	  mutations: {
		  updateAddress(state, address){ // 更新地址
			  state.address = address
			  this.commit('user/saveToStorage')
		  },
		  saveToStorage(state){ // 本地化存储
			   uni.setStorageSync('address', JSON.stringify(state.address))
		  },
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