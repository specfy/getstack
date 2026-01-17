
#!/bin/bash

# Disk usage monitor script
# Usage: ./disk-monitor.sh [threshold_percent] [email]
# Example: ./disk-monitor.sh 85 admin@example.com

THRESHOLD=${1:-85}  # Default 85%
EMAIL=${2:-""}       # Optional email for alerts

# Get root filesystem usage percentage
USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

# Get available space
AVAILABLE=$(df -h / | awk 'NR==2 {print $4}')

# Get used space
USED=$(df -h / | awk 'NR==2 {print $3}')

# Get total space
TOTAL=$(df -h / | awk 'NR==2 {print $2}')

# Log file
LOG_FILE="/var/log/disk-monitor.log"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to send email alert
send_alert() {
    local subject="Disk Usage Alert: ${USAGE}% used on $(hostname)"
    local body="Warning: Disk usage is at ${USAGE}% (${USED} used of ${TOTAL}, ${AVAILABLE} available)

Threshold: ${THRESHOLD}%

Top 10 directories by size:
$(du -h --max-depth=1 / 2>/dev/null | sort -hr | head -10)

Please free up disk space soon."

    if [ -n "$EMAIL" ]; then
        echo "$body" | mail -s "$subject" "$EMAIL" 2>/dev/null || log_message "Failed to send email to $EMAIL"
    fi

    log_message "ALERT: Disk usage is ${USAGE}% (threshold: ${THRESHOLD}%)"
}

# Check if usage exceeds threshold
if [ "$USAGE" -ge "$THRESHOLD" ]; then
    send_alert
    exit 1
else
    log_message "OK: Disk usage is ${USAGE}% (below threshold of ${THRESHOLD}%)"
    exit 0
fi
