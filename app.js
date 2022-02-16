// Example of init part
import { Notepad } from 'https://antonkrutikov.github.io/webflow-miniapps/notepad.js'
import {WindowManager} from 'https://antonkrutikov.github.io/webflow-miniapps/window.js'
import {MusicPlayer} from 'https://antonkrutikov.github.io/webflow-miniapps/musicplayer.js'
import { Paint } from 'https://antonkrutikov.github.io/webflow-miniapps/paint.js'


window.addEventListener('load', e => {
    const wm = new WindowManager()
    wm.init()
    // Increace window zIndex when clicked on bottom bar or double clicked icon
    wm.makeTopLevelOn([
        {window: '.ui_window_notepad', targets: ['.ui_icon__notepad', '.active-app-notepad']},
        {window: '.ui_window_music', targets: ['.ui_icon__music-player', '.active-app-musicplayer']},
        {window: '.ui_window_paint', targets: ['.ui_icon__paint', '.active-app-paint']},
    ])

    const notepad = new Notepad('.ui_window_notepad')

    const playlist = {
        artist: 'Peacemaker OST',
        tracks: [
            {src: 'https://antonkrutikov.github.io/webflow-miniapps/mp3/Wig_Wam_-_Do_Ya_Wanna_Taste_It_(musmore.com).mp3', title: 'Do Ya Wanna Taste It'},
            {src: 'https://antonkrutikov.github.io/webflow-miniapps/mp3/The_Quireboys_-_I_Dont_Love_You_Anymore_(musmore.com).mp3', title: 'I Dont Love You Anymore'},
            {src: 'https://antonkrutikov.github.io/webflow-miniapps/mp3/foxy_shazam_welcome_to_the_church_of_rock_and_roll_(NaitiMP3.ru).mp3', title: 'Welcome to the church of Rock and Roll'},
        ]
    }
    const musicplayer = new MusicPlayer('.ui_window_music', playlist)

    // Default config passed for example
    const paint = new Paint('.ui_window_paint', {
        pencilSize: 1,
        eraserSize: 8,
        font: '14px "Ms sans serif 8pt"',
        lineHeight: 16
    })
})