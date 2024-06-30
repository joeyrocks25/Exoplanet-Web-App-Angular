# This is a model for representing a deck embedded within the user document.
# It includes fields such as 'name' for the deck name, 'id' for unique identification,
# and 'planets' for storing a list of planets embedded within the deck.

from mongoengine import EmbeddedDocument, StringField, ListField
from mongoengine.fields import EmbeddedDocumentField
from models.planet_model import Planet

class Deck(EmbeddedDocument):
    name = StringField(required=True)
    id = StringField()
    planets = ListField(EmbeddedDocumentField(Planet)) 

