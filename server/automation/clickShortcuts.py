import keyboard

KeyShortcuts = {
    'settings':'windows+i',
    'close app':'f4',# may have issue
    'reload':'ctrl+r',
    'switch':'alt+tab',
    'search':'alt+space',
    'file-explorer':'windows+e',
    'desktop':'windows+d',
    'run':'windows+r',
    'lock':'windows+l',
    'task manager':'ctrl+shift+esc',
    'screenshot':'windows+shift+s',
    'screen recording':'windows+alt+r',
    'copy':'ctrl+c',
    'paste':'ctrl+v',
    'cut':'ctrl+x',
    'undo':'ctrl+z',
    'redo':'ctrl+y',
    'select all':'ctrl+a',
    'new tab':'ctrl+t',
    'close tab':'ctrl+w',
    'refresh':'f5',
    'print screen':'print_screen',
    'volume up':'volume up',
    'volume down':'volume down',
    'mute':'volume mute',
    'play/pause':'play/pause media',
    'next track':'next track',
    'previous track':'previous track',
    'increase brightness':'brightness up',
    'decrease brightness':'brightness down',
    'home':'home',
    'end':'end',
    'page up':'page up',
    'page down':'page down',
    'insert':'insert',
    'delete':'delete',
    'escape':'esc',
    'caps lock':'caps lock',
    'num lock':'num lock',
    'maximize': 'windows + up',
    'minimize': 'windows + down'
}

def clickShortcut(shortcut):
    try:
        keyboard.press_and_release(shortcut)
    except Exception as e:
        print(e)
        
# clickShortcut('windows+a')
clickShortcut('volume mute')
# clickShortcut('windows + down')
# clickShortcut('increase brightness')