# OWASP ZAP Scanning Guide

## Scan Types

| Scan | Purpose | Duration | Impact |
|------|---------|----------|--------|
| Spider | Discover pages/endpoints | Minutes | None |
| Passive Scan | Analyze responses | Real-time | None |
| Active Scan | Test for vulnerabilities | Hours | May modify data |
| Ajax Spider | JavaScript-heavy apps | Minutes | None |

## ZAP CLI Commands

```bash
# Start ZAP in daemon mode
zap.sh -daemon -port 8080

# Spider a target
zap-cli spider https://target.example.com

# Run active scan
zap-cli active-scan https://target.example.com

# Generate report
zap-cli report -o report.html -f html
```

## ZAP API (Python)

```python
from zapv2 import ZAPv2

zap = ZAPv2(apikey='your-api-key', proxies={'http': 'http://127.0.0.1:8080'})

# Spider
zap.spider.scan('https://target.example.com')

# Active scan
zap.ascan.scan('https://target.example.com')

# Get alerts
alerts = zap.core.alerts()
```
