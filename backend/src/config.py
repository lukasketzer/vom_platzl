import os
import redis
from dotenv import load_dotenv

load_dotenv()

# TODO: eigenes file / service für redis client, lieber mongoDB anstelle Redis.
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

# stores to be excluded from results
BLACKLIST = {
    "lidl",
    "aldi",
    "mcdonald's",
    "starbucks",
    "subway",
    "kfc",
    "burger king",
    "ikea",
    "h&m",
    "zara",
    "mediamarkt",
    "saturn",
    "dm",
    "rossmann",
    "edeka",
    "rewe",
    "netto",
    "decathlon",
    "kaufland",
    "penny",
    "norma",
    "obi",
    "bauhaus",
    "toom",
}

BLACKLIST = {} # Currently disabled

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
