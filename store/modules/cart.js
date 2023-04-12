export default {
	namespaced: true,
	 // 模块的 state 数据
	  state: () => ({
	    // 购物车的数组，用来存储购物车中每个商品的信息对象
	    // 每个商品的信息对象，都包含如下 6 个属性：
	    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
	    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
	  }),
	  // 模块的 mutations 方法
	  mutations: {
		  addToCart(state, goods){ // 添加购物车
			  // 在购物车中寻找 find返回第一个寻找到的元素
			 let findResult = state.cart.find((item) => item.goods_id === goods.goods_id)
			 if(findResult){ // 购物车中有则数量加一
				 findResult.goods_count++
			 }else{ // 没有则加入购物车
				 state.cart.push(goods)
			 }
			 this.commit('cart/saveToStorage')
		  },
		  saveToStorage(state){ // 持久化存储cart
			  uni.setStorageSync('cart', JSON.stringify(state.cart))
		  },
		  updateCart(state, goods){ // 更新状态
			 let findResult = state.cart.find((item) => item.goods_id === goods.goods_id)
			 if(findResult){
				 for(let key in goods){
					 if(key === 'id'){ // id不做修改
						 return
					 }
					 findResult[key] = goods[key]
				 }
				 this.commit('cart/saveToStorage')
			 }
		  },
		  deleteCart(state, id){ // 删除购物车
			  let index = state.cart.findIndex((item) => item.goods_id === id)
			  if(index !== -1){
				   state.cart.splice(index, 1)
			  }
			  this.commit('cart/saveToStorage')
		  },
		  updateState(state, newVal){ // 更新全部商品状态 (全选)
			  state.cart.forEach((item) => {
				  item.goods_state = newVal
			  })
			  this.commit('cart/saveToStorage')
		  }
	  },
	  // 模块的 getters 属性
	  getters: {
		  total(state){ // 购物车中总数量
		      let total = 0
			  if(state.cart.length !== 0){
				  total = state.cart.reduce((p, item) => {
				  return p + item.goods_count
			  }, 0)  
			  }
			  return total
			  
		  },
		  checkedTotal(state){ // 选中数量
			  let total = 0
			  state.cart.forEach((item) => {
				  if(item.goods_state){
					 return total = total + item.goods_count
				  }
			  })
			  return total
		  },
		  checkedPrice(state){ // 选中总价格
			  let total = 0
			  state.cart.forEach((item) => {
			  	  if(item.goods_state){
			  	  return total = total + item.goods_count*item.goods_price
			  				  }
			  })
			  return total.toFixed(2)
		  }
	  },
}