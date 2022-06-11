<template>
	<view>
		<form @submit="formSubmit" @reset="formReset">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						GITHUB Token：
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :value="baseInfo.token" @input="bindToken" placeholder="请输入GITHUB Token" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						GITHUB API ACCEPT: 
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :value="baseInfo.accept" @input="bindAccept" placeholder="请输入GITHUB API ACCEPT" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						GITHUB API HOST: 
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :value="baseInfo.host" @input="bindHost" placeholder="请输入GITHUB API Host" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						GITHUB 仓库所有者: 
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :value="baseInfo.user" @input="bindUser" placeholder="请输入GITHUB 仓库所有者" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						GITHUB 仓库名: 
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :value="baseInfo.repo" @input="bindRepo" placeholder="请输入GITHUB 仓库名" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						GITHUB 仓库初始分支: 
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :value="baseInfo.initBranch" @input="bindInitBranch" placeholder="请输入GITHUB 仓库初始分支" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						GITHUB 仓库图片保存分支: 
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :value="baseInfo.branch" @input="bindBranch" placeholder="请输入GITHUB 仓库图片保存分支" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						GITHUB 提交的作者: 
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :value="baseInfo.author" @input="bindAuthor" placeholder="请输入GITHUB 提交的作者" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						GITHUB 提交的作者邮箱: 
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :value="baseInfo.email" @input="bindEmail" placeholder="请输入GITHUB 提交的作者邮箱" />
					</view>
				</view>
			</view>
			<view class="uni-btn-v">
				<button type="primary" form-type="submit">保存</button>
				<button form-type="reset">重置</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseInfo: {
					token: null,
					accept: null,
					host: null,
					user: null,
					repo: null,
					initBranch: null,
					branch: null,
					author: null,
					email: null
				}
			}
		},
		created() {
			this.getBaseInfo()
		},
		onNavigationBarButtonTap() {
			uni.navigateBack({
				url: '../list/list'
			})
		},
		methods: {
			getBaseInfo() {
				var token = localStorage.getItem('token')
				this.baseInfo.token = window.atob(token ? token : '')
				this.baseInfo.accept = localStorage.getItem('accept')
				this.baseInfo.host = localStorage.getItem('host')
				this.baseInfo.user = localStorage.getItem('user')
				this.baseInfo.repo = localStorage.getItem('repo')
				this.baseInfo.initBranch = localStorage.getItem('initBranch')
				this.baseInfo.branch = localStorage.getItem('branch')
				this.baseInfo.author = localStorage.getItem('author')
				this.baseInfo.email = localStorage.getItem('email')
			},
			formSubmit() {
				localStorage.setItem('token', window.btoa(this.baseInfo.token))
				localStorage.setItem('accept', this.baseInfo.accept)
				localStorage.setItem('host', this.baseInfo.host)
				localStorage.setItem('user', this.baseInfo.user)
				localStorage.setItem('repo', this.baseInfo.repo)
				localStorage.setItem('initBranch', this.baseInfo.initBranch)
				localStorage.setItem('branch', this.baseInfo.branch)
				localStorage.setItem('author', this.baseInfo.author)
				localStorage.setItem('email', this.baseInfo.email)
				uni.showToast({
					title: '保存成功',
					icon: 'success',
					duration: 2000
				})
			},
			formReset() {
				this.getBaseInfo()
			},
			bindToken: function (e) {
				this.baseInfo.token = e.detail.value
			},
			bindAccept: function (e) {
				this.baseInfo.accept = e.detail.value
			},
			bindHost: function (e) {
				this.baseInfo.host = e.detail.value
			},
			bindUser: function (e) {
				this.baseInfo.user = e.detail.value
			},
			bindRepo: function (e) {
				this.baseInfo.repo = e.detail.value
			},
			bindInitBranch: function (e) {
				this.baseInfo.initBranch = e.detail.value
			},
			bindBranch: function (e) {
				this.baseInfo.branch = e.detail.value
			},
			bindAuthor: function (e) {
				this.baseInfo.author = e.detail.value
			},
			bindEmail: function (e) {
				this.baseInfo.email = e.detail.value
			}
		}
	}
</script>

<style>

</style>
