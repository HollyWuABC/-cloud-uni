import store from '../../store/index.js';

const PubFuc = {
	// 格式化时间戳
	formatTime(value) {
		var value = String(value);
		function t(v) {
			return v = v < 10 ? ('0' + v) : v;
		}
		String.prototype.ToSring = function(value) {
			var date = new Date(parseInt(this.substring(6, this.length -2)));
			value = value.replace('YYYY', date.getFullYear());
			value = value.replace('YY', t(date.getFullYear().toString().substring(2)));
			value = value.replace('MM', t(date.getMonth() + 1));
			value = value.replace('DD', t(date.getDate()));
			value = value.replace('hh', t(date.getHours()));
			value = value.replace('mm', t(date.getMinutes()));
			value = value.replace('ss', t(date.getSeconds()));
			value = value.replace('ms', t(date.getMilliseconds()));
			return value;
		}
		return value.ToSring('YYYY-MM-DD hh:mm:ss');
	},
	// 秒格式化 00:00
	formatTime(second) {
		var sec = second % 60;
		var min = Math.floor(second / 60);
		if (min.toString().length < 2) {
			min = '0' + min;
		}
		if (sec.toString().length < 2) {
			sec = '0' + sec;
		}
		return min + ':' + sec;
	}
}

export default PubFuc;