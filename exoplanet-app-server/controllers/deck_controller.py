from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import DoesNotExist
from bson import ObjectId
import random

from models.deck_model import Deck
from models.user_model import User
from models.planet_model import Planet 
from models.comment_model import Comment

deck_bp = Blueprint('deck', __name__)

# Adds a planet to a specific deck for the current user.
# Expects a JSON payload with planet details.
@deck_bp.route('/deck/<deck_id>/planet', methods=['POST'])
@jwt_required()
def add_planet_to_deck(deck_id):
    try:
        current_user_username = get_jwt_identity()
        current_user = User.objects(username=current_user_username).first()


        if not current_user:
            return jsonify(message='User not found'), 404

        target_deck = next((deck for deck in current_user.decks if str(deck.id) == deck_id), None)

        if not target_deck:
            return jsonify(message='Deck not found'), 404

        planet_data = request.json
        planet_name = planet_data.get('planet_name')
        host_star = planet_data.get('host_star')
        discovery_facility = planet_data.get('discovery_facility')
        discovery_method = planet_data.get('discovery_method')
        exoplanet_classification = planet_data.get('exoplanet_classification')
        discovery_year = str(planet_data.get('discovery_year'))
        number_of_planets_in_system = str(planet_data.get('number_of_planets_in_system'))
        number_of_stars_in_system = str(planet_data.get('number_of_stars_in_system'))
        planetary_parameter_reference = planet_data.get('planetary_parameter_reference')
        publication_date = planet_data.get('publication_date')
        release_date = planet_data.get('release_date')
        solar_system_type = planet_data.get('solar_system_type')

        new_planet = Planet(
            planet_name=planet_name,
            host_star=host_star,
            discovery_facility=discovery_facility,
            discovery_method=discovery_method,
            discovery_year=discovery_year,
            number_of_planets_in_system=number_of_planets_in_system,
            number_of_stars_in_system=number_of_stars_in_system,
            planetary_parameter_reference=planetary_parameter_reference,
            publication_date=publication_date,
            release_date=release_date,
            solar_system_type=solar_system_type,
            exoplanet_classification=exoplanet_classification,
        )

        target_deck.planets.append(new_planet)
        current_user.save()

        return jsonify(message='Planet added to deck successfully'), 201

    except DoesNotExist:
        return jsonify(message='User not found'), 404

    except Exception as e:
        print(f"Error during add_planet_to_deck: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Gets details of a specific deck for the current user by deck_id.
@deck_bp.route('/deck/<deck_id>', methods=['GET'])
@jwt_required()
def get_deck(deck_id):
    try:
        current_user_username = get_jwt_identity()
        current_user = User.objects(username=current_user_username).first()

        if not current_user:
            return jsonify(message='User not found'), 404

        target_deck = next((deck for deck in current_user.decks if str(deck.id) == deck_id), None)

        if not target_deck:
            return jsonify(message='Deck not found'), 404

        target_deck_id_str = str(target_deck.id)
        deck_details = {
            'deck_id': target_deck_id_str,
            'deck_name': target_deck.name,
            'planets': [planet.to_dict() for planet in target_deck.planets],
        }

        return jsonify(deck_details), 200

    except DoesNotExist:
        return jsonify(message='User not found'), 404

    except Exception as e:
        print(f"Error during get_deck: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Deletes a planet from a specific deck for the current user by deck_id and planet_id.
@deck_bp.route('/deck/<deck_id>/planet/<planet_id>', methods=['DELETE'])
@jwt_required()
def delete_planet_from_deck(deck_id, planet_id):
    try:
        current_user_username = get_jwt_identity()
        current_user = User.objects(username=current_user_username).first()

        if not current_user:
            return jsonify(message='User not found'), 404

        target_deck = next((deck for deck in current_user.decks if str(deck.id) == deck_id), None)

        if not target_deck:
            return jsonify(message='Deck not found'), 404

        planet_to_delete = next((planet for planet in target_deck.planets if str(planet.id) == planet_id), None)

        if not planet_to_delete:
            return jsonify(message='Planet not found in the deck'), 404

        target_deck.planets.remove(planet_to_delete)
        current_user.save()

        return jsonify(message='Planet deleted from the deck successfully'), 200

    except DoesNotExist:
        return jsonify(message='User not found'), 404

    except Exception as e:
        print(f"Error during delete_planet_from_deck: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Deletes a deck for the current user by deck_id.
@deck_bp.route('/deck/<deck_id>', methods=['DELETE'])
@jwt_required()
def delete_deck(deck_id):
    try:
        current_user_username = get_jwt_identity()
        current_user = User.objects(username=current_user_username).first()

        if not current_user:
            return jsonify(message='User not found'), 404

        deck_to_delete = next((deck for deck in current_user.decks if str(deck.id) == deck_id), None)

        if not deck_to_delete:
            return jsonify(message='Deck not found'), 404

        current_user.decks.remove(deck_to_delete)
        current_user.save()

        return jsonify(message='Deck deleted successfully'), 200

    except DoesNotExist:
        return jsonify(message='User not found'), 404

    except Exception as e:
        print(f"Error during delete_deck: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Creates a new deck for the current user.
# Expects a JSON payload with 'deck_name'.
@deck_bp.route('/deck', methods=['POST'])
@jwt_required()
def create_deck():
    try:
        current_user_username = get_jwt_identity()
        data = request.json
        deck_name = data.get('deck_name')

        current_user = User.objects(username=current_user_username).first()

        if not current_user:
            return jsonify(message="User not found"), 404

        deck_id = ObjectId()
        new_deck = Deck(id=str(deck_id), name=deck_name)
        current_user.decks.append(new_deck)
        current_user.save()

        return jsonify(message='Deck created successfully', deck_id=str(deck_id)), 201

    except Exception as e:
        print(f"Error during create_deck: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Adds comments to a specific planet, in a specific deck, for current user.
@deck_bp.route('/deck/<deck_id>/planet/<planet_id>/comments', methods=['POST'])
@jwt_required()
def add_comments_to_planet(deck_id, planet_id):
    try:
        current_user_username = get_jwt_identity()
        current_user = User.objects(username=current_user_username).first()

        if not current_user:
            return jsonify(message='User not found'), 404

        target_deck = next((deck for deck in current_user.decks if str(deck.id) == deck_id), None)

        if not target_deck:
            return jsonify(message='Deck not found'), 404

        target_planet = next((planet for planet in target_deck.planets if str(planet.id) == planet_id), None)

        if not target_planet:
            return jsonify(message='Planet not found in the deck'), 404

        comments_data = request.json.get('comments', [])
        new_comments = [Comment(content=comment_data) for comment_data in comments_data]

        target_planet.comments.extend(new_comments)
        current_user.save()

        return jsonify(message='Comments added to the planet successfully'), 201

    except DoesNotExist:
        return jsonify(message='User not found'), 404

    except Exception as e:
        print(f"Error during add_comments_to_planet: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Gets comments for a specific planet, within a specific deck, for current user.
@deck_bp.route('/deck/<deck_id>/planet/<planet_id>/comments', methods=['GET'])
@jwt_required()
def get_comments_for_planet(deck_id, planet_id):
    try:
        current_user_username = get_jwt_identity()
        current_user = User.objects(username=current_user_username).first()

        if not current_user:
            return jsonify(message='User not found'), 404

        target_deck = next((deck for deck in current_user.decks if str(deck.id) == deck_id), None)

        if not target_deck:
            return jsonify(message='Deck not found'), 404

        target_planet = next((planet for planet in target_deck.planets if str(planet.id) == planet_id), None)

        if not target_planet:
            return jsonify(message='Planet not found in the deck'), 404

        comments = [comment.to_dict() for comment in target_planet.comments]

        return jsonify(comments=comments), 200

    except DoesNotExist:
        return jsonify(message='User not found'), 404

    except Exception as e:
        print(f"Error during get_comments_for_planet: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Updates a comment for a specific planet, within a specific deck, for current user.
@deck_bp.route('/deck/<deck_id>/planet/<planet_id>/comments/<comment_id>', methods=['PUT'])
@jwt_required()
def update_comment(deck_id, planet_id, comment_id):
    try:
        current_user_username = get_jwt_identity()
        current_user = User.objects(username=current_user_username).first()

        if not current_user:
            return jsonify(message='User not found'), 404

        target_deck = next((deck for deck in current_user.decks if str(deck.id) == deck_id), None)

        if not target_deck:
            return jsonify(message='Deck not found'), 404

        target_planet = next((planet for planet in target_deck.planets if str(planet.id) == planet_id), None)

        if not target_planet:
            return jsonify(message='Planet not found in the deck'), 404

        target_comment = next((comment for comment in target_planet.comments if str(comment.id) == comment_id), None)

        if not target_comment:
            return jsonify(message='Comment not found in the planet'), 404

        new_content = request.json.get('content')
        if new_content:
            target_comment.content = new_content

        current_user.save()

        return jsonify(message='Comment updated successfully'), 200

    except DoesNotExist:
        return jsonify(message='User not found'), 404

    except Exception as e:
        print(f"Error during update_comment: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Deletes a comment for a specific planet, within a specific deck, for the current user.
@deck_bp.route('/deck/<deck_id>/planet/<planet_id>/comments/<comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(deck_id, planet_id, comment_id):
    try:
        current_user_username = get_jwt_identity()
        current_user = User.objects(username=current_user_username).first()

        if not current_user:
            return jsonify(message='User not found'), 404

        target_deck = next((deck for deck in current_user.decks if str(deck.id) == deck_id), None)

        if not target_deck:
            return jsonify(message='Deck not found'), 404

        target_planet = next((planet for planet in target_deck.planets if str(planet.id) == planet_id), None)

        if not target_planet:
            return jsonify(message='Planet not found in the deck'), 404

        target_comment = next((comment for comment in target_planet.comments if str(comment.id) == comment_id), None)

        if not target_comment:
            return jsonify(message='Comment not found in the planet'), 404

        target_planet.comments.remove(target_comment)
        current_user.save()

        return jsonify(message='Comment deleted successfully'), 200

    except DoesNotExist:
        return jsonify(message='User not found'), 404

    except Exception as e:
        print(f"Error during delete_comment: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Function to generate random question and its value for a specific field and a randomly selected planet.
def get_random_question_and_value(planets, field):
    random_planet = random.choice(planets)
    planet_name = random_planet.planet_name
    formatted_field = field.replace('_', ' ')
    value = getattr(random_planet, field)
    question = f"What is the {formatted_field} of planet {planet_name}?"
    return question, value


# Function to generate random questions and their values for all fields for a randomly selected planet.
def get_random_questions_and_values(planets):
    questions_and_values = []
    fields = [
        "host_star",
        "discovery_method",
        "discovery_facility",
        "solar_system_type",
        "number_of_planets_in_system",
        "discovery_year"
    ]
    random.shuffle(fields)
    for field in fields:
        question, value = get_random_question_and_value(planets, field)
        questions_and_values.append({"question": question, "value": value})
    return questions_and_values


# Get details of a specific deck for the current user by deck_id
@deck_bp.route('/deck/random-question/<deck_id>', methods=['GET'])
@jwt_required()
def get_deck_questions(deck_id):
    try:
        current_user_username = get_jwt_identity()
        current_user = User.objects(username=current_user_username).first()
        if not current_user:
            return jsonify(message='User not found'), 404
        target_deck = next((deck for deck in current_user.decks if str(deck.id) == deck_id), None)
        if not target_deck:
            return jsonify(message='Deck not found'), 404
        shuffled_planets = random.sample(target_deck.planets, len(target_deck.planets))
        questions_and_values = get_random_questions_and_values(shuffled_planets)
        target_deck_id_str = str(target_deck.id)
        deck_details = {
            'deck_id': target_deck_id_str,
            'deck_name': target_deck.name,
            'planets': [planet.to_dict() for planet in shuffled_planets],
            'random_questions': questions_and_values
        }
        return jsonify(deck_details), 200
    except DoesNotExist:
        return jsonify(message='User not found'), 404
    except Exception as e:
        print(f"Error during get_deck: {str(e)}")
        return jsonify(message='Internal Server Error'), 500