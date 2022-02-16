export class MusicPlayer {
    constructor(selector, playlist) {
        this.hideOnClose = hideOnClose
        this.container = document.querySelector(selector)
        this.playlist = playlist ? playlist : {artist: '', tracks: []}
        this.currentTrackID = 0
        this.currentTrack = undefined
        this.paused = true
        this.totalDuration = 0

        // Buttons
        this.btnPrev = this.container?.querySelector('.button-controls-previous')
        this.btnPlay = this.container?.querySelector('.button-controls-play')
        this.btnNext = this.container?.querySelector('.button-controls-next')
        this.btnPause = this.container?.querySelector('.button-controls-pause')
        this.btnStop = this.container?.querySelector('.button-controls-stop')
        this.btnArtistList = this.container?.querySelector('.toggle-dropdown-artist .dropdown-button')
        this.btnMusicList = this.container?.querySelector('.toggle-dropdown-music-list .dropdown-button')
        this.btnClose = this.container?.querySelector('.ui_window__head__close')

        this.btnClose?.addEventListener('click', e => {
            this.close()
        })

        const buttons = [this.btnPrev, this.btnPlay, this.btnNext, this.btnPause, this.btnStop, this.btnArtistList, this.btnMusicList]
        buttons.forEach(b => {
            b?.setAttribute('draggable', 'false')
            b?.addEventListener('mousedown', e => {
                b.classList.add('button-pushed')
            })
            document.addEventListener('mouseup', e => {
                b.classList.remove('button-pushed')
            })
            b?.addEventListener('mouseleave', e => {
                b.classList.remove('button-pushed')
            })
        })

        this.btnPlay?.addEventListener('click', e => {
            this.audio.play()
            this.paused = false
        })

        this.btnPause?.addEventListener('click', e => {
            this.audio.pause()
            this.paused = true
        })

        this.btnStop?.addEventListener('click', e => {
            this.audio.pause()
            this.audio.currentTime = null
            this.paused = true
        })

        this.btnPrev?.addEventListener('click', e => {
            this.prevTrack()
        })

        this.btnNext?.addEventListener('click', e => {
            this.nextTrack()
        })

        // Volume
        this.volumeControl = document.createElement('input')
        this.volumeControl.type = 'range'
        this.volumeControl.classList.add('range-volume')
        const volumeTarget = this.container.querySelector('.range-volume')
        volumeTarget.replaceWith(this.volumeControl)

        // Lists
        this.dropDownArtist = this.container?.querySelector('.drop-down-artist')
        this.dropDownArtistList = this.dropDownArtist?.querySelector('nav')
        this.dropDownArtistList?.replaceChildren()
        this.dropDownArtistCurrentTitle = this.dropDownArtist?.querySelector('.toggle-dropdown-artist > div')
        if (this.dropDownArtistCurrentTitle) this.dropDownArtistCurrentTitle.innerText = this.playlist?.artist
        const artistRow = document.createElement('a')
        artistRow.classList.add('musicplayer-dropdown-row', 'w-dropdown-link')
        artistRow.setAttribute('draggable', 'false')
        artistRow.innerText = this.playlist?.artist
        artistRow.addEventListener('click', e => {
            this.closeDropDown(this.dropDownArtist)
        })
        this.dropDownArtistList.appendChild(artistRow)

        this.dropDownSongs = this.container?.querySelector('.drop-down-music-list')
        this.dropDownSongsList = this.dropDownSongs.querySelector('nav')
        this.dropDownSongsCurrentTitle = this.dropDownSongs.querySelector('.toggle-dropdown-music-list > .musicplayer-track-title')
        this.dropDownSongsCurrentID = this.dropDownSongs.querySelector('.toggle-dropdown-music-list > .musicplayer-track-id')
        this.currentTrackTitle = this.container.querySelector('.music-playback > div')
        this.dropDownSongsList?.replaceChildren()

        for(let i =0; i < this.playlist.tracks.length; i++) {
            const t = this.playlist.tracks[i]
            const a = document.createElement('a')
            a.classList.add('musicplayer-dropdown-row', 'w-dropdown-link')
            a.setAttribute('draggable', 'false')
            a.addEventListener('click', e => {
                e.preventDefault()
                this.setTrack(i)
                this.closeDropDown(this.dropDownSongs)
            })
            const title = document.createElement('span')
            title.classList.add('musicplayer-dropdown-row-title')
            title.innerText = t.title
            const index = document.createElement('span')
            index.innerText = `<${(i+1).toString().padStart(2,'0')}>`
            index.classList.add('musicplayer-dropdown-row-id')
            a.appendChild(title)
            a.appendChild(index)
            this.dropDownSongsList.appendChild(a)
        }

        // Display
        this.displayCurrentID = this.container.querySelector('.block-counter-song > .number-song')
        this.displayCurrentTime = this.container.querySelector('.block-counter-song > .time-song')

        this.trackTime = this.container.querySelector('.counter-totaltrack')
        this.totalTime = this.container.querySelector('.counter-totalplay')

        // Audio
        this.audio = document.createElement('audio')

        this.audio.addEventListener('ended', e => {
            this.nextTrack()
        })

        this.audio.addEventListener('timeupdate', e => {
            const time = this.formatTime(this.audio.currentTime)
            if (this.displayCurrentTime) this.displayCurrentTime.innerText = `${time.min}:${time.sec}`
        })

        this.audio.addEventListener('loadedmetadata', e => {
            const time = this.formatTime(this.audio.duration)
            this.trackTime.innerText = `${time.min}:${time.sec}`
        })

        this.playlist?.tracks?.forEach(t => {
            let temp = document.createElement('audio')
            temp.src = t.src
            temp.preload = 'metadata';
            temp.addEventListener('loadedmetadata', e => {
                this.totalDuration += temp.duration
                const time = this.formatTime(this.totalDuration)
                this.totalTime.innerText = `${time.min}:${time.sec}`
                temp.remove()
            })
        })

        this.volumeControl.addEventListener('input', e => {
            this.audio.volume = e.target.value / 100
        })

        this.audio.volume = this.volumeControl.value / 100


        this.setTrack(0)
        this.assignMenu()
    }

    assignMenu() {
        const menu = this.container.querySelector('.ui_menu_song')

        menu?.querySelectorAll('.ui_menu_file_row').forEach(a => {
            a.setAttribute('draggable', 'false')
        })

        const quit = menu?.querySelector('.ui_menu_quit')
        quit?.addEventListener('click', e => {
            e.preventDefault()
            menu?.parentElement?.dispatchEvent(new Event('w-close'))
            this.close()
        })
    }

    closeDropDown(dropDown) {
        console.log('close', dropDown)
        dropDown?.dispatchEvent(new Event('w-close'))
    }

    formatTime(sec) {
        sec = Math.floor( sec );
        let min = Math.floor( sec / 60 );
        min = min >= 10 ? min : '0' + min;
        sec = Math.floor( sec % 60 );
        sec = sec >= 10 ? sec : '0' + sec;
        return {min: min, sec: sec}
    }

    setTrack(id) {
        this.currentTrackID = id
        this.currentTrack = this.playlist.tracks[id]
        if (this.dropDownSongsCurrentTitle) this.dropDownSongsCurrentTitle.innerText = this.currentTrack.title
        if (this.dropDownSongsCurrentID) this.dropDownSongsCurrentID.innerText = `<${(id+1).toString().padStart(2, '0')}>`
        if (this.currentTrackTitle) this.currentTrackTitle.innerText = `${id+1}. ${this.currentTrack.title}`
        if (this.displayCurrentID) this.displayCurrentID.innerText = `[${(id+1).toString().padStart(2, '0')}]`

        this.audio.pause()
        this.audio.currentTime = null
        this.audio.src = this.currentTrack.src
        if (!this.paused) {
            this.audio.play()
        }
    }

    nextTrack() {
        if (this.currentTrackID < this.playlist.tracks.length - 1) {
            this.setTrack(this.currentTrackID + 1)
        }
    }

    prevTrack() {
        if (this.currentTrackID > 0) {
            this.setTrack(this.currentTrackID - 1)
        }
    }

    close() {
        this.audio.pause()
        this.paused = true
        this.setTrack(0)
        this.container.classList.remove('maximized')
        const appPanel = document.querySelector('.content-active-apps .active-app-musicplayer')
        if (appPanel) appPanel.style.display = 'none'
    }

}