
# How to host:

You can clone this repo, make it github page and source in webflow HTML Embeded element.

Put this script in HTML Embeded element, do changes in configs if needed.
Don't forget to change import to full paths of your repo.

Also link `app.css`

```js
import { Notepad } from './notepad.js'
import {WindowManager} from './window.js'
import {MusicPlayer} from './musicplayer.js'
import { Paint } from './paint.js'

window.addEventListener('load', e => {
    const wm = new WindowManager()
    wm.init()

    const notepad = new Notepad('.ui_window_notepad')

    const playlist = {
        artist: 'Peacemaker OST',
        tracks: [
            {src: 'https://jsapps.13m.space/mp3/Wig_Wam_-_Do_Ya_Wanna_Taste_It_(musmore.com).mp3', title: 'Do Ya Wanna Taste It'},
            {src: 'https://jsapps.13m.space/mp3/The_Quireboys_-_I_Dont_Love_You_Anymore_(musmore.com).mp3', title: 'I Dont Love You Anymore'},
            {src: 'https://jsapps.13m.space/mp3/foxy_shazam_welcome_to_the_church_of_rock_and_roll_(NaitiMP3.ru).mp3', title: 'Welcome to the church of Rock and Roll'},
        ]
    }
    const musicplayer = new MusicPlayer('.ui_window_music', playlist)

    const paint = new Paint('.ui_window_paint', {
        pencilSize: 1,
        eraserSize: 8,
        font: '14px "Ms sans serif 8pt"',
        lineHeight: 16
    })
})
``