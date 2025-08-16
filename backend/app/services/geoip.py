import geoip2.database
import os

# Absolute path to the database file
DB_PATH = os.path.join(os.path.dirname(__file__), "geoip_db", "GeoLite2-City.mmdb")

reader = geoip2.database.Reader(DB_PATH)

def lookup(ip: str):
    try:
        response = reader.city(ip)
        return {
            "country": response.country.name,
            "lat": response.location.latitude,
            "lon": response.location.longitude
        }
    except:
        return None
