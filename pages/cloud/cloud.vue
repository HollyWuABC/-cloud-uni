<template>
	<view class="navbar">
		<view>
			<uni-nav-bar fixed :status-bar="true">
				<block slot="left"><image class="top-img left" src="../../static/image/cloud/y_03.png"></image></block>
				<view class="top-tab flex-box">
					<view v-for="(item, index) in navList" :class="{active: curNav == index }" :key="index" @click="switchTab(item.id, index)">
						{{item.name}}
					</view>
				</view>
				<!-- #ifdef APP-PLUS || H5 -->
				<block slot="right"><image class="top-img" src="../../static/image/mine/r.png"></image></block>
				<!-- #endif -->
			</uni-nav-bar>
			<view class="page-content">
				<mescroll-uni ref="mescroll" :fixed="false" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback">
					<view class="date-bar flex-box">
						<view class="date-bar-left">
							云村热评墙 <text class="iconfont">&#xe605;</text>
							<swiper class="date-bar-swiper" :autoplay="true" :circular="true" :vertical="true" :duration="500" style="min-width:250px; white-space: normal;">
								<swiper-item v-for="(item, index) in dateMsg.msgList" :key="index">
									<view class="date-bar-left-txt">{{item.name}}</view>
								</swiper-item>
							</swiper>
						</view>
						<view class="date-bar-right">
							<view>{{dateMsg.curDate[1]}}.</view>
							<view class="date-bar-right-num">{{dateMsg.curDate[2]}}</view>
						</view>
					</view>
					<view class="list-content flex-box">
						<view class="video-list flex-box">
							<view class="video-item" v-for="(item, index) in showList.colList1" :key="index">
								<view class="video-wrap">
									<image class="img" :src="item.coverUrl + $imgSuffix" mode="widthFix"></image>
									<view class="video-con">
										<view class="desc">{{item.title}}</view>
										<view class="creater-bar flex-box">
											<view class="avactor-box flex-box">
												<image class="avactor" src=""></image>
												<view class="name">{{item.creator[0].userName}}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="video-list">
							<view class="video-item" v-for="(item, index) in showList.colList2" :key="index">
								<view class="video-wrap">
									<image class="img" :src="item.coverUrl + $imgSuffix" mode="widthFix"></image>
									<view class="video-con">
										<view class="desc">{{item.title}}</view>
										<view class="creater-bar flex-box">
											<view class="avactor-box flex-box">
												<image class="avactor" src=""></image>
												<view class="name">{{item.creator[0].userName}}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
	</view>
</template>

<script>
	import MescrollUni from "../../components/mescroll-uni/mescroll-uni.vue";
	export default {
		data() {
			return {
				navList: [
					{
						name: '广场',
						id: 3452
					},
					{
						name: '动态',
						id: 3462
					}
				],
				curNav: 0,
				dateMsg: {
					msgList: [
						{
							name: '初见是惊鸿一瞥，南柯一梦是你',
							id: ''
						},
						{
							name: '相遇是柳暗花明，如梦初醒是你',
							id: ''
						},
						{
							name: '初见是惊鸿一瞥，南柯一梦是你',
							id: ''
						},
						{
							name: '重逢是始料未及，别来无恙是你',
							id: ''
						}
					],
					curDate: []
				},
				downOption: {
					auto: false // 是否在初始化后，自动执行下拉回调callback； 默认true
				},
				upOption: {
					auto: false, // 是否在初始化后，自动执行下拉回调callback； 默认true
					page: {
						num: 1,
						size:10
					}
				},
				showList: {},
				allList: []
			};
		},
		onLoad() {
			let date = new Date();
			this.dateMsg.curDate = String(date).split(' ');
			this.switchTab(3452, 0);
		},
		methods: {
			switchTab(id, index) {
				this.curNav = index;
				this.getList(1, 10);
			},
			// 获取相关视频
			getList(pageNum, pageSize) {
				uni.request({
					url: 'http://localhost:3000/related/allvideo',
					method:'GET',
					data: {
						id: this.curNav + 1,
						pageNum,
						pageSize
					},
					success: res => {
						this.allList = res.data.data;
						// console.log('this.allList', this.allList);
						this.formList();
						// console.log('showList', this.showList.colList1);
					},
					complete: () => {
						// console.log('加载完成');
					}
				})
			},
			// 格式化列表数据
			formList() {
				let i = 0, colList1 = [], colList2 = [], list = this.allList;
				while(i < list.length) {
					colList1.push(list[i++]);
					if(i < list.length) {
						colList2.push(list[i++]);
					}
				}
				this.showList = {
					colList1,
					colList2
				}
			},
			// 下拉刷新
			downCallback(mescroll) {
				mescroll.resetUpScroll();
			},
			upCallback(mescroll) {
				// console.log(mescroll.num, mescroll.size);
				this.getList(mescroll.num, mescroll.size);
				this.formList();
				mescroll.endSuccess();
			},
			goCloud() {
				uni.showToast({
					icon: 'none',
					title: '功能未开发'
				})
			}
		}
	}
</script>

<style lang="scss">
.top-img {
	width: 50rpx;
	height: 40rpx;

	&.left {
		margin-left: 10rpx;
	}
}
.page-content {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0px;
  /* #ifdef H5 */
  top:44px;  // h5 无状态栏
  /* #endif */
}
.top-tab {
	width: 310rpx;
	/* #ifdef MP-WEIXIN */
	width: 250rpx;
	/* #endif */
	margin: 0 auto;
	justify-content: space-between;
	.active {
		position: relative;
		color: #f32628;
		&:after {
			position: absolute;
			content: '';
			left: 50%;
			width: 94rpx;
			height: 4rpx;
			bottom: 0rpx;
			transform: translateX(-50%);
			background: #f32628;
			border-radius: 4rpx;
		}
	}
}
.date-bar{
	width: 100%;
	height: 160rpx;
	padding: 20rpx 34rpx;
	margin: 20rpx auto;
	border-radius: 14rpx;
	color: #fff;
	background: rgba(0, 0, 0, .7);
	line-height: 70rpx;
	font-weight: 600;
	justify-content: space-between;
	.date-bar-left{
		font-size: 34rpx;
		font-weight: 600;
		.date-bar-left-txt{
			font-size: 28rpx;
			// color: #888;
		}
	}
	.date-bar-right{
		.date-bar-right-num{
			margin-top: -12rpx;
			font-size: 44rpx;
		}
	}
}

.list-content {
	padding-left: 30rpx;
	flex-direction: row; // 主轴方向设置为水平方向
}

.video-list {
	flex-direction: column; // 主轴方向设置为垂直方向
}

.video-item {
	width: 334rpx;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
	border-radius: 14rpx;
	overflow: hidden;
	color: #353536;
	background: #fff;
	line-height: 36rpx;

	.img {
		display: block;
		width: 100%;
		min-height: 188rpx;
	}

	.avactor {
		width: 28rpx;
		height: 28rpx;
		margin-right: 10rpx;
		border-radius: 28rpx;
		background: #ddd;
	}

	.video-con {
		padding: 16rpx 16rpx 30rpx;
	}

	.avactor-box {
		align-items: center;
	}

	.creater-bar {
		margin-top: 10rpx;
		align-items: center;
		color: #999;
		font-size: 20rpx;
	}
}

.date-bar-swiper {
	width: 430rpx;
	height: 40rpx;
	line-height: 40rpx;
	color: #d0d2d3;
	font-size: 24rpx;
}
</style>
