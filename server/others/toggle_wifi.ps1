Add-Type -AssemblyName System.Runtime.WindowsRuntime
[void][Windows.Devices.Radios.Radio,Windows.System.Devices,ContentType=WindowsRuntime]
[void][Windows.Devices.Radios.RadioState,Windows.System.Devices,ContentType=WindowsRuntime]

# WinRT async calls return COM objects - must invoke AsTask() via reflection
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and
    $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
})[0]

function Await($WinRtTask, $ResultType) {
    $task = $asTaskGeneric.MakeGenericMethod($ResultType).Invoke($null, @($WinRtTask))
    $task.Wait(-1) | Out-Null
    return $task.Result
}

$radios = Await ([Windows.Devices.Radios.Radio]::GetRadiosAsync()) ([System.Collections.Generic.IReadOnlyList[Windows.Devices.Radios.Radio]])

$found = $false
foreach ($radio in $radios) {
    if ($radio.Kind -eq 'WiFi') {
        $found = $true
        if ($radio.State -eq 'On') {
            Await ($radio.SetStateAsync([Windows.Devices.Radios.RadioState]::Off)) ([Windows.Devices.Radios.RadioAccessStatus]) | Out-Null
            Write-Host "WiFi was ON -> toggled OFF"
        } else {
            Await ($radio.SetStateAsync([Windows.Devices.Radios.RadioState]::On)) ([Windows.Devices.Radios.RadioAccessStatus]) | Out-Null
            Write-Host "WiFi was OFF -> toggled ON"
        }
    }
}

if (-not $found) { Write-Host "No WiFi radio found." }