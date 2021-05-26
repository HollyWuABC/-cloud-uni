<template>
	<view class="search-page" v-if="isShow">
		<!-- 头部 -->
		<uni-nav-bar fixed :isShowLeft="false" :status-bar="true" @clickLeft="goCloud" @clickRight="goCloud">
			<view class="search-box flex-box">
				<view class="top-search flex-box flex-item">
					<image class="search-icon" src="../static/image/search/2.png"></image>
					<input
						class="flex-item search-input"
						:focus="isFoucs"
						type="text"
						v-model="searchTxt"
						confirm-type="search"
						@confirm="addSearch"
						@input="inputSearch"/>
				</view>
				<view class="cancle" @click="close">取消</view>
			</view>
			<!-- #ifdef APP-PLUS || H5 -->
			<block slot="right">
				<image class="top-img" src="../static/image/search/1.png"></image>
			</block>
			<!-- #endif -->
		</uni-nav-bar>
		<!-- 滚动区域 -->
		<scroll-view class="page-content">
			<view v-if="searchTxt === ''">
				<view class="banner-img">
					<image class="banner-img-main" src="../static/image/search/s_03.png"></image>
				</view>
				<view class="history-wrapper" v-if="historyList.length > 0">
					<view class="history-wrapper-fri clearfix">
						<h4 class="history-title fl">搜索历史</h4>
						<view class="history-clear fr" @click="clearSearch">
							<image class="history-clear-img" src="../static/image/search/3.png"></image>
						</view>
					</view>
					<view class="history-wrapper-sec">
						<view class="history-list flex-box">
							<view class="history-list-item" v-for="(item, index) in historyList" :key="index">{{item}}</view>
						</view>
					</view>
				</view>
				<view class="hot-search-wrapper">
					<view class="hot-search-title">
						<h4>热搜榜</h4>
					</view>
					<view class="hot-search-list">
						<view
							class="hot-search-list-item"
							v-for="(item, index) in hotSearchList"
							:key="index">
							<h4 class="serial-number">{{ index + 1 }}</h4>
							<view class="hot-search-content">
								<view class="hot-content-title">
									<view class="hot-content-fri">
										<h4>{{item.title}}</h4>
										<span>{{item.num}}</span>
										<image class="hot-content-image" v-if="item.isHot" src="../static/image/search/4.png"></image>
									</view>
									<span class="hot-content-sec">{{item.subTitle}}</span>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="search-main">
				搜索 “{{searchTxt}}”
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import UniNavBar from '../components/uni-nav-bar/uni-nav-bar.vue';
	export default {
		name:"search",
		components: {
			UniNavBar
		},
		data() {
			return {
				isShow: false,
				isFoucs: true,
				searchTxt: '',
				searchlist: [],
				historyList: ['消愁', '千里之外', '我和我的祖国'], // 历史搜索
				hotSearchList: [
					{
						title: '用尽我的一切奔向你',
						subTitle: '是不是孤单过 才学会长大',
						num: '1873318',
						isHot: false,
						isRise: true
					},
					{
						title: '四季予你',
						subTitle: '送你三月的风，六月的雨，九月的风景',
						num: '1750027',
						isHot: true,
						isRise: false
					},
					{
						title: '蔡文静 红黑',
						subTitle: '阳光之下，挣脱黑暗',
						num: '1413839',
						isHot: true,
						isRise: false
					},
					{
						title: '爱人错过',
						subTitle: '我确定几百年前就说过爱你',
						num: '1170342',
						isHot: true,
						isRise: false
					},
					{
						title: '踏山河',
						subTitle: '万里山河都踏过，天下又入谁手',
						num: '1170342',
						isHot: true,
						isRise: false
					},
					{
						title: '薛之谦',
						subTitle: '薛之谦同名曲',
						num: '1170342',
						isHot: false,
						isRise: false
					},
					{
						title: '踏山河',
						subTitle: '万里山河都踏过，天下又入谁手',
						num: '1170342',
						isHot: true,
						isRise: false
					},
					{
						title: '薛之谦',
						subTitle: '薛之谦同名曲',
						num: '1170342',
						isHot: false,
						isRise: false
					},
					{
						title: '踏山河',
						subTitle: '万里山河都踏过，天下又入谁手',
						num: '1170342',
						isHot: true,
						isRise: false
					},
					{
						title: '薛之谦',
						subTitle: '薛之谦同名曲',
						num: '1170342',
						isHot: false,
						isRise: false
					},
				],
				suggestList: []
			};
		},
		methods: {
			goCloud() {},
			close() {
				this.$emit('close'); // 分发关闭事件给父组件监听
				this.isShow = false;
				// 业务逻辑
			},
			open() {
				this.isShow = true;
				// 业务逻辑
			},
			// 添加搜索
			addSearch () {
			  const txt = this.searchTxt.trim();
			  if (txt.length === 0) { // 空字符不添加
				return false;
			  }
			  const tempIndex = this.historyList && this.historyList.indexOf(txt);
			  if (tempIndex !== -1) {  // 如果存在相同的删除旧的
				this.historyList && this.historyList.splice(tempIndex, 1)
			  }
			  // 插入数组前
			  this.historyList.unshift(txt);
			  if (this.historyList.length > 7) {  // 数组长度7
				this.historyList = this.historyList.slice(0, 7);
			  }
			  uni.setStorageSync('searchlist', JSON.stringify(this.historyList));
			},
			// 输入搜索
			inputSearch() {
				console.log('点击搜索');
				const that = this;
				console.log('进入搜索');
				// 未搜索或者写入空格的情况下不显示搜索建议
				if (!that.searchTxt.trim().length) {
					that.suggestList = [];
					return false;
				}
				const par = {
					// type: 'mobile',
					keywords: that.searchTxt.trim(),
				}
				// 请求后台数据
				uni.request({
					method:'GET',
					url: 'http://localhost:3000/search',
					data: par,
					success: res => {
						console.log('搜索', res);
						// that.suggestList = res.result.allMatch;
					},
					complete: () => {
						console.log('请求完成');
					}
				});
				// this.debounce(() => {
				// 	console.log('进入搜索');
				// 	// 未搜索或者写入空格的情况下不显示搜索建议
				// 	if (!that.searchTxt.trim().length) {
				// 		that.suggestList = [];
				// 		return false;
				// 	}
				// 	const par = {
				// 		type: 'mobile',
				// 		keywords: that.searchTxt.trim(),
				// 	}
				// 	// 请求后台数据
				// 	uni.request({
				// 		method:'GET',
				// 		url: 'http://localhost:3000/search',
				// 		data: par,
				// 		success: res => {
				// 			console.log('搜索', res);
				// 			// that.suggestList = res.result.allMatch;
				// 		},
				// 		complete: () => {
				// 			console.log('请求完成');
				// 		}
				// 	});
				// })
			},
			// 获取搜索历史
			getSearchList() {
				try {
					const value = uni.getStorageSync('searchlist');
					if (value) {
						this.historyList = JSON.parse(value);
					}
				} catch (e) {}
			},
			// 清除历史记录
			clearSearch() {
				uni.showModal({
					title: '',
					content: '确认清除全部历史记录？',
					success: res => {
						if (res.confirm) {
							uni.setStorageSync('searchlist', '');
							this.historyList = [];
						} else if (res.cancel){
							console.log('用户点击了取消');
						}
					}
				});
			},
			// 防抖效果
			debounce(fn, wait = 1000) {
			  var timeout = null;
			  return function () {
			    if (timeout !== null) clearTimeout(timeout);
			    timeout = setTimeout(fn, wait);
			  };
			}
		}
	}
</script>

<style lang="scss">
.search-page{
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	z-index: 99;
	.search-box{
		.top-search{
				background: #f7f7f7;
				border-radius: 26px;
				width: 100%;
				height: 60rpx;
				line-height: 60rpx;
				margin-top: 18rpx;
				margin-left: -120rpx;
				padding-right: 120rpx;
			.search-icon{
				width: 32rpx;
				height: 32rpx;
				left: 10%;
				top: 8px;
			}
			.search-input{
				margin-top: 10rpx;
				margin-left: 60rpx;
			}
		}
		.cancle{
			font-size: 30rpx;
			margin-left: 28rpx;
		}
	}
	.banner-img{
		height: 140rpx;
		width: 100%;
		margin: 28rpx 0;
		padding: 0 20px;
		.banner-img-main{
			background-size: 100%;
			height: 100%;
			width: 100%;
		}
	}
	.history-wrapper{
		padding: 40rpx;
		.history-wrapper-fri{
			.history-clear{
				width: 22px;
				height: 22px;
				.history-clear-img{
					width: inherit;
					height: inherit;
				}
			}
		}
		.history-wrapper-sec{
			.history-list{
				margin: 38rpx 0;
				flex-wrap: wrap;
				.history-list-item{
					padding: 10rpx 30rpx;
					background: #f8f8f8;
					border-radius: 40rpx;
					text-align: center;
					font-size: 26rpx;
					white-space: nowrap;
					margin-bottom: 22rpx;
				}
				& :not(last-child){
					margin-right: 22rpx;
				}
			}
		}
	}
	.hot-search-wrapper{
		padding: 0 40rpx 40rpx;
		.hot-search-list{
			margin: 38rpx 0;
			.hot-search-list-item{
				display: flex;
				margin-bottom: 34rpx;
				.serial-number{
					display: inline-block;
					color: #cf5346;
					width: 40rpx;
				}
				.hot-search-content{
					flex: 1;
					.hot-content-title{
						.hot-content-fri{
							h4{
								display: inline-block;
								margin-right: 34rpx;
							}
							span{
								color: #d7d7d7;
								font-size: 20rpx;
							}
							.hot-content-image{
								width: 36rpx;
								height: 18rpx;
								background-size: 100%;
								margin-left: 34rpx;
							}
						}
						.hot-content-sec{
							font-size: 24rpx;
							color: #a0a0a0;
						}
					}
				}
			}
		}
	}
	.search-main{
		margin: 30rpx 38rpx;
	}
}
</style>
