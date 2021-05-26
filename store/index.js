import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


let storeSongList = {
	curSong: {}, // 当前播放的歌曲信息
	list: [],
	playState: false, //播放状态
};

try {
	const value = uni.getStorageSync('playList');
	if (value) {
		storeSongList = JSON.parse(value)
	}
} catch (e) {}
const store = new Vuex.Store({
	state: {
		userInfo: {},
		hasLogin: false,
		leaveTime: 0,
		message: {}, // 角标信息
		playList: storeSongList,
	},
	mutations: {
		storeLogin(state, payload) {
			// 改变登录状态
			const temp = {
				hasLogin: true,
				token: payload.token,
				profile: payload.profile
			};
			// console.log('state', state);
			state.userInfo = Object.assign({}, state.userInfo, temp);
			// 将用户信息保存在本地
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo));
		},
		storeLogout(state, payload) {
			const temp = {
				hasLogin: false,
				token: '',
				profile: {}
			}
			state.userInfo = Object.assign({}, state.userInfo, temp);
			// 移除设置得缓存
			uni.removeStorageSync('userInfo');
		},
		storeMessage(state, payload) { // 角标信息
			state.message = { ...state.message,
				...payload
			}
		},
		// 设置播放列表
		storePlayList(state, payload) {
			state.playList = Object.assign({}, state.playList, payload)

			// #ifdef H5
			// 给H5端缓存住音乐数据
			uni.setStorage({
				key: 'playList',
				data: JSON.stringify(state.playList),
				success: function() {
					console.log('存储列表success');
				}
			});
			// #endif
		}
	}
});

export default store;