import keyboard
import subprocess
import time
import os

def open_notepad():
    """Opens Notepad."""
    try:
        subprocess.Popen(["notepad.exe"])
        print("Notepad opened successfully.")
        return True
    except Exception as e:
        print(f"Error opening Notepad: {e}")
        return False

def open_clock():
    """Opens the Windows Clock app."""
    try:
        # Using 'ms-clock:' protocol handler
        subprocess.Popen(["start", "ms-clock:"], shell=True)
        print("Clock app opened successfully.")
        return True
    except Exception as e:
        print(f"Error opening Clock: {e}")
        return False

def write_note(text):
    """Opens Notepad and types the given text."""
    try:
        # Open Notepad
        p = subprocess.Popen(["notepad.exe"])
        time.sleep(1) # Wait for Notepad to open
        
        # Send keystrokes
        # This is a simple way for short text. For complex input, use pywinauto.
        subprocess.run('echo ' + text + ' | clip', shell=True)
        subprocess.run('notepad.exe', shell=True)
        time.sleep(0.5)
        subprocess.run('ctrl+v', shell=True)
        
        print(f"Note written: {text}")
        return True
    except Exception as e:
        print(f"Error writing note: {e}")
        return False

def set_timer(minutes):
    """Attempts to set a timer using the Clock app (limited by Windows API)."""
    # Windows Clock app doesn't support direct command-line timer creation.
    # We can open the app and navigate to the timer tab.
    try:
        subprocess.Popen(["start", "ms-clock:"], shell=True)
        print(f"Clock app opened. Please manually set timer for {minutes} minutes.")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

# if __name__ == "__main__":
    # Example usage
    # open_notepad()
    # open_clock()
    # write_note("Remember to buy milk.")
    # set_timer(10)

def rajani(text):
    import keyboard
    from automation.openApp import OpenApp
    OpenApp('notepad')
    time.sleep(2)
    keyboard.write(text)
    

# rajani('this is just a test of notepad automation by me')