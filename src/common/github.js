var token = process.env.VUE_APP_TOKEN
var accept = process.env.VUE_APP_ACCEPT
var host = process.env.VUE_APP_HOST
var user = process.env.VUE_APP_USER
var repo = process.env.VUE_APP_REPO
var initBranch = process.env.VUE_APP_INIT_BRANCH
var branch = process.env.VUE_APP_BRANCH
var author = process.env.VUE_APP_AUTHOR
var email = process.env.VUE_APP_EMAIL

async function commitsList() {
	var url = host + '/repos/' + user + '/' + repo + '/commits?sha=' + initBranch
	var res = await fetch(url, {
		method: 'get',
		headers: {
			Accept: accept
		}
	})
	return res.json()
}

function checkBranch(sha) {
	var url = host + '/repos/' + user + '/' + repo + '/git/ref/heads/' + branch
	fetch(url, {
		method: 'get',
		headers: {
			Accept: accept
		}
	}).then(res => {
		if (res.status == 404) {
			createBranch(sha)
			// 	uni.showModal({
			// 		title: '创建分支',
			// 		content: '当前分支不存在，是否创建分支',
			// 		success: (res) => {
			// 			if (res.confirm) {
			// 				createBranch(sha)
			// 			}
			// 		}
			// 	})
		}
	})
}

function createBranch(sha) {
	var url = host + '/repos/' + user + '/' + repo + '/git/refs'
	fetch(url, {
		method: 'post',
		headers: {
			Authorization: 'token ' + token,
			Accept: accept
		},
		body: JSON.stringify({
			ref: 'refs/heads/' + branch,
			sha: sha
		})
	}).then(res => {
		if (res.status == 201) {
			uni.showModal({
				content: branch + ' 分支创建成功！',
				showCancel: false
			})
		} else if (res.status == 422) {
			uni.showModal({
				content: branch + ' 分支创建失败！',
				showCancel: false
			})
		}
	})
}

async function uploadImage(bs4, date, path) {
	var base64 = bs4.split('base64,')[1]
	var fileName = date + '.' + bs4.match(/data:image\/(\w+)/)[1]
	var filePath = fileName
	if (path != null) {
		filePath = path + '/' + fileName
	}
	var url = host + '/repos/' + user + '/' + repo + '/contents/' + filePath
	var res = await fetch(url, {
		method: 'put',
		headers: {
			Authorization: 'token ' + token,
			Accept: accept
		},
		body: JSON.stringify({
			message: 'upload ' + fileName,
			content: base64,
			branch: branch,
			committer: {
				name: author,
				email: email
			},
			author: {
				name: author,
				email: email
			}
		})
	})
	return res
}

async function deleteImage(image) {
	var url = host + '/repos/' + user + '/' + repo + '/contents/' + image.path
	var res = await fetch(url, {
		method: 'delete',
		headers: {
			Authorization: 'token ' + token,
			Accept: accept
		},
		body: JSON.stringify({
			message: 'delete ' + image.name,
			branch: branch,
			sha: image.sha,
			committer: {
				name: author,
				email: email
			},
			author: {
				name: author,
				email: email
			}
		})
	})
	return res
}

async function contentsList(path) {
	var url = host + '/repos/' + user + '/' + repo + '/contents/' + (path != null ? path : '') + '?ref=' + branch
	var res = await fetch(url, {
		method: 'get',
		headers: {
			Authorization: 'token ' + token,
			Accept: accept
		}
	})
	return res
}

export {
	commitsList,
	checkBranch,
	createBranch,
	uploadImage,
	deleteImage,
	contentsList
}
