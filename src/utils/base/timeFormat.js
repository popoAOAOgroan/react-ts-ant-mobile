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
	let _month = date.getMonth()+1;
	let month = _month < 10 ? '0' + _month : _month;
	let _day = date.getDate();
	let day = _day < 10 ? '0' + _day : _day;
	return date.getFullYear() + '-' + month + '-' + day;
}
export { YYYYMMDD };