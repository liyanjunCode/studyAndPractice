<template>
	<view class="tab-wrapper">
		<block>
			<view class="tab-item">111</view>
		</block>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed: {
			...mapState([
				'tabList'
			])
		},
		mounted() {
			console.log(this.tabList, 2222)
		}
	}
</script>

<style style="scss" scoped>

</style>
