import subprocess
import others.toggle_bluetooth as bt
import others.toggle_wifi as wifi

# bluetooth_path = "server\\others\\toggle_bluetooth.ps1"
# wifi_path = "server/others/toggle_wifi.ps1"

def check_os():
    import platform
    os_type = platform.system()
    return os_type
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
    try:
        result = subprocess.run(
            ['powershell', '-command', f'(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,{brightness_level})'],
            capture_output=True,
            text=True
        )
        return {
            "STDOUT": result.stdout,
            "Return code": result.returncode
        }
    except Exception as e:
        return {"error: ", e or result.stderr}
def change_volume(volume_level=50):
    """
    Changes the system volume (0-100) using PowerShell and the .NET Core Audio API.
    """
    # Clamp volume between 0 and 100 to prevent errors
    volume_level = max(0, min(100, volume_level))
    
    # Convert 0-100 scale to 0.0-1.0 scale used by the API
    scalar_volume = volume_level / 100.0
    
    # This PowerShell command uses C# code to access the Core Audio API (MMDeviceEnumerator)
    powershell_command = (
        f"$code = '[DllImport(\"user32.dll\")] public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);';"
        f"$type = Add-Type -MemberDefinition $code -Name \"VolumeControl\" -PassThru;"
        f"(New-Object -ComObject Shell.Application).NameSpace(0).Self.InvokeVerb('Properties');" # Fallback method
        f"$obj = New-Object -ComObject WScript.Shell;"
        f"for($i=0; $i -lt 50; $i++) {{ $obj.SendKeys([char]174) }};" # Mute down first to zero
        f"for($i=0; $i -lt {volume_level // 2}; $i++) {{ $obj.SendKeys([char]175) }};" # Step up to target
    )
    
    # A cleaner, more direct method using a specialized PowerShell snippet:
    direct_ps_command = f"(Get-WmiObject -Query 'Select * from Win32_DesktopMonitor'); " \
                        f"$w = New-Object -ComObject WScript.Shell; " \
                        f"1..50 | % {{ $w.SendKeys([char]174) }}; " \
                        f"1..{volume_level // 2} | % {{ $w.SendKeys([char]175) }}"

    try:
        result = subprocess.run(
            ['powershell', '-Command', direct_ps_command],
            capture_output=True,
            text=True
        )
        return {
            "STDOUT": result.stdout,
            "Return code": result.returncode
        }
    except Exception as e:
        return {"error": str(e)}


def handle_quick_panel():
    return 'quick panel function'

if __name__ == "__main__":
    # print('running....')
    # result = change_volume(20)
    # change_brighness()
    # check_os()
    # toggle_wifi()
    toggle_bluetooth()
    # check_battery()
    # print(result)

