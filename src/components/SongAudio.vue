<template>
<div class="song-audio">
    <audio id="player" :src="url" controls="controls" preload="true" @canplay="startPlay" @ended="ended" />
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
export default {
    name: 'song-audio',
    computed: {
        ...mapGetters([
            'id',
            'url',
            'isPlay'
        ])
    },
    watch: {
        //监听播放还是暂停
        isPlay: function () {
            this.togglePlay();
        }
    },
    methods: {
        //获取链接后准备播放
        startPlay() {
            let player = document.querySelector("#player");
            //player.load();
            let playPromise = player.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        playPromise.play()
                    }).catch((err) => {
                        console.log(err);
                    })
                }
        },
        //播放完成之后触发
        ended() {
            //
            this.isPlay = false
        },
        //开始，暂停
        togglePlay() {
            let player = document.querySelector("#player");
            //player.load();
            if (this.isPlay) {
                let playPromise = player.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        playPromise.play()
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            } else {
                player.pause();
            }
        }
    },
}
</script>

<style>
.song-audio {
    display: none;
}
</style>
