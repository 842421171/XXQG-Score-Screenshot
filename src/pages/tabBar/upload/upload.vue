<template>
	<view>
		<view>
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							请选择日期：
						</view>
						<view class="uni-list-cell-db">
							<picker mode="date" :value="date" :start="startDate" :end="endDate"
								@change="bindDateChange">
								<view class="uni-input">{{date}}</view>
							</picker>
						</view>
					</view>
				</view>
				<view class="uni-common-mt uni-common-pl">
					<view class="uni-uploader">
						<view class="uni-uploader-head">
							<view class="uni-uploader-title">点击可预览选好的图片</view>
						</view>
						<view class="uni-uploader-body">
							<view class="uni-uploader__file">
								<block v-if="image != null">
									<view class="uni-uploader__file">
										<image class="uni-uploader__img" :src="image" :data-src="image"
											@tap="previewImage"></image>
									</view>
								</block>
								<view v-else class="uni-uploader__input-box">
									<view class="uni-uploader__input" @tap="chooseImage"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-btn-v">
					<button type="primary" form-type="submit">提交</button>
					<button form-type="reset">重置</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import * as github from '../../../common/github.js'
	export default {
		data() {
			return {
				date: this.getDate(),
				image: null,
				imageFile: null
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		created() {
			github.commitsList().then(res => github.checkBranch(res[0].sha))
		},
		methods: {
			formSubmit() {
				uni.showLoading({
					title: '上传中'
				});
				if (this.image != null) {
					var reader = new FileReader()
					reader.readAsDataURL(this.imageFile)
					reader.onload = () => {
						var bs4 = reader.result
						github.uploadImage(bs4, this.date, 'images').then(res => {
							if (res.status == 201) {
								setTimeout(() => {
									uni.hideLoading()
								}, 2000)
								uni.showToast({
									title: '上传成功',
									icon: 'success',
									duration: 2000
								});
								this.image = null
								this.imageFile = null
								this.date = this.getDate()
							}
						})
					}
				} else {
					uni.showModal({
						content: '图片未上传，请上传图片后重新提交',
						showCancel: false
					});
				}
			},
			formReset() {
				this.date = this.getDate()
				this.image = null
				this.imageFile = null
			},
			bindDateChange: function(e) {
				this.date = e.detail.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			chooseImage: async function() {
				uni.chooseImage({
					sourceType: ['album'],
					sizeType: ['original', 'compressed'],
					count: 1,
					success: (res) => {
						this.image = res.tempFilePaths[0]
						this.imageFile = res.tempFiles[0]
					},
					fail: (err) => {
						uni.showToast({
							title: err,
							icon: 'none',
							duration: 2000
						});
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						if (err.errMsg.indexOf('cancel') !== '-1') {
							return;
						}
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res
											.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: [this.image]
				})
			},
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
						'android.permission.READ_EXTERNAL_STORAGE');

				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}

				return status;
			}
		}
	}
</script>

<style>
	.uni-form-item .title {
		padding: 20rpx 0;
	}
</style>
