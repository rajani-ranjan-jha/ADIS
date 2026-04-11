import sqlite3
import hashlib
import json
from datetime import datetime, timedelta
import os

# ─────────────────────────────────────────
#  CONFIG
# ─────────────────────────────────────────
DB_PATH = "assistant.db"


# ─────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")   # enforce FK constraints
    conn.row_factory = sqlite3.Row             # return dict-like rows
    return conn


def now(offset_minutes: int = 0) -> str:
    return (datetime.now() + timedelta(minutes=offset_minutes)).strftime(
        "%Y-%m-%d %H:%M:%S"
    )


# ─────────────────────────────────────────
#  TABLE CREATION
# ─────────────────────────────────────────
def create_tables(conn: sqlite3.Connection):

    # ── 1. USERS ─────────────────────────
    # Core identity of whoever is using the assistant.
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER  PRIMARY KEY AUTOINCREMENT,
            username      TEXT     UNIQUE,
            email         TEXT     NOT NULL UNIQUE,
            password_hash TEXT,
            full_name     TEXT,
            auth_provider TEXT,
            provider_id   TEXT,
            is_active     INTEGER  NOT NULL DEFAULT 1,   -- 1 = active, 0 = disabled
            created_at    TEXT     NOT NULL,
            updated_at    TEXT     NOT NULL
        )
    """)

    # ── 2. USER PREFERENCES ──────────────
    # One-to-one with users. Stores all personalisation knobs.
    conn.execute("""
        CREATE TABLE IF NOT EXISTS user_preferences (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id             INTEGER NOT NULL UNIQUE,
            preferred_voice     TEXT    NOT NULL DEFAULT 'default',   -- e.g. en-US-female
            wake_word           TEXT    NOT NULL DEFAULT 'hey nova',
            response_tone       TEXT    NOT NULL DEFAULT 'friendly',  -- friendly / formal / concise
            theme               TEXT    NOT NULL DEFAULT 'dark',      -- dark / light
            language            TEXT    NOT NULL DEFAULT 'en',
            speech_rate         REAL    NOT NULL DEFAULT 1.0,         -- 0.5 – 2.0
            volume              REAL    NOT NULL DEFAULT 0.8,         -- 0.0 – 1.0
            enable_sounds       INTEGER NOT NULL DEFAULT 1,
            updated_at          TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    # ── 3. APP SETTINGS ──────────────────
    # Global config / feature flags. Not tied to a specific user.
    conn.execute("""
        CREATE TABLE IF NOT EXISTS app_settings (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            key         TEXT    NOT NULL UNIQUE,   -- e.g. 'active_model', 'api_version'
            value       TEXT    NOT NULL,
            description TEXT,
            updated_at  TEXT    NOT NULL
        )
    """)

    # ── 4. SESSIONS ───────────────────────
    # Groups a set of messages into one logical conversation block
    # (e.g. "Morning session on 2025-01-10").
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id      INTEGER NOT NULL,
            title        TEXT    NOT NULL DEFAULT 'Untitled Session',
            started_at   TEXT    NOT NULL,
            ended_at     TEXT,
            is_active    INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    # ── 5. CONVERSATIONS ─────────────────
    # Every single exchange (user ➜ assistant) inside a session.
    conn.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id      INTEGER NOT NULL,
            user_id         INTEGER NOT NULL,
            input_type      TEXT    NOT NULL DEFAULT 'text',   -- 'text' | 'voice'
            user_message    TEXT    NOT NULL,
            assistant_reply TEXT    NOT NULL,
            intent          TEXT,     -- detected intent, e.g. 'weather_query'
            confidence      REAL,     -- model confidence score 0.0 – 1.0
            tokens_used     INTEGER,
            created_at      TEXT    NOT NULL,
            FOREIGN KEY (session_id) REFERENCES sessions(id)  ON DELETE CASCADE,
            FOREIGN KEY (user_id)    REFERENCES users(id)      ON DELETE CASCADE
        )
    """)

    # ── 6. MODEL2 COMMAND REGISTRY ───────
    # The "brain" of Model 2 — every command/automation it knows how to handle.
    conn.execute("""
        CREATE TABLE IF NOT EXISTS command_registry (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            command_name    TEXT    NOT NULL UNIQUE,   -- e.g. 'open_browser'
            trigger_phrases TEXT    NOT NULL,          -- JSON array of phrases
            action_type     TEXT    NOT NULL,          -- 'system' | 'api' | 'automation'
            handler_func    TEXT    NOT NULL,          -- Python function name to call
            parameters      TEXT,                     -- JSON schema of expected params
            description     TEXT,
            is_enabled      INTEGER NOT NULL DEFAULT 1,
            created_at      TEXT    NOT NULL,
            updated_at      TEXT    NOT NULL
        )
    """)

    # ── 7. COMMAND EXECUTION LOGS ────────
    # Every time Model 2 actually executes a command — success or failure.
    conn.execute("""
        CREATE TABLE IF NOT EXISTS command_logs (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER,               -- which message triggered it
            user_id         INTEGER NOT NULL,
            command_id      INTEGER NOT NULL,
            input_params    TEXT,                  -- JSON of what was passed
            status          TEXT    NOT NULL DEFAULT 'pending',  -- pending/success/failed
            error_message   TEXT,
            executed_at     TEXT    NOT NULL,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL,
            FOREIGN KEY (user_id)         REFERENCES users(id)          ON DELETE CASCADE,
            FOREIGN KEY (command_id)      REFERENCES command_registry(id)
        )
    """)

    # ── 8. FEEDBACK ──────────────────────
    # Optional thumbs up / down + freeform notes on any assistant reply.
    conn.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            user_id         INTEGER NOT NULL,
            rating          INTEGER NOT NULL,   -- 1 (thumbs up) | -1 (thumbs down)
            comment         TEXT,
            created_at      TEXT    NOT NULL,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id)         REFERENCES users(id)         ON DELETE CASCADE
        )
    """)

    conn.commit()
    print("[✔] All tables created.")


# ─────────────────────────────────────────
#  SEED DATA
# ─────────────────────────────────────────
def seed_data(conn: sqlite3.Connection):

    # ── 1. USERS ─────────────────────────
    users = [
        (
            "aryan_dev",
            "aryan@example.com",
            hash_password("aryan123"),
            "Aryan Sharma",
            "local",
            None,
            now(),
            now(),
        ),
        (
            "priya_test",
            "priya@example.com",
            hash_password("priya456"),
            "Priya Gupta",
            "local",
            None,
            now(-2),
            now(-2),
        ),
    ]
    conn.executemany(
        "INSERT OR IGNORE INTO users (username, email, password_hash, full_name, auth_provider, provider_id, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
        users,
    )

    # ── 2. USER PREFERENCES ──────────────
    prefs = [
        (1, "en-US-female", "hey nova",  "friendly", "dark",  "en", 1.0, 0.8, 1, now()),
        (2, "en-IN-male",   "hey buddy", "concise",  "light", "hi", 1.2, 0.9, 0, now()),
    ]
    conn.executemany(
        """INSERT OR IGNORE INTO user_preferences
           (user_id, preferred_voice, wake_word, response_tone, theme,
            language, speech_rate, volume, enable_sounds, updated_at)
           VALUES (?,?,?,?,?,?,?,?,?,?)""",
        prefs,
    )

    # ── 3. APP SETTINGS ──────────────────
    settings = [
        ("active_stt_model",   "whisper-base",       "Speech-to-text model in use",          now()),
        ("active_llm_model",   "gpt-4o-mini",        "LLM powering Model 1 intent detection", now()),
        ("active_model2",      "command-dispatcher", "Model 2 automation engine",             now()),
        ("max_session_tokens", "4096",               "Max tokens per session context",        now()),
        ("api_version",        "v1",                 "Internal API version",                  now()),
        ("debug_mode",         "false",              "Enable verbose logging",                now()),
    ]
    conn.executemany(
        "INSERT OR IGNORE INTO app_settings (key, value, description, updated_at) VALUES (?,?,?,?)",
        settings,
    )

    # ── 4. SESSIONS ───────────────────────
    sessions = [
        (1, "Morning Catch-up",  now(-120), now(-60), 0),
        (1, "Evening Automation", now(-30), None,     1),
        (2, "Quick Test Run",    now(-90),  now(-80), 0),
    ]
    conn.executemany(
        "INSERT OR IGNORE INTO sessions (user_id, title, started_at, ended_at, is_active) VALUES (?,?,?,?,?)",
        sessions,
    )

    # ── 5. CONVERSATIONS ─────────────────
    conversations = [
        (1, 1, "voice", "What is the weather today?",
         "It's 28°C and sunny in your area today!",
         "weather_query", 0.97, 120, now(-118)),

        (1, 1, "text", "Set a reminder for 5 PM.",
         "Sure! Reminder set for 5:00 PM today.",
         "set_reminder", 0.95, 95, now(-115)),

        (2, 1, "voice", "Open Chrome and go to YouTube.",
         "Opening Chrome and navigating to YouTube now.",
         "open_app_url", 0.99, 80, now(-28)),

        (3, 2, "text", "Tell me a joke.",
         "Why don't scientists trust atoms? Because they make up everything! 😄",
         "general_chat", 0.88, 140, now(-88)),
    ]
    conn.executemany(
        """INSERT OR IGNORE INTO conversations
           (session_id, user_id, input_type, user_message, assistant_reply,
            intent, confidence, tokens_used, created_at)
           VALUES (?,?,?,?,?,?,?,?,?)""",
        conversations,
    )

    # ── 6. COMMAND REGISTRY ──────────────
    commands = [
        (
            "open_application",
            json.dumps(["open", "launch", "start", "run"]),
            "system",
            "handle_open_application",
            json.dumps({"app_name": "string"}),
            "Opens a desktop application by name.",
            now(), now(),
        ),
        (
            "open_app_url",
            json.dumps(["go to", "open browser", "navigate to", "visit"]),
            "system",
            "handle_open_url",
            json.dumps({"app": "string", "url": "string"}),
            "Opens a browser and navigates to a URL.",
            now(), now(),
        ),
        (
            "set_reminder",
            json.dumps(["remind me", "set a reminder", "alert me at"]),
            "automation",
            "handle_set_reminder",
            json.dumps({"time": "string", "message": "string"}),
            "Sets a timed reminder notification.",
            now(), now(),
        ),
        (
            "weather_query",
            json.dumps(["weather", "temperature", "forecast", "will it rain"]),
            "api",
            "handle_weather_query",
            json.dumps({"location": "string|null"}),
            "Fetches current weather for a location.",
            now(), now(),
        ),
        (
            "system_volume",
            json.dumps(["volume up", "volume down", "mute", "set volume"]),
            "system",
            "handle_volume_control",
            json.dumps({"action": "string", "level": "int|null"}),
            "Controls system audio volume.",
            now(), now(),
        ),
        (
            "general_chat",
            json.dumps(["tell me", "what is", "explain", "how do"]),
            "api",
            "handle_general_chat",
            json.dumps({"query": "string"}),
            "Handles free-form conversation via the LLM.",
            now(), now(),
        ),
    ]
    conn.executemany(
        """INSERT OR IGNORE INTO command_registry
           (command_name, trigger_phrases, action_type, handler_func,
            parameters, description, created_at, updated_at)
           VALUES (?,?,?,?,?,?,?,?)""",
        commands,
    )

    # ── 7. COMMAND LOGS ──────────────────
    logs = [
        (1, 1, 4, json.dumps({"location": "auto"}),      "success", None,                   now(-118)),
        (2, 1, 3, json.dumps({"time": "17:00", "message": "Work done!"}), "success", None,  now(-115)),
        (3, 1, 2, json.dumps({"app": "chrome", "url": "youtube.com"}),    "success", None,  now(-28)),
        (None, 2, 1, json.dumps({"app_name": "spotify"}), "failed",
         "App 'spotify' not found on system.", now(-85)),
    ]
    conn.executemany(
        """INSERT OR IGNORE INTO command_logs
           (conversation_id, user_id, command_id, input_params, status, error_message, executed_at)
           VALUES (?,?,?,?,?,?,?)""",
        logs,
    )

    # ── 8. FEEDBACK ──────────────────────
    feedback = [
        (1, 1,  1, "Spot on, loved it!",         now(-117)),
        (2, 1,  1, None,                          now(-114)),
        (4, 2, -1, "Expected something funnier.", now(-87)),
    ]
    conn.executemany(
        "INSERT OR IGNORE INTO feedback (conversation_id, user_id, rating, comment, created_at) VALUES (?,?,?,?,?)",
        feedback,
    )

    conn.commit()
    print("[✔] Seed data inserted.")


# ─────────────────────────────────────────
#  QUICK VERIFY — print row counts
# ─────────────────────────────────────────
def verify(conn: sqlite3.Connection):
    tables = [
        "users", "user_preferences", "app_settings",
        "sessions", "conversations",
        "command_registry", "command_logs", "feedback",
    ]
    print("\n── Row counts ───────────────────────")
    for t in tables:
        row = conn.execute(f"SELECT COUNT(*) as cnt FROM {t}").fetchone()
        print(f"  {t:<22} → {row['cnt']} row(s)")
    print("─────────────────────────────────────\n")


# ─────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────
# if __name__ == "__main__":
#     db_exists = os.path.exists(DB_PATH)
#     conn = get_connection()

#     create_tables(conn)

#     if not db_exists:
#         seed_data(conn)
#     else:
#         print("[i] DB already exists — skipping seed to avoid duplicates.")
#         print("    Delete 'assistant.db' and re-run to reseed.")

#     verify(conn)
#     conn.close()
#     print(f"[✔] Database ready → {DB_PATH}")