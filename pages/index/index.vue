<template>
	<view>
		<!-- 轮播图 -->
		<view class="banner">
			<swiper
			  class="swiper"
			  :autoplay="true"
			  :indicator-dots="true"
			  indicator-active-color="#ff372b"
			  indicator-color="rgba(255,255,255, .5)"
			  duration="500"
			  :circular="true">
				<swiper-item v-for="(item,index) in swiper" :key="index">
					<view class="item">
						<image :src="item.imageUrl + $imgSuffix" class="img" style="width: 100%;"></image>
						<view class="tag">{{item.typeTitle}}</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 主入口 -->
		<view class="main-bar flex-box">
			<view class="flex-item" v-for="(item, index) in contentBar" :key="index">
				<image :src="`/static/image/index/t_${index + 1}.png`" class="img"></image>
				<view>{{item.name}}</view>
				<view v-if="index == 0" class="date">{{curDate}}</view>
			</view>
		</view>
		<!-- 歌单分类 -->
		<songList
			title="推荐歌单1"
			link="/pages/songSquare/index?limit=30"
			:list="recommendSongs"></songList>
		<!-- 歌单分类 -->
		<view class="song-list">
			<view class="title-bar">
				推荐歌单2
				<view class="more fr">歌单广场</view>
			</view>
			<scroll-view class="scroll-view" scroll-x="true">
				<view class="item" v-for="(item, index) in recommendSongs" :key="index">
					<image class="img" :src="item.picUrl + $imgSuffix"></image>
					<view class="desc ellipsis">{{item.name}}</view>
					<view class="count"> {{ item.playCount}}</view>
				</view>
			</scroll-view>
		</view>
		<!-- 新歌新碟 -->
		<view class="song-list">
			<view class="switch-line flex-box">
				<view class="flex-box">
					<view class="switch-item" :class="{on: newType == 1}" @click="switchTab(1)">新碟</view>
					<view class="switch-item" :class="{on: newType == 2}" @click="switchTab(2)">>新歌</view>
				</view>
				<template v-if="newType == 1">
					<view class="more">更多新碟</view>
				</template>
				<template v-if="newType == 2">
					<view class="more">新歌推荐</view>
				</template>
			</view>
			<scroll-view class="scroll-view" scroll-x="true">
				<view class="item" v-for="(item, index) in latesAlbum" :key="index">
					<image class="img" :src="item.picUrl + $imgSuffix"></image>
					<view class="desc ellipsis">{{item.name}}</view>
					<view class="desc ellipsis c9">{{item.artist.name}}</view>
				</view>
			</scroll-view>
		</view>
		<!-- 精选视频 -->
		<view class="video-list song-list">
			<view class="title-bar">
				精选视频
				<view class="more fr">更多></view>
			</view>
			<view class="video-item" v-for="(item, index) in relatedVideo" :key="index">
				<image class="img" style="width: 100%;" :src="item.coverUrl+$imgSuffix"></image>
				<view class="desc ellipsis">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import songList from '../../components/songList.vue';
	export default {
		components:{
			songList
		},
		data() {
			return {
				swiper: [],
				loading: false,
				contentBar: [
					{
						name: '每日推销'
					},
					{
						name: '歌单'
					},
					{
						name: '排行榜'
					},
					{
						name: '电台'
					},
					{
						name: '直播'
					}
				],
				recommendSongs: [],
				curDate: '',
				newType: 1,
				latesAlbum: [],
				latestTempAlbum: [],
				relatedVideo: []
			}
		},
		onLoad() {
			this.getBanner();
			this.getRecommendSongs();
			this.getLatesAlbum();
			this.getRelatedVideo();
		},
		methods: {
			// 获取轮播图
			getBanner() {
				// 正在加载状态
				this.loading = true;
				uni.request({
					method:'GET',
					url: 'http://localhost:3000/banner',
					data: {},
					success: res => {
						// console.log('res', res);
						this.swiper = res.data.banners;
					},
					complete: () => {
						// 加载完成状态，去掉loading
						this.loading = false;
					}
				});
			},
			// 获取歌单
			getRecommendSongs() {
				// 正在加载状态
				this.loading = true;
				uni.request({
					method:'GET',
					url:'http://localhost:3000/personalized',
					data: {
						limit: 6
					},
					success: res => {
						const formatCount = data => {
							let temp = data;
							if (data > 100000) {
								temp = `${(parseInt(data/ 10000))}万`;
							}
							return temp;
						}
						this.recommendSongs = res.data.result.map(commend => {
							commend.playCount = formatCount(commend.playCount);
							return commend;
						});
					},
					complete: () => {
						this.loading = false;
					}
				})
			},
			// 切换歌单
			switchTab(type) {
				this.newType = type;
				let temp = {
					s: type == 1 ? 0 : 3,
					e: type == 1 ? 3 : 6
				};
				this.latesAlbum = this.latestTempAlbum.slice(temp.s, temp.e); 
			},
			// 获取新歌
			getLatesAlbum() {
				// 正在加载状态
				this.loading = true;
				uni.request({
					method: 'GET',
					url: 'http://localhost:3000/album/newest',
					data:{},
					success: res => {
						console.log('获取新歌res', res);
						this.latestTempAlbum = res.data.albums;
						this.latesAlbum = res.data.albums.slice(0, 3);
					},
					complete: () => {
						// console.log('加载完成');
						this.loading = false;
					}
				})
			},
			// 获取精选视频
			getRelatedVideo() {
				uni.request({
					method: 'GET',
					url: 'http://localhost:3000/related/allvideo',
					data:{
						id: 32154
					},
					success: res => {
						console.log('精选视频res', res.data.data);
						this.relatedVideo = res.data.data;
					},
					complete: () => {
						console.log('加载完成');
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.main-bar {
	padding:22rpx 0;
	text-align:center;
	line-height: 70rpx;
	color:#666;
	border-bottom:1rpx solid #e6e6e6;
	.img {
		display: block;
		width: 92rpx;
		height: 92rpx;
		margin: 0 auto;
	}
}
.scroll-view {
	width: 100%;
	white-space: nowrap;
	.img {
		display: block;
		width: 100%;
		height: 216rpx;
		margin-bottom: 16rpx;
		background: #eee;
		border-radius: 10rpx;
	}
}
.song-list{
	padding-left: 32rpx;
	.title-bar {
		font-size: 34rpx;
		font-weight: 600;
		line-height: 110rpx;
	}
	.more {
		width: 150rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		margin-top: 30rpx;
		margin-right: 32rpx;
		font-weight: 400;
		font-size: 24rpx;
		border: 2rpx solid #e6e6e6;
		border-radius: 50rpx;
	}
	.item {
		position: relative;
		width: 216rpx;
		padding-bottom: 16rpx;
		margin-right: 16rpx;
		line-height: 34rpx;
		display: inline-block;
		&.video {
			width: 450rpx;
		}
		
		.desc {
			height: 64rpx;
			margin-top: 12rpx;
			line-height: 30rpx;
			overflow: hidden;
		}
		.count {
			position: absolute;
			top: 0;
			right: 0;
			padding-left: 25rpx;
			line-height: 34rpx;
			color: #fff;
			font-size: 24rpx;
			z-index: 10;
			background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAqFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8j1z1tAAAAN3RSTlMA9wcC+/3w4A/RoQv0m4s6IBkU7eeRK73kxaZtW+rc1cmxe3UmwbiWQNmqgWZUzUY1ME4dhmGuJ2Z0kQAABVtJREFUeNrtnYtWGkEQRFsEeSmgII8EVBASUFHx1f//ZwmJRwaZYhndjdU5c//gQp8DVTvTK5FIJBKJRCKRSCQSiUQikcj/yWI6vRfzNEYz/U23NhbLlF70jZ7hr+W+pQ6FoxOxyXhP12neiEVyZd3gdiH2uFYfP0tijP2mehk8iy3miui1xRLfFHNaFTv0dAutvpihq1uZmPmp1yRqRuZLVxyol+5cLOB+9nMwZ52G8OOKSLWWVx97TzlhZ01EZDxRL8UHIcf92ZAl/ZZ6+UE+XxsiUjoF8zWinq9NEZH2BZivO+HFJyLyPFAvL4/Cil9ESkcF9XFIO19ARGRRVi9ndaHEDVPvksp38FP/7VgIQSJLTirq5fByX+jAIkvq5+rlnG++tovI/uWheqmwlUZAZMXxlXo5+M41X0DEZXqmXspUpaSuOBJAbrTq8GhLSSzi8jjUv/CWkusimLui/oa4lNxVRHLXYL5ISkmPCKLRYS4lPSIYFOovCEpJXVGRJGCoz59++XwBEci4R1pKIhFMv0VZegeL4FCfDyklGUSWoZ6vlAQiSTw32UpJN/lJMm6o5yolkUgy92WqUjJcxA31RKXkJ0RwqN+7TpwvLpFlqGcpJYNEQkL9MOtSEotcSRIo1DOU3kEigaH+bCoQShEY6vUKlpKcIjDU41IyS5EXSSY81M/q4oNXBIR6VHoTi4BQD0pJahEQ6kHpnZ3IUAIIDPWF96U3u8hGqEelJL/IWqjHpaQFERjqC0er0siECAj12c6Xm4ckRW6a20tJMyKvoR6WknZEcKgf9EXEkggO9b22LREY6pelpC0RHOq7fWMiONRPxlmJdCQLcKjPP1VtieBQX5wbE8GhvtOwJbIM9bCUtCWCQ33xzpgIDvWVXLoiE8macQck4YYxERjqy/vWRFCofzInItKeqIdxiiI9yRwc6msWRXyhfmBSxBfqFzZFNkP9g1UROVkP9TfpiVzIv6VRVodLqyLv/7D0jYps/IW8Nyni+VNfNSjii1kVSU/kVjIHB9+6ORF/FTEUYyKgHBqUjIlMZ+rjcCppipQlY47BOoNyQ0yJoEq7JmJJpH4Om1NLIieVAjzAbUgEPSjJn1YlA5FzyYj7Mn6eaEhkmTvQtRNLIjdNeBHIksjiFp+CyExkJmlT+lmA5wYsiTwP8PVFQyLti20XSs2IVE/zGZ+mwyJnkh79VsKlaxsi40niiUALIug44IF7BtiAyLyb7anZZJGipECjs9s5ZnKR3NPejifLuUUeimDBzeZUMYs0fgQ8SOcVAU/R0X2YLEW66ZXSyTfgSEUeh19+JxGIhJbSX39L1G00PlxKM9zbBSIhpTTHTWogElBKk9xt/5xIfUazAtXtZ8JLaaL9D64IX334L0Tq51w7LNySJqyUJttaA0QSp4pujxAWCS+lb9vydbiZeudSmnHXVrDITZNz+1mgyOKWdR8dEIGlNO2GwBCR5wHxzka36kgopXvUWzRdEapSOiORfot906ybTINL6RnHVHlEUCltYFtussi8++WrQtIQaXQIlreEinhLaYZ1OoEi+Z1L6R+EW9ehCC6lzyjfs4BElqU0zRKwQJHCeinNUB9+VgSX0rxvh/GJ5EagPnwifl+POryV0jT14WdEjq+I6sMPilCV0p8R2Zf6jKs+/KAIKqUH5FO1IXKght+NqCt4F3fvwtu3QL+qP4GybqFwZGKq/jBUTJnldQO78F1VbbxgJIHSHpgqivowhIp/qoiKnh05aZqfqlceiOvDMC51jRlb0bM79RZrfRhKqXb46lExOlVv5O5G19ejB/bQEYlEIpFIJBLJkF8r2nFUwcJuMQAAAABJRU5ErkJggg==) no-repeat;
			background-size: 25rpx 25rpx;
			transform: scale(0.8);
		}
	}
	.switch-line{
		justify-content: space-between;
		color: #999;
		.flex-box {
			line-height: 110rpx;
			width: 300rpx;
		}
		.switch-item {
			font-weight: 600;
			&:first-child {
				width: 80rpx;
			}
			&:last-child {
				padding-left: 22rpx;
			}
			&.on {
				color: #333;
				font-size: 34rpx;
			}
		}
	}
	.video-list{
		padding-left: 0;
		.title-bar {
			padding-left: 32rpx;
		}
		
		.img {
			display: block;
			width: 100%;
			height: 390rpx;
			background: #eee;
		}
		.desc {
			padding-left: 40rpx;
			font-size: 30rpx;
			font-weight: 600;
			line-height: 100rpx;
		}
	}
	.video-item {
		width: 686rpx;
		height: 490rpx;
		margin: 0 auto;
		background: #f8f8f8;
		border-radius: 10rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
		margin-right: 32rpx;
	}
}
</style>
