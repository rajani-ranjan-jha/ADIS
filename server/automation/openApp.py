import keyboard
import time
import subprocess

def OpenApp(appName: str):
    # first check if application is present in the device, if not then open its web app
    keyboard.press_and_release('win')
    time.sleep(0.5)
    keyboard.write(appName.lower())
    time.sleep(1)
    keyboard.press_and_release('enter')


# OpenApp("settings")
# OpenApp("notion")
# OpenApp('ms store')