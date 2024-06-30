# This is a model for representing comments embedded within planet, within deck, within user.
# It includes fields such as 'id' for unique identification and 'content' for storing comment content.

from mongoengine import EmbeddedDocument, StringField, ObjectIdField
import uuid

class Comment(EmbeddedDocument):
    id = StringField(default=lambda: str(uuid.uuid4()), primary_key=True)
    content = StringField(required=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'content': self.content,
        }
 