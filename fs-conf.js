fis.set('project.fileType.text', 'ts');


fis.match('**/*.ts', {
	parser: fis.plugin('typescript', {
		sourceMap: isUnderLocal,
		strictNullChecks: true,
		module: 1,
		target: 1,
		//showNotices : true ,
		noImplicitAny: true
	}),
	//packTo: '/js/ts.js',
	rExt: '.js'
});

