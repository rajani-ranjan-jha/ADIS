import webbrowser
import subprocess

def OpenSite(url: str):
    try:
        webbrowser.open(url)
    except Exception as e:
        print(e)
        
def OpenSiteByBrowser():
    "Open url by specifying browser. default: default browser of the system"
    pass

    
# OpenSite('youtube.com')