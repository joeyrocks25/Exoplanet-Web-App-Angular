# This is a model for representing exoplanets stored in the MongoDB database.

from flask_mongoengine import MongoEngine

db = MongoEngine()

class Exoplanet(db.Document):
    planet_name = db.StringField(required=True, unique=True)
    host_star = db.StringField()
    number_of_stars_in_system = db.IntField()
    number_of_planets_in_system = db.IntField()
    discovery_method = db.StringField()
    discovery_year = db.IntField()
    discovery_facility = db.StringField()
    solar_system_type = db.StringField()
    publication_date = db.StringField()
    release_date = db.StringField()
    planetary_parameter_reference = db.StringField()
    exoplanet_classification = db.DictField()

    meta = {
        'collection': 'Planets'
    }