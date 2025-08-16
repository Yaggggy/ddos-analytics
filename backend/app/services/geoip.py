# import geoip2.database
# import os

# DB_PATH = os.path.join("geoip_db", "GeoLite2-City.mmdb")
# reader = geoip2.database.Reader(DB_PATH)

# def lookup(ip: str):
#     try:
#         resp = reader.city(ip)
#         return {
#             "country": resp.country.name,
#             "lat": resp.location.latitude,
#             "lon": resp.location.longitude
#         }
#     except:
#         return {}


import geoip2.database
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "geoip_db", "GeoLite2-City.mmdb")
reader = geoip2.database.Reader(DB_PATH)

def lookup(ip: str):
    try:
        r = reader.city(ip)
        return {
            "country": r.country.name,
            "lat": r.location.latitude,
            "lon": r.location.longitude
        }
    except:
        return {}
