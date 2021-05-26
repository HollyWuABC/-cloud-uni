<template>
	<view :style="{height: statusHeight }" class="uni-status-bar">
		<slot/>
	</view>
</template>

<script>
	const height = `${uni.getSystemInfoSync().statusBarHeight}px`;
	export default {
		name: 'UniStatusBar',
		data() {
			return {
				statusHeight: height
			}
		},
		methods: {
		}
	}
</script>

<style>
.uni-status-bar{
	width: 750rpx;
	height: 20rpx;
}
</style>
