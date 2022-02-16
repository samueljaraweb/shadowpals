export class WindowManager {
    static windows = []
    static zIndex = 100

    constructor(selector = '.ui-window') {
        this.selector = selector
    }

    init() {
        document.querySelectorAll(this.selector).forEach(w => {

            // Collect all windows from page and add state
            w.state = {}
            WindowManager.windows.push(w)

            // zIndexing
            this.zIndexing(w)
            // Draggable
            this.makeDraggable(w)
            // Buttons animation and events stop
            this.decorateButtons(w)
            // Maximize
            this.allowMaximize(w)
            // Close
            this.cleanOnClose(w)
        })
    }

    zIndexing(w) {
        w?.addEventListener('mousedown', e => {
            w.style.zIndex = WindowManager.zIndex++
        })
    }

    clampX(n) {
        return Math.min(Math.max(n, 0), window.innerWidth)
    }

    clampY(n) {
        return Math.min(Math.max(n, 0), window.innerHeight);
    }

    makeDraggable(w) {
        let head = w?.querySelector('.head-ui-window')

        head?.addEventListener('mousedown', e => {
            if (!w.state.maximized) {
                const rect = w.getBoundingClientRect()
                w.state.is_dragging = true
                w.state.x_diff = e.pageX - rect.left
                w.state.y_diff = e.pageY - rect.top
            }
        })

        document.addEventListener('mouseleave', e => { w.state.is_dragging = false })
        document.addEventListener('mouseup', e => { w.state.is_dragging = false })
        document.addEventListener('mousemove', e => {
            if (w.state.is_dragging === true) {
                w.style.left = `${this.clampX(e.pageX - w.state.x_diff, w)}px`
                w.style.top = `${this.clampY(e.pageY - w.state.y_diff, w)}px`
            }
        })

    }

    decorateButtons(w) {
        const minimize = w.querySelector('.ui_window__head__minimize')
        const maximize = w.querySelector('.ui_window__head__maximize')
        const close = w.querySelector('.ui_window__head__close')
        const buttons = [minimize, maximize, close]
        buttons.forEach(b => {
            if (b) {
                b.addEventListener('mousedown', e => {
                    e.stopPropagation()
                    b.classList.add('button-pushed')
                })
                b.addEventListener('dblclick', e => {
                    e.stopPropagation()
                })
                document.addEventListener('mouseup', e => {
                    b.classList.remove('button-pushed')
                })
                b.addEventListener('mouseleave', e => {
                    b.classList.remove('button-pushed')
                })
            }
        })
    }

    allowMaximize(w) {
        const btn = w.querySelector('.ui_window__head__maximize')
        const img = btn?.querySelector('img')
        const head = w.querySelector('.head-ui-window')

        btn?.addEventListener('click', e => {
            this.maximize(w, btn, img)
        })

        head?.addEventListener('dblclick', e => {
            this.maximize(w, btn, img)
        })
    }

    maximize(w, btn, img) {
        if (!img?.classList.contains('button-disabled')) {
            w.classList.add('transition_maximize')
            setTimeout(() => {
                w.classList.remove('transition_maximize')
            }, 500)

            if (!w.classList.contains('maximized')) {
                const rect = w.getBoundingClientRect()
                w.style.width = rect.width+'px'
                w.style.height = rect.height+'px'
                setTimeout(() => {
                    w.classList.add('maximized')
                    w.classList.add('no-resize')
                }, 10)
            } else {
                w.classList.remove('maximized')
                w.classList.remove('no-resize')
            }
        }
    }

    makeTopLevelOn(windows) {
        windows.forEach(w => {
            const window = document.querySelector(w.window)
            if (window) {
                w.targets?.forEach(selector => {
                    const t = document.querySelector(selector)
                    if (t && selector.includes('ico')) {
                        t?.addEventListener('dblclick', e => {
                            window.style.zIndex = WindowManager.zIndex++
                        })
                    } else if (t) {
                        t?.addEventListener('click', e => {
                            window.style.zIndex = WindowManager.zIndex++
                        })
                    }
                })
            }
        })
    }

    cleanOnClose(w) {
        const close = w.querySelector('.ui_window__head__close')
        close?.addEventListener('click', e => {
            w.classList.remove('maximized')
        })
    }
}