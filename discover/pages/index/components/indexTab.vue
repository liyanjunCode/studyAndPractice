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
			wx.cloud.init()
			wx.cloud.callFunction({
				name: 'tabList',
				success: function(res) {
					console.log(res.result, 1112234)
				},
				fail: function() {
					
				}
			})
		}
	}
</script>

<style style="scss" scoped>

</style>
