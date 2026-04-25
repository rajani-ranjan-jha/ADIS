import webbrowser

def handle_open_site(url: str):
    try:
        webbrowser.open(url)
    except Exception as e:
        print(e)
        
def handle_open_site_by_browser(url: str, browser: str):
    "Open url by specifying browser. default: default browser of the system"
    try:
        webbrowser.open(url, browser)
    except Exception as e:
        print(e)

    
# handle_open_site('youtube.com')
# handle_open_site_by_browser('youtube.com', 'chrome')
# handle_open_site_by_browser('youtube.com', 'msedge')
# handle_open_site_by_browser('youtube.com', 'firefox')
# handle_open_site_by_browser('youtube.com', 'opera')
# handle_open_site_by_browser('youtube.com', 'brave')
# handle_open_site_by_browser('youtube.com', 'edge')