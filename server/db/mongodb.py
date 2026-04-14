import certifi
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from others.config import MONGODB_URI

# Replace the placeholder with your Atlas connection string
uri = MONGODB_URI

def connection_check():
    # Create a MongoClient with a MongoClientOptions object to set the Stable API version
    client = MongoClient(
        uri,
        server_api=ServerApi(version='1', strict=True, deprecation_errors=True),
        tls=True,
        tlsCAFile=certifi.where(),
    )


    try:
        # Connect the client to the server (optional starting in v4.7)
        # client.connect()

        # Send a ping to confirm a successful connection
        client.admin.command({'ping': 1})
        print("Pinged your deployment. You successfully connected to MongoDB!")

    except Exception as e:
        print(e)

    finally:
        # Ensures that the client will close when you finish/error
        client.close()

def connect_to_db():
    return MongoClient(uri).adis_database
