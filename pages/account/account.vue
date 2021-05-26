<template>
	<view>
		<!-- #ifdef APP-PLUS || H5 -->
		<!-- #endif -->
		<uni-nav-bar v-if="!isShowScan" fixed :status-bar="true" @clickLeft="openScan" @clickRight="goCloud">
			<!-- #ifdef APP-PLUS -->
			<block slot="left">
				<image class="top-img left" src="../../static/image/account/a16.png"></image>
			</block>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<block slot="right">
				<image class="top-img right" src="../../static/image/mine/r.png"></image>
			</block>
			<!-- #endif -->
			<view class="title-bar">{{title}}</view>
		</uni-nav-bar>
		<scroll-view scroll-y="true" class="page-content" @scroll="scroll" :scroll-top="scrollTop">
			<view v-if="!(userInfo && userInfo.hasLogin)" class="empty-user">
				<view>登录网易云音乐</view>
				<view>手机电脑多端同步，尽享海量高品质音乐</view>
				 <navigator class="btn" url="../subpages/account/account" hover-class="navigator-hover">
					立即登录
				</navigator>
			</view>
			<template v-if="userInfo && userInfo.hasLogin">
				<view class="userinfo-box flex-box">
					<view class="avator">
						<image
							v-if="userInfo.profile.avatarUrl"
							class="img"
							:src="userInfo.profile.avatarUrl"></image>
						<view v-else class="no-img">上传头像</view>
					</view>
					<view class="flex-item">
						<view class="fl">
							<view class="name">{{userInfo.profile.nickname}}</view>
							<view class="level">Lv.7</view>
						</view>
						<image class="sign fr" src="../../static/image/account/a_03.png"></image>
					</view>
				</view>
				<view class="nav-bar flex-box">
					<view class="flex-item">
						{{userInfo.profile.gender}}
						<view class="txt">动态</view>
					</view>
					<view class="flex-item">
						{{userInfo.profile.follows}}
						<view class="txt">关注</view>
					</view>
					<view class="flex-item">
						{{userInfo.profile.followeds}}
						<view class="txt">粉丝</view>
					</view>
					<view class="flex-item">
						0
						<view class="txt">编辑资料</view>
					</view>
				</view>
			</template>
			<view class="ad-bar" :class="{backgrf: !(userInfo && userInfo.hasLogin)}">
				<image class="img" src="../../static/image/account/a_07.png"></image>
			</view>
			<view class="mall-bar flex-box">
				<view class="flex-item">
					<image class="icon" src="../../static/image/account/a_m1.png"></image>
					消息
				</view>
				<view class="flex-item">
					<image class="icon" src="../../static/image/account/a_m2.png"></image>
					商城
					<view class="txt">现实29包邮</view>
				</view>
				<view class="flex-item">
					<image class="icon" src="../../static/image/account/a_m3.png"></image>
					演出
					<view class="txt">天鹅湖</view>
				</view>
				<view class="flex-item">
					<image class="icon" src="../../static/image/account/a_m4.png"></image>
					个性换肤
				</view>
			</view>
			<uni-list>
				<uni-list-item title="口袋彩铃" thumb="../../static/image/account/a_16.png" size="mini"></uni-list-item>
				<uni-list-item title="我的订单" thumb="../../static/image/account/a_19.png" size="mini" border0></uni-list-item>
				<uni-list-item title="创作者中心" thumb="../../static/image/account/a_09.png" size="mini" class="mt16"></uni-list-item>
				<uni-list-item title="设置" thumb="../../static/image/account/a_21.png" size="mini" class="mt16"></uni-list-item>
				<uni-list-item title="夜间模式" thumb="../../static/image/account/a_23.png" size='mini' :show-switch="true" @switchChange="switchChange"></uni-list-item>
				<uni-list-item title="定时开关" thumb="../../static/image/account/13.png" size="mini"></uni-list-item>
				<uni-list-item title="音乐闹钟" thumb="../../static/image/account/13.png" size="mini"></uni-list-item>
				<uni-list-item title="在线听歌免流量" thumb="../../static/image/account/14.png" size="mini" class="mt16"></uni-list-item>
				<uni-list-item title="优惠券" thumb="../../static/image/account/15.png" size="mini" border0></uni-list-item>
				<uni-list-item title="分享网易云音乐" thumb="../../static/image/account/16.png" size="mini" class="mt16"></uni-list-item>
				<uni-list-item title="关于" thumb="../../static/image/account/17.png" size="mini" border0></uni-list-item>
			</uni-list>
			<view v-if="userInfo && userInfo.hasLogin" class="logout" @click="confirmOut">
				退出登录
			</view>
		</scroll-view>
		<!-- 扫码 -->
		<!-- #ifdef APP-PLUS -->
		<view class="scan-box" :class="{active: isShowScan}">
			<!-- 具有扫码功能的标题 -->
			<uni-nav-bar v-if="isShowScan" fixed :statusBar="true" title="扫一扫" leftIcon="back" @clickLeft="closeScan"></uni-nav-bar>
			<scan ref="scan" @success="renderScan" id="scan" />
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import scan from '../../components/scan/scan.vue';
	export default {
		components: {
			scan
		},
		data() {
			return {
				title: '',
				scrollTop: 0,
				isShowScan: false,
			};
		},
		computed: {
			...mapState(['userInfo']),
			hasLogin() {
				let flag = false;
				if (Object.keys(this.userInfo)) {
					flag = true;
				}
				return flag;
			}
		},
		onLoad() {
			console.log('userInfo1231', this.userInfo);
		},
		methods: {
			...mapMutations(['storeLogout']),
			// 滚动到顶部标题变化
			scroll(e) {
				// console.log('userInfo1231', this.userInfo);
				let scrollTop = e.detail.scrollTop;
				if (scrollTop < 5) {
					this.title = '';
					this.scrollTop = 0;
				} else {
					this.title = '账号';
				}
			},
			// 打开扫码
			openScan() {
				// console.log('this.$refs', this.$refs);
				this.$refs.scan.open();
				this.isShowScan = true;
				// 隐藏底部 tabbar
				uni.hideTabBar({});
			},
			// 点击右侧
			goCloud() {
				uni.showToast({
					icon: 'none',
					title: '功能未开发'
				});
			},
			// 切换夜间模式
			switchChange(e) {
				uni.showToast({
					title: 'change ' + e.value,
					icon: 'none'
				})
			},
			// 退出登录
			confirmOut() {
				uni.showModal({
					title: '网易云音乐',
					content: '确定退出当前账号吗？',
					cancelColor: '#007AFF',
					success: res => {
						if (res.confirm) {
							this.confirmLoginOut();
						} else {
							console.log('取消退出');
						}
					}
				});
			},
			// 退出
			confirmLoginOut() {
				uni.request({
					url: this.$websiteUrl + '/logout',
					method: 'GET',
					data: {},
					success: res => {
						this.storeLogout()
						// 到登录页
						uni.navigateTo({
							url: '/pages/subpages/account/account'
						})
					}
				})
			},
			// 关闭扫码
			closeScan() {
				this.$refs.scan.close();
				this.isShowScan = false;
				uni.showTabBar();
			},
			
			// 打开扫码
			renderScan(val) {
				this.closeScan();
				uni.showToast({
					icon: 'none',
					title:'扫码成功'
				})
			}
		}
	}
</script>

<style lang="scss">
page {
	coloer: #333;
}
.title-bar {
	flex: 1;
	text-align: center;
}
.top-img {
	width: 50rpx;
	height: 40rpx;
	&.left {
		margin-left: 10rpx;
	}
}
.backgrf{
	background: #fff;
}
.mt16 {
	margin-top: 16rpx;
}
.page-content{
	position: fixed;
	top: 64px;
	left: 0;
	right: 0;
	bottom: 0;
	/* #ifdef H5 */
	top: 44px; // h5 无状态栏
	bottom: 100rpx;
	/* #endif */
	background: #f8f8f8;
}
.empty-user {
	background: #fff;
	padding-top: 40rpx;
	text-align: center;
	line-height: 50rpx;
	.btn {
		width: 710rpx;
		height: 80rpx;
		margin: 22rpx auto 0;
		text-align: center;
		line-height: 80rpx;
		border: 2rpx solid #cdcdcd;
		border-radius: 80rpx;
		font-size: 32rpx;
	}
}
.userinfo-box {
	padding-top: 46rpx;
	.avator {
		width: 120rpx;
		height: 120rpx;
		margin: 0 32rpx;
		border-radius: 120rpx;
		color: #fff;
		background: #d6d8da;
		overflow: hidden;
	}
	.img {
		width: 100%;
		height: 100%;
	}
	.name {
		color: #302f30;
		line-height: 68rpx;
		font-weight: 600;
	}
	.sign {
		width: 128rpx;
		height: 52rpx;
		margin-top: 16rpx;
		margin-right: 32rpx;
		border-radius: 52rpx;
	}
	.level {
		width: 100rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		border-radius: 50rpx;
		color: #838080;
		background: #d7d3d4;
		transform: scale(0.8);
	}
}
.nav-bar {
	margin-top: 38rpx;
	text-align: center;
	font-weight: 600;
	.flex-item {
		height: 80rpx;
		border-right: 1rpx solid #cdcacb;
		&:last-child {
			border: 0;
		}
	}
	.txt {
		color: #939293;
		font-weight: 400;
	}
}
.ad-bar {
	padding-top: 32rpx;
	.img {
		display: block;
		width: 686rpx;
		height: 120rpx;
		margin: 0 auto;
	}
}
.mall-bar {
	padding-top: 38rpx;
	padding-bottom: 20rpx;
	text-align: center;
	font-weight: 600;
	font-size: 26rpx;
	background: #fff;
	line-height: 35rpx;
	.icon {
		display: block;
		width: 48rpx;
		height: 48rpx;
		margin: 0 auto 24rpx;
	}
	.txt {
		color: #999;
		font-weight: 400;
		font-size: 24rpx;
		transform: scale(0.84);
	}
}
.line-item {
	.icon {
		float: left;
		width: 35rpx;
		height: 32rpx;
		margin-top: 30rpx;
		margin-right: 36rpx;
	}
}

.logout {
	height: 100rpx;
	margin-top: 16rpx;
	text-align: center;
	line-height: 100rpx;
	color: $color;
	background: #fff;
}
</style>
