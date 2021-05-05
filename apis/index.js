import request from '../utils/request/index.js';

// 获取轮播数据
export function apiGetBanner(data) {
	return request.request({
		url: '/banner',
		method:: 'GET',
		data,
		authType: "None"
	});
}