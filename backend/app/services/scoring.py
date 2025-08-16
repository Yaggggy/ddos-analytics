def risk_score(abuse_confidence: float, requests: float, bytes: float):
    score = abuse_confidence * 0.6 + requests * 0.3 + bytes * 0.1
    level = "Low"
    if score > 75:
        level = "Critical"
    elif score > 50:
        level = "High"
    elif score > 25:
        level = "Medium"
    return score, level
