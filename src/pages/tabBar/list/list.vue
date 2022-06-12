<template>
	<view>
		<view class="uni-uploader" style="width: 360px;height: auto;margin: auto;">
			<view class="uni-uploader-body">
				<view class="uni-uploader__files">
					<block v-for="image, index in imageInfo" :key="index">
						<view class="uni-uploader__file uni-grid-9-item" style="border: none;">
							<image class="uni-uploader__img" mode="aspectFill" :src="image.download_url"
								:data-src="image.download_url" @tap="previewImage" @longtap="deletePictures(index)">
							</image>
							<view class="uni-center">{{ image.name.split('.')[0] }}</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view v-if="imageInfo.length == 0" class="uni-center">暂无图片</view>
	</view>
</template>

<script>
	import * as github from '../../../common/github.js'
	export default {
		data() {
			return {
				imageInfo: [],
				imageList: [],
				Loop: null,
				isDelete: false
			}
		},
		created() {
			this.isFirst()
			this.getPictures()
		},
		onPullDownRefresh() {
			this.getPictures()
		},
		onNavigationBarButtonTap(e) {
			if (e.float == 'left') {
				uni.navigateTo({
					url: '../config/config'
				})
			} else if (e.float == 'right') {
				uni.navigateTo({
					url: '../upload/upload'
				})
			}
		},
		methods: {
			isFirst() {
				var first = localStorage.getItem('first')
				if (!first) {
					uni.navigateTo({
						url: '../config/config'
					})
					localStorage.setItem('first', true)
				}
			},
			getPictures() {
				uni.showLoading({
					title: '加载中'
				})
				github.contentsList('images').then(res => {
					uni.hideLoading()
					if (res.status == 200) {
						res.json().then(json => {
							this.imageInfo = json.reverse().filter(obj => obj.type == 'file')
							this.imageInfo.forEach(obj => {
								obj.download_url = github.addJsdelivrCDN(obj.path)
							})
							this.imageList = this.imageInfo.map(obj => obj.download_url)
						}).catch(err => {
							uni.showToast({
								title: 'err: ' + err,
								icon: 'none',
								duration: 2000
							})
						})
					} else {
						uni.showToast({
							title: 'status: ' + res.status,
							icon: 'none',
							duration: 2000
						})
					}
				})
				uni.stopPullDownRefresh()
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			deletePictures(index) {
				var image = this.imageInfo[index]
				uni.showModal({
					title: '删除',
					content: '确定要删除 ' + image.name.split('.')[0] + ' 这张照片吗？',
					success: res => {
						if (res.confirm) {
							github.deleteImage(image).then(res => {
								if (res.status == 200) {
									this.getPictures()
								}
							})
						}
						this.isDelete = false
					}
				});
			}
		}
	}
</script>

<style>

</style>
