"""
System-level monitoring service for interview proctoring.
Tracks keyboard activity, mouse movement, and tab/window switching.
"""

import time
from threading import Lock, Thread
from pynput import keyboard, mouse
import pygetwindow as gw


class SystemMonitor:
    """
    Monitors system-level activities:
    - Keyboard input (typing detection)
    - Mouse movement
    - Tab/window switching
    """

    def __init__(self):
        # States
        self.keyboard_state = "Normal"
        self.mouse_state = "Normal"
        self.tab_state = "Same Tab"

        # Activity timestamps
        self.last_keyboard_activity = time.time()
        self.last_mouse_activity = time.time()
        self.last_active_window = None
        self.tab_switch_time = None

        # Thresholds (seconds)
        self.KEYBOARD_IDLE_THRESHOLD = 2.0
        self.MOUSE_IDLE_THRESHOLD = 3.0
        self.TAB_SWITCH_DISPLAY_DURATION = 2.0
        self.WINDOW_CHECK_INTERVAL = 0.5

        # Thread control
        self.running = False
        self.lock = Lock()

        # Listeners
        self.keyboard_listener = None
        self.mouse_listener = None

    # ---------------- WINDOW / TAB MONITOR ----------------

    def _window_monitor_loop(self):
        """Continuously monitor active window."""
        while self.running:
            try:
                win = gw.getActiveWindow()
                if win and win.title:
                    with self.lock:
                        if self.last_active_window is None:
                            self.last_active_window = win.title
                        elif win.title != self.last_active_window:
                            self.tab_state = "Switched"
                            self.tab_switch_time = time.time()
                            self.last_active_window = win.title
            except Exception:
                pass

            time.sleep(self.WINDOW_CHECK_INTERVAL)

    # ---------------- KEYBOARD ----------------

    def _on_keyboard_press(self, key):
        with self.lock:
            self.keyboard_state = "Typing"
            self.last_keyboard_activity = time.time()

    # ---------------- MOUSE ----------------

    def _on_mouse_move(self, x, y):
        with self.lock:
            self.mouse_state = "Moving"
            self.last_mouse_activity = time.time()

    def _on_mouse_click(self, x, y, button, pressed):
        if pressed:
            with self.lock:
                self.mouse_state = "Moving"
                self.last_mouse_activity = time.time()

    # ---------------- STATE UPDATE ----------------

    def _update_states(self):
        now = time.time()

        with self.lock:
            # Keyboard reset
            if now - self.last_keyboard_activity > self.KEYBOARD_IDLE_THRESHOLD:
                self.keyboard_state = "Normal"

            # Mouse reset
            if now - self.last_mouse_activity > self.MOUSE_IDLE_THRESHOLD:
                self.mouse_state = "Normal"

            # Tab reset
            if self.tab_state == "Switched" and self.tab_switch_time:
                if now - self.tab_switch_time > self.TAB_SWITCH_DISPLAY_DURATION:
                    self.tab_state = "Same Tab"
                    self.tab_switch_time = None

    # ---------------- PUBLIC METHODS ----------------

    def start(self):
        """Start all monitoring."""
        if self.running:
            return

        self.running = True

        # Keyboard listener
        self.keyboard_listener = keyboard.Listener(
            on_press=self._on_keyboard_press
        )
        self.keyboard_listener.start()

        # Mouse listener
        self.mouse_listener = mouse.Listener(
            on_move=self._on_mouse_move,
            on_click=self._on_mouse_click
        )
        self.mouse_listener.start()

        # Window monitor thread
        Thread(target=self._window_monitor_loop, daemon=True).start()

    def stop(self):
        """Stop monitoring."""
        self.running = False
        try:
            if self.keyboard_listener:
                self.keyboard_listener.stop()
            if self.mouse_listener:
                self.mouse_listener.stop()
        except Exception:
            pass

    def get_status(self):
        """Return current monitoring status."""
        self._update_states()
        with self.lock:
            return {
                "keyboard": self.keyboard_state,
                "mouse": self.mouse_state,
                "tab": self.tab_state
            }
