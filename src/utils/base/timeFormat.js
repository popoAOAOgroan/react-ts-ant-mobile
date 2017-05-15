const YYYYMMDD = (string) => {
	if (!string) {
		return '';
	}
	var date = new Date(string.replace(/-/g, '/'));
	// var hours = date.getHours();
	// var minutes = date.getMinutes();
	// var ampm = hours >= 12 ? 'pm' : 'am';
	// hours = hours % 12;
	// hours = hours ? hours : 12; // the hour '0' should be '12'
	// minutes = minutes < 10 ? '0'+minutes : minutes;
	// var strTime = hours + ':' + minutes + ' ' + ampm;
	let _month = date.getMonth() + 1;
	let month = _month < 10 ? '0' + _month : _month;
	let _day = date.getDate();
	let day = _day < 10 ? '0' + _day : _day;
	return date.getFullYear() + '-' + month + '-' + day;
};

const formatIntervalToText = (date) => {
	let last = new Date(date);
	let now = new Date();
	let mid = now - last;
	let result = '';
	let minute = mid / 1000 / 60;
	// 刚刚
	if (minute < 1) {
		result = '刚刚';
	}
	// 一小时内
	if (minute >= 1 && minute <= 60) {
		result = minute.toFixed(0) + '分钟';
	}
	// 一天内
	if (minute > 60 && minute < 1440) {
		let hour = minute / 60;
		result = hour.toFixed(0) + '小时';
	}
	// 30天内
	if (minute >= 1440 && minute <= 43200) {
		let day = minute / 60 / 24;
		result = day.toFixed(0) + '天';
	}
	// 30天后
	if (minute > 43200) {
		result = '30天前';
	}
	return result;
};
export { YYYYMMDD, formatIntervalToText };