<template>
	<view>
		<view class="login-form">
			<input class="input-row" v-model="account" type="number" maxlength="11" placeholder="输入手机号" />
			<input class="input-row" v-model="password" @confirm="bindLogin" type="password" maxlength="20" placeholder="输入密码"
			 confirm-type="登录" />
			<button type="button" class="btn login_btn" @click="bindLogin">登录</button>
			<view class="bot clearfix">
				<navigator class="fl sign" hover-class="none">立即注册</navigator>
				<navigator class="fr forget" hover-class="none">忘记密码?</navigator>
			</view>
		</view>
		<view class="auth-row" v-if="hasProvider">
			<view class="auth-image" v-for="provider in providerList" :key="provider.value">
				<image v-if="provider.value != 'weixin'" class="img" :src="provider.image" @click="authLogin(provider.value)"></image>
				<!-- 小程序处理 -->
				<button v-if="provider.value == 'weixin'" class="log-btn" open-type="getUserInfo" @getuserinfo="getUserInfo">
					<image class="img" :src="provider.image" @click="authLogin(provider.value)"></image>
				</button>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				hasProvider: false, // 是否有服务商平台可登录
				providerList: [],
				account: '',
				password: ''
			};
		},
		onReady() {
			this.getProvider();
		},
		onLoad() {
		},

		methods: {
			...mapMutations(['storeLogin']),
			// 微信授权获取信息 获取 wx.getUserInfo 接口后续将不再出现授权弹窗，请注意升级
			getUserInfo(res) {
				if (!res.detail.iv) {
					uni.showToast({
						icon: "none",
						title: "您取消了授权,登录失败"
					});
					return false;
				}
				// 用户授权，获取用户基本信息和加密数据（encryptedData、iv），后台进行查询配对用户，生成userInfo返回前台
				// 这里有一个验证用户接口
				setTimeout(() => {
					let profile = JSON.parse(res.detail.rawData)
					profile.nickname = profile.nickName

					const temp = {
						token: '',
						profile,
					}
					this.storeLogin(temp);
					uni.switchTab({
						url: '/pages/index/index'
					});
				}, 100);
			},
			getProvider() {
				const providerList = ['weixin', 'qq', 'sinaweibo'];
				// 获取服务供应商。判断是否用某种登录工具登录
				uni.getProvider({
					service: 'oauth',
					success: res => {
						if (res.provider && res.provider.length) {
							for (let i = 0; i < res.provider.length; i++) {
								var tempProvider = res.provider[i];
								if (~providerList.indexOf(tempProvider)) {
									this.providerList.push({
										value: tempProvider,
										image: '/static/image/login/' + tempProvider + '.png'
									});
								}
							}
							this.hasProvider = true;
						}
					},
					fail: err => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
			},
			bindLogin() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				const account = this.account.trim()
				const password = this.password.trim()
				if (account == '') {
					this.alert('请输入手机号')
					return;
				}
				if (!(/^1[3456789]\d{9}$/.test(account))) {
					this.alert("手机号码有误，请重填");
					return false;
				}
				if (password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}

				uni.showLoading({
					title: '登录中'
				});

				const params = {
					phone: this.account,
					password: this.password
				};
				const vm = this;
				console.log('vm', vm);
				uni.request({
					url: this.$websiteUrl + '/login/cellphone',
					method: 'GET',
					data: params,
					success: res => {
						console.log('登录信息res', res);
						// 不成功信息提示
						if (res.data.code !== 200) {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
							});
							return false
						};

						// 登录成功后改变store登录状态，并进入首页
						// 在store存储token,profile
						const temp = {
							token: JSON.parse(res.data.bindings[1].tokenJsonStr).access_token,
							profile: res.data.profile
						};
						console.log('temp', temp);
						vm.storeLogin(temp);
						// console.log('this.storeLogin', this.storeLogin(temp));

						uni.switchTab({
							url: '/pages/index/index'
						});
					}
				});
			},
			authLogin(value) {
				console.log(value)
				uni.login({
					provider: value,
					success: res => {
						console.log(res)
						uni.getUserInfo({
							provider: value,
							success: infoRes => {
								console.log(infoRes)
								// 存储个人信息
								// 这里有一个验证用户接口

								let profile = null
								if (value == 'weixin') {
									infoRes.userInfo.nickname = infoRes.userInfo.nickName
									profile = infoRes.userInfo
								}

								const temp = {
									token: '',
									profile,
								}
								this.storeLogin(temp)

								// 登录完之后到首页
								uni.switchTab({
									url: '/pages/index/index'
								});
							}
						});
					},
					fail: err => {
						console.error('授权失败：' + JSON.stringify(err));
					}
				});
			},
			// 验证报错
			alert(msg) {
				uni.showToast({
					icon: 'none',
					title: msg
				});
			}
		}
	};
</script>
<style lang="scss">
	/*  #ifdef  MP-WEIXIN  */
	// page{
	// 	background: red!important;
	// }
	/*  #endif  */
	.input-row {
		width: 600rpx;
		height: 75rpx;
		margin: 0 auto;
		border: 1px solid $color;
		color: #6c6c6c;
		border-radius: 75rpx;
		padding: 0 50rpx;
		line-height: 75rpx;
		margin-bottom: 45rpx;
		font-size: 26rpx;
		box-sizing: border-box;
	}

	.login-form {
		padding-top: 220rpx;
	}

	.login_btn {
		width: 600rpx;
		height: 75rpx;
		margin: 0 auto;
		border: 1px solid $color;
		border-radius: 75rpx;
		padding: 0 50rpx;
		line-height: 75rpx;
		margin-bottom: 45rpx;
		font-size: 26rpx;
		color: #fff;
		background: $color;
	}

	.bot {
		width: 600rpx;
		padding: 0 17rpx;
		font-size: 26rpx;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.sign {
		color: $color;
	}

	.auth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		bottom: 100rpx;
		left: 0;
		width: 100%;

		.auth-image {
			width: 50px;
			height: 50px;
			border: 1px solid #dddddd;
			border-radius: 50px;
			margin: 0 20px;
			background-color: #ffffff;
			overflow: hidden;
		}

		.img {
			width: 30px;
			height: 30px;
			margin: 10px;
		}

		input {
			outline: none;
			border: none;
			list-style: none;
		}
	}

	.log-btn {
		margin: 0;
		padding: 0;
		background: #fff !important;
		height: 48px;

		&::after {
			background-color: transparent;
			margin: 0;
			padding: 0;
			border: 0;
		}
	}
</style>
