const defaultConfig = {
	techTitle: [
		{
			value: 'ARCHIATER',
			text:'主任医师',
		},
		{
			value: 'ASSOCIATE_ARCHIATER',
			text:'副主任医师',
		},
		{
			value: 'ATTENDING_PHYSICIAN',
			text:'主治医师',
		},
		{
			value: 'RESIDENT_PHYSICIAN',
			text:'医师/士',
		},
		{
			value: 'CHIEF_NURSE',
			text:'主任护师',
		},
		{
			value: 'ASSOCIATE_CHIEF_NURSE',
			text:'副主任护师',
		},
		{
			value: 'SUPERVISOR_NURSE',
			text:'主管护师',
		},
		{
			value: 'NURSE',
			text:'护师/士',
		},
		{
			value: 'CHIEF_TECHNICIAN',
			text:'主任技师',
		},
		{
			value: 'ASSOCIATE_CHIEF_TECHNICIAN',
			text:'副主任技师',
		},
		{
			value: 'SUPERVISOR_TECHNICIAN',
			text:'主管技师',
		},
		{
			value: 'TECHNICIAN',
			text:'技师/士',
		},
	],
	// [
	// 	'主任医师',
	// 	'副主任医师',
	// 	'主治医师',
	// 	'医师/士',
	// 	'主任护师',
	// 	'副主任护师',
	// 	'主管护师',
	// 	'护师/士',
	// 	'主任技师',
	// 	'副主任技师',
	// 	'主管技师',
	// 	'技师/士',
	// ],
	academicTitle: [
		{
			value: 'PROFESSOR',
			text:'教授',
		},
		{
			value: 'ASSOCIATE_PROFESSOR',
			text:'副教授',
		},
		{
			value: 'LECTURER',
			text:'讲师',
		},
		{
			value: 'NONE',
			text:'其他',
		},
		// '教授',
		// '副教授',
		// '讲师',
		// '其他'
	],
	doctorStatus: {
		'0': {name:'未认证',tips:'请填写基本信息，以便我们为您进行医生认证！'},
		'1': {name:'已认证',tips:'恭喜您通过医生认证，现在可以发起会诊邀请啦！'},
		'-1': {name:'认证失败',tips:'您未能通过医生认证'},
		'2': {name:'未认证',tips:'我们会尽快完成医生认证，请您耐心等待。'}, //提交认证，但未审核
	},
}

const _getValueWithNmae = (name) => (key) => {
	return defaultConfig[name][key];
}
const getDoctorStatusWithKey = _getValueWithNmae('doctorStatus');


const _getTextWithValue = (name) => (value) => {
	let _filter =  defaultConfig[name].filter((v)=>{v.value==value});
	return _filter.length ? _filter[0].text : '';
}
const getTextWithValue = _getTextWithValue;


export { getDoctorStatusWithKey , getTextWithValue};

export default defaultConfig;