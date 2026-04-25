from automation.open_app import handle_open_app
from automation.open_site import handle_open_site
from automation.click_shortcut import handle_click_shortcuts
from automation.get_current import handle_get_current
from automation.quick_panel import handle_quick_panel
from automation.search_file import handle_search_file
from automation.web_search import handle_web_search
from automation.message_chatbot import handle_message_chatbot

INTENT_REGISTRY = {
    "open_app":     handle_open_app,
    "open_site":    handle_open_site,
    "click_shortcuts":handle_click_shortcuts,
    # "control_app": handle_control_app,
    "get_current": handle_get_current,
    "quick_panel": handle_quick_panel,
    "search_file": handle_search_file,
    "web_search":   handle_web_search,
    "general_query": handle_message_chatbot
}

def fallback_response(intent):
    return {
        "status": "error",
        "message": f"I don't know how to handle the intent '{intent}'.",
        "intent": intent,
        "available_intents": list(INTENT_REGISTRY.keys())
    }

def dispatch(intent_result: dict):
    intent = intent_result.get("intent")
    entities = intent_result.get("entities", {})
    
    handler = INTENT_REGISTRY.get(intent)
    
    if handler:
        return handler(**entities)
    else:
        return fallback_response(intent)