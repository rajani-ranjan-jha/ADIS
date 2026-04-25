import keyboard
import time

def handle_open_app(appName: str):
    # first check if application is present in the device, if not then open its web app
    keyboard.press_and_release('win')
    time.sleep(0.5)
    keyboard.write(appName.lower())
    time.sleep(1)
    keyboard.press_and_release('enter')


# handle_open_app("settings")
# handle_open_app("notion")
# handle_open_app('ms store')