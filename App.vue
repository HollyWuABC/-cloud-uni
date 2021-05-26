<script>
	import { mapMutations } from 'vuex';
	export default {
		onLaunch: function() {
			console.log('App Launch');
			uni.getStorage({
				key: 'userInfo',
				success: res => {
					console.log('res', res.data);
					uni.request({
						url: '',
						header: {
							Token: res.data.token
						},
						method:'POST',
						success: (response) => {
							console.log('response', response);
							if (response.data.code === 200) {
								this.storeLogin(response.data);
							} else {
								// 验证无效清除用户原有缓存数据
								this.storeLogout();
							}
						},
					});
					this.storeLogin(JSON.parse(res.data));
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(["storeLogin", "storeLogout"]),
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import './common/css/common.scss';
	@import './common/css/iconfont.css';
</style>
