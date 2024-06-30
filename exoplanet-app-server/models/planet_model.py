# This is a model for representing planets embedded within decks and users.

from mongoengine import EmbeddedDocument, StringField, ListField, DictField
import uuid
from mongoengine.fields import EmbeddedDocumentField
from models.comment_model import Comment

class ExoplanetClassification(EmbeddedDocument):
    details = ListField(StringField())
    type = StringField()

class Planet(EmbeddedDocument):
    id = StringField(default=lambda: str(uuid.uuid4()), primary_key=True)
    planet_name = StringField(required=True)
    host_star = StringField()
    discovery_facility = StringField()
    discovery_method = StringField()
    discovery_year = StringField()
    number_of_planets_in_system = StringField()
    number_of_stars_in_system = StringField()
    planetary_parameter_reference = StringField()
    publication_date = StringField()
    release_date = StringField()
    solar_system_type = StringField()
    exoplanet_classification = DictField()
    comments = ListField(EmbeddedDocumentField(Comment))

    def to_dict(self):
        return {
            'id': self.id,
            'planet_name': self.planet_name,
            'host_star': self.host_star,
            'discovery_facility': self.discovery_facility,
            'discovery_method': self.discovery_method,
            'discovery_year': self.discovery_year,
            'number_of_planets_in_system': self.number_of_planets_in_system,
            'number_of_stars_in_system': self.number_of_stars_in_system,
            'planetary_parameter_reference': self.planetary_parameter_reference,
            'publication_date': self.publication_date,
            'release_date': self.release_date,
            'solar_system_type': self.solar_system_type,
            'exoplanet_classification': self.exoplanet_classification,
        }