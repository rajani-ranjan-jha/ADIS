import subprocess
import others.toggle_bluetooth as bt
import others.toggle_wifi as wifi

# bluetooth_path = "server\\others\\toggle_bluetooth.ps1"
# wifi_path = "server/others/toggle_wifi.ps1"

def check_os():
    import platform
    os_type = platform.system()
    print(os_type)
def toggle_bluetooth():
    # Run the PowerShell script
    result = subprocess.run(
        ['powershell', '-ExecutionPolicy', 'Bypass', '-File', bt.bluetooth_path],
        capture_output=True,
        text=True
    )

    # Print the output
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
    print("Return code:", result.returncode)
def toggle_wifi():
    # Run the PowerShell script
    result = subprocess.run(
        ['powershell', '-ExecutionPolicy', 'Bypass', '-File', wifi.wifi_path],
        capture_output=True,
        text=True
    )

    # Print the output
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
    print("Return code:", result.returncode)
def check_battery():
    # Run the PowerShell command
    result = subprocess.run(
        ['powershell', '-command', '(Get-WmiObject Win32_Battery).EstimatedChargeRemaining'],
        capture_output=True,
        text=True
    )

    # Print the output
    battery = result.stdout.strip() + '%'
    print("Battery charge remaining:", battery)
    # print("STDERR:", result.stderr)
    # print("Return code:", result.returncode)
    # return battery
def toggle_vpn():
    pass
def toggle_notification_center():
    # TODO: use the command 'windows+n' in clickShortcuts.py
    pass
def change_brighness(brightness_level = 70):
    # Run the PowerShell command
    result = subprocess.run(
        ['powershell', '-command', f'(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,{brightness_level})'],
        capture_output=True,
        text=True
    )

    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
    print("Return code:", result.returncode)
def change_volume(volume_level = 50):
    pass


# change_brighness()
# check_os()
# toggle_wifi()
check_battery()
