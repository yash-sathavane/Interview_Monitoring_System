"""
Flask API server for system monitoring service.
Exposes /system-status endpoint for React frontend.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import time
from system_monitor import SystemMonitor

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global monitor instance
monitor = None
monitor_thread = None


def initialize_monitor():
    """Initialize and start the system monitor."""
    global monitor
    monitor = SystemMonitor()
    monitor.start()
    print("System monitor started successfully")


@app.route('/system-status', methods=['GET'])
def get_system_status():
    """
    Get current system status.
    Returns JSON with keyboard, mouse, and tab status.
    """
    if monitor is None:
        return jsonify({
            "error": "Monitor not initialized",
            "keyboard": "Unknown",
            "mouse": "Unknown",
            "tab": "Unknown"
        }), 500
    
    try:
        status = monitor.get_status()
        return jsonify(status)
    except Exception as e:
        return jsonify({
            "error": str(e),
            "keyboard": "Error",
            "mouse": "Error",
            "tab": "Error"
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok", "monitor_active": monitor is not None})


@app.route('/start-monitor', methods=['POST'])
def start_monitor():
    """Manually start the monitor (if not already started)."""
    global monitor
    if monitor is None:
        initialize_monitor()
        return jsonify({"status": "Monitor started"})
    return jsonify({"status": "Monitor already running"})


@app.route('/stop-monitor', methods=['POST'])
def stop_monitor():
    """Stop the monitor."""
    global monitor
    if monitor:
        monitor.stop()
        monitor = None
        return jsonify({"status": "Monitor stopped"})
    return jsonify({"status": "Monitor not running"})


if __name__ == '__main__':
    # Initialize monitor on startup
    initialize_monitor()
    
    # Run Flask app
    print("Starting Flask server on http://localhost:5000")
    print("API Endpoints:")
    print("  GET  /system-status - Get current system status")
    print("  GET  /health - Health check")
    print("  POST /start-monitor - Start monitoring")
    print("  POST /stop-monitor - Stop monitoring")
    
   #  app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)

    app.run(host='127.0.0.1', port=5000, debug=False)
