export class Notepad {
    constructor(selector, hideOnClose) {
        this.container = document.querySelector(selector)

        this.createTextarea()
        this.assignMenu()
        this.focusOnStart()
    }

    createTextarea() {
        const section = this.container.querySelector('.wf-section')
        this.textarea = document.createElement('textarea')
        this.textarea.classList.add('notepad-textarea')

        if (section) section.replaceWith(this.textarea)
    }

    focusOnStart() {
        const ico = document.querySelector('.ui_icon__notepad')
        ico?.addEventListener('dblclick', e => {
            this.textarea.focus()
        })
    }

    assignMenu() {
        this.container.querySelectorAll('.ui_menu_file_row').forEach(a => {
            a.setAttribute('draggable', 'false')
        })
        const newFile = this.container.querySelector('.ui_menu_new')
        const saveFile = this.container.querySelector('.ui_menu_save')
        const saveFileAs = this.container.querySelector('.ui_menu_save_as')
        const quit = this.container.querySelector('.ui_menu_quit')
        const all = [newFile, saveFile, saveFileAs, quit]
        const menu = this.container.querySelector('.ui_menu_file')
        all.forEach(m => {
            m?.addEventListener('click', e => {
                e.preventDefault()
                menu?.parentElement?.dispatchEvent(new Event('w-close'))
            })
        })

        newFile?.addEventListener('click', e => {
            this.textarea.value = ''
        })

        saveFile?.addEventListener('click', e => { this.save() })
        saveFileAs?.addEventListener('click', e => { this.save() })
        quit?.addEventListener('click', e => { this.close()})
    }

    save() {
        let data = new Blob([this.textarea.value], { type: 'text/plain' })
        let a = document.createElement('a')
        a.href = window.URL.createObjectURL(data)
        a.download = 'document.txt'
        a.click()
    }

    close() {
        this.textarea.value = ''
        this.container.classList.remove('maximized')
        const appPanel = document.querySelector('.content-active-apps .active-app-notepad')
        if (appPanel) appPanel.style.display = 'none'
    }
}