<template>
	<view>
		<!-- 我的信息组件 按需显示 -->
		<my-info v-if="token"></my-info>
		<!-- 登陆组件 -->
		<my-login v-else></my-login>
		
	</view>
</template>

<script>
import BarBadge from '@/mixins/tabbar-badge.js.js'
import { mapState } from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
		mixins: [BarBadge],
		computed: {
			...mapState('user', ['token'])
		}
	}
</script>

<style lang="scss">

</style>
