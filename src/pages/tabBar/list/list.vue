<template>
	<view>
		<view class="uni-uploader">
			<view class="uni-uploader-body">
				<view class="uni-uploader__files">
					<block v-for="image, index in imageInfo" :key="index">
						<view class="uni-uploader__file">
							<image class="uni-uploader__img" :src="image.download_url" :data-src="image.download_url"
								@touchstart.prevent="touchstart(index)" @touchend="touchend" @tap="previewImage">
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
				Loop: null
			}
		},
		created() {
			this.getPictures()
		},
		onPullDownRefresh() {
			this.getPictures()
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '../upload/upload'
			})
		},
		methods: {
			getPictures() {
				github.contentsList('images').then(res => {
					if (res.status == 200) {
						res.json().then(json => {
							this.imageInfo = json
							this.imageList = this.imageInfo.filter(obj => obj.type == 'file').map(obj =>
								obj.download_url)
						}).catch(err => {
							console.log('err: ' + err)
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
			touchstart(index) {
				clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
				this.Loop = setTimeout(function() {
					uni.showModal({
						title: '删除',
						content: '确定要删除这张照片吗？',
						success: res => {
							if (res.confirm) {
								github.deleteImage(this.imageInfo[index]).then(res => {
									if (res.status == 200) {
										this.getPictures()
									}
								})
							}
						}
					});
				}.bind(this), 1000);
			},
			touchend() {
				clearInterval(this.Loop);
			},
		}
	}
</script>

<style>

</style>
