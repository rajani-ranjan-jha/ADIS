from config.config import MONGODB_URI
from pymongo import MongoClient

# client = MongoClient("mongodb://localhost:27017/") #local db
client = MongoClient(MONGODB_URI) #cloud db
try:
    #creating a database(adis_database)
    db = client.adis_database 
except Exception as e:
    print(e)

# Define the validation rules
UserValidator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "email"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "must be a string and is required"
            },
            "email": {
                "bsonType": "string",
                "pattern": "@",
                "description": "must be a string containing '@' and is required"
            }
        }
    }
}

try:
    # Create a collection with the validator
    # db.create_collection("users", validator=UserValidator)
    # insert sample values
    db.users.insert_one({"name": "John Doe", "email": "john@123.com"})
    db.users.insert_one({"name": "Bahubali", "email": "[EMAIL_ADDRESS]"})
    print('success ✅✅')
except Exception as e:
    print(e.details)

