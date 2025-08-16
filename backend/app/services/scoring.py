def risk_score(abuse_conf: float, requests: float, mb: float):
    score = abuse_conf * 0.6 + requests * 0.3 + mb * 0.1
    if score > 80:
        level = "critical"
    elif score > 50:
        level = "high"
    elif score > 20:
        level = "medium"
    else:
        level = "low"
    return score, level
