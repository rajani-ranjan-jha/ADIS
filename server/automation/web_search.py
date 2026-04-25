# from config.config import TAVILY_API_KEY
from tavily import TavilyClient
from config.config import TAVILY_API_KEY

try:
    tavily_client = TavilyClient(api_key=TAVILY_API_KEY)
    response = tavily_client.search("What is gdp of usa?")
    print(response['results'])
except Exception as e:
    print(e)

def handle_web_search():
    return 'web search function'