
from others.config import MONGODB_URI
uri = MONGODB_URI

client = MongoClient(uri)
db = client["adis"]
users = db["users"]


class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

    def save(self):
        users.insert_one({
            "name": self.name,
            "email": self.email,
            "password": self.password
        })

    def find_by_email(self, email):
        return users.find_one({"email": email})

    def find_by_id(self, id):
        return users.find_one({"_id": id})

    def find_all(self):
        return users.find()

    def update(self, id, data):
        users.update_one({"_id": id}, {"$set": data})

    def delete(self, id):
        users.delete_one({"_id": id})