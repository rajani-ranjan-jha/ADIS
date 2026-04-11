import subprocess
def check_os():
    import platform
    os_type = platform.system()
    print(os_type)
def toggle_BT():
    # Run the PowerShell script
    result = subprocess.run(
        ['powershell', '-ExecutionPolicy', 'Bypass', '-File', "F:\\ADIS\\backend\\toggle_bluetooth.ps1"],
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
        ['powershell', '-ExecutionPolicy', 'Bypass', '-File', "F:\\ADIS\\backend\\toggle_wifi.ps1"],
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
    # print("Battery charge remaining:", battery)
    # print("STDERR:", result.stderr)
    # print("Return code:", result.returncode)
    return battery
def toggle_vpn():
    pass
def toggle_notification_center():
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
check_os()
