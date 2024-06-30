from flask import jsonify, Blueprint, request
from models.exoplanet_model import Exoplanet

exoplanets_bp = Blueprint('exoplanets', __name__)

# Retrieves all exoplanets from the database.
@exoplanets_bp.route('/exoplanets', methods=['GET'])
def get_all_exoplanets():
    try:
        planets = Exoplanet.objects()
        return jsonify({'exoplanets': planets})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Retrieves a specific exoplanet by specific planet name.
@exoplanets_bp.route('/exoplanets/<planet_name>', methods=['GET'])
def get_exoplanet_by_name(planet_name):
    try:
        planet = Exoplanet.objects.get(planet_name=planet_name)
        return jsonify({'exoplanet': planet})
    except Exoplanet.DoesNotExist:
        return jsonify({'error': 'Planet not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Generic search with a given search value.
# Performs a generic search across all fields in the Exoplanet model based on a query parameter.
@exoplanets_bp.route('/exoplanets/search', methods=['GET'])
def test_generic_search():
    try:
        search_value = request.args.get('search_value')
        all_fields = Exoplanet._fields.keys()
        matching_planets = []

        for field in all_fields:
            filter_dict = {field: {"$regex": f".*{search_value}.*", "$options": "i"}}
            planets = Exoplanet.objects(__raw__=filter_dict)

            if planets:
                matching_planets.extend(planets)

        return jsonify({'exoplanets': matching_planets})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
