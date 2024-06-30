# This is a model for representing users with associated decks.

from mongoengine import Document, StringField, DateTimeField, ListField
from mongoengine.fields import EmbeddedDocumentField
from datetime import datetime
from .deck_model import Deck

class User(Document):
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    email = StringField(required=True, unique=True)
    dob = DateTimeField(required=True)
    decks = ListField(EmbeddedDocumentField(Deck))
    
    def check_password(self, password):
        return password == self.password

    def update_fields(self, data):
        for field, value in data.items():
            if field == 'dob':
                value = datetime.strptime(value, '%d/%m/%Y').date()
            elif field in ['username', 'password', 'email']:
                setattr(self, field, value)
            else:
                print(f"Field '{field}' is not allowed for update in User model")


    meta = {
        'collection': 'Users'
    }