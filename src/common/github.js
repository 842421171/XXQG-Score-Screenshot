var token = window.atob(localStorage.getItem('token'))
var accept = localStorage.getItem('accept')
var host = localStorage.getItem('host')
var user = localStorage.getItem('user')
var repo = localStorage.getItem('repo')
var initBranch = localStorage.getItem('initBranch')
var branch = localStorage.getItem('branch')
var author = localStorage.getItem('author')
var email = localStorage.getItem('email')

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
			uni.showToast({
				title: branch + ' 分支创建成功！',
				icon: 'none', //如果要纯文本，不要icon，将值设为'none'
				duration: 2000 //持续时间为 2秒
			})
		} else if (res.status == 422) {
			uni.showModal({
				content: branch + ' 分支创建失败！<br>status: ' + res.status,
				success: res => {
					if (res.confirm) {
						createBranch(sha)
					}
				}
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

function addJsdelivrCDN(path) {
	return 'https://cdn.jsdelivr.net/gh/' + user + '/' + repo + '@' + branch + '/' + path
}

export {
	commitsList,
	checkBranch,
	createBranch,
	uploadImage,
	deleteImage,
	contentsList,
	addJsdelivrCDN
}
