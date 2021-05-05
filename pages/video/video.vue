<template>
	<view>
		<view class="topbar">
			<view class="g86"></view>
			<!-- 头部tab -->
			<scroll-view class="scroll-view" scroll-x="true" :show-scrollbar="false">
				<view class="rel">
					<view class="item" v-for="(item, index) in navList" :key="index" :class="{active: curNav == item.id}" @click="switchNav(item.id, index)">
						<view class="desc">{{item.name}}</view>
					</view>
					<view class="slide" :style="'width: '+ sliderWidth+'rpx; transform:translateX('+sliderOffset+'rpx)'"></view>
				</view>
			</scroll-view>
		</view>
		<!-- 列表渲染 -->
		<mescroll-uni ref="mescroll" top="86" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" @init="mescrollInit">
			<view class="video-list">
				<view class="video-item" v-for="(item, index) in relatedVideo" :key="index">
					<view class="video-wrap">
						<image class="img" :src="item.coverUrl+$imgSuffix"></image>
						<view class="desc ellipsis">{{item.title}}</view>
						<view class="creater-bar flex-box">
							<view class="avactor-box flex-box">
								<image class="avactor" src=""></image>
								<view class="name">{{item.creator[0].userName}}</view>
							</view>
						</view>
						<view class="more">
							<view class="iconfont">&#xe60f;</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from "../../components/mescroll-uni/mescroll-uni.vue";
	export default {
		mixins: [MescrollMixin],
		components:{
			MescrollUni
		},
		data() {
			return {
				navList: [
					{ name: '推荐', id: 34571},
					{ name: 'LOCK直播', id: 23472},
					{ name: '翻唱', id: 33485},
					{ name: '广场', id: 4652},
					{ name: '舞蹈', id: 658785},
					{ name: '游戏', id: 62689},
					{ name: '现场', id: 7456345}
				],
				curNav: 34571,
				sliderWidth: 60, // 滑块的宽度
				sliderOffset: 16, // 滑块的偏移量
				relatedVideo: [],
				// 下拉刷新的常用配置
				downOption: {
					auto: false // 是否在初始化后,自动执行下拉回调callback; 默认true
				},
				// 上拉加载的常用配置
				upOption: {
					auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
				},
			};
		},
		onLoad() {
			this.getList(1, 10);
		},
		methods:{
			// 切换tab
			switchNav(id, index){
				this.curNav = id;
				this.sliderWidth = index == 1 ? 140 : 60; // 滑块的宽度
				this.sliderOffset = 126 * index + (index > 1 ? 80 : 16) + (index == 0 && 16); // 滑块的偏移量
				this.getList(1, 1);
			},
			// 获取相关视频
			getList(pageNum, pageSize) {
				uni.request({
					url:'http://localhost:3000/related/allvideo',
					method: 'GET',
					data: {
						id: this.curNav,
						pageNum,
						pageSize
					},
					success: res => {
						console.log('视频video', res);
						this.relatedVideo = res.data.data;
					},
					complete: () => {
					}
				})
			},
			mescrollInit() {
			},
			// 下拉刷新的回调
			downCallback(mescroll) {
				mescroll.resetUpScroll(); // c重置列表为第一页（自执行page.num = 1, 再触发upCallBack方法）
			},
			// 上拉刷新的回调 mescroll携带page参数，其中num：当前页从1开始， size：每页数据条数，默认10
			upCallback(mescroll) {
				console.log('mescroll', mescroll);
				console.log('124', mescroll.num, mescroll.size);
				//联网加载数据
				this.getList(mescroll.num, mescroll.size, (res) => {
					//设置列表数据
					if (mescroll.num == 1) this.relatedVideo = []; //如果是第一页需手动置空列表
					this.relatedVideo = this.relatedVideo.concat(res);
					mescroll.endSuccess();
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				});
			}
		}
	}
</script>

<style lang="scss">
.topbar{
	.g86{
		height: 86rpx;
	}
}
.scroll-view {
    position: fixed;
	top: 0;
	width: 100%;
	height: 86rpx;
	white-space: nowrap;
	text-align: center;
	line-height: 86rpx;
	color: #333;
	font-weight: 600;
	border-bottom: 1rpx solid #e6e6e6;
	z-index: 10;
	background: #fff;
    .item {
	  position: relative;
	  display: inline-block;
	  min-width: 126rpx;
	  height: 86rpx;
	  line-height: 86rpx;
	  padding: 0 20rpx;
	  // 触发时候的样式
	  &.active {
		color: #f32628;
	  }
	}
  }
  .slide {
	position: absolute;
	width: 60rpx;
	height: 4rpx;
	left: 0;
	bottom: 0rpx;
	background: #f32628;
	transition: transform 0.3s;
  }
  .video-list {
	color: #333;
	background: #f8f8f8;

	.tit-bar {
		padding-left: 32rpx;
	}

	.video-item {
		padding-top: 32rpx;
		background: #fff;
		border-bottom: 24rpx solid #f8f8f8;
	}

	.video-wrap {
		width: 686rpx;
		margin: 0 auto;
		position: relative;
		.more{
			position: absolute;
			right: 0;
			bottom: 30rpx;
		}
	}

	.img {
		display: block;
		width: 686rpx;
		height: 390rpx;
		border-radius: 10rpx;
		background: #eee;
	}

	.desc {
		font-size: 30rpx;
		font-weight: 600;
		line-height: 84rpx;
		border-bottom: 1rpx solid #e6e6e6;
	}
}

.creater-bar {
	height: 100rpx;
	justify-content: space-between;
	align-items: center;

	.avactor-box {
		align-items: center;
	}

	.avactor {
		width: 66rpx;
		height: 66rpx;
		margin-right: 10rpx;
		border-radius: 66rpx;
		background: #eee;
	}

	.name {
		line-height: 100rpx;
	}
}
</style>
