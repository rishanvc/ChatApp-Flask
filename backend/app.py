from flask import Flask, jsonify
from flask_cors import CORS
from models import db
from flask import request
from models import User
from models import Message


app = Flask(__name__)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)



@app.route("/")
def home():
    return jsonify({"message": "Flask backend is working!"})


@app.route("/api/test")
def api_test():
    return jsonify({"status": "success", "message": "Hello from Flask API"})



@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    # Check if user already exists
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"status": "error", "message": "Username already exists"}), 400

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"status": "success", "message": "User registered successfully"})




@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    if user.password != password:
        return jsonify({"status": "error", "message": "Invalid password"}), 401

    return jsonify({
        "status": "success",
        "message": "Login successful",
        "user_id": user.id,
        "username": user.username
    })



@app.route("/api/users/<int:current_user_id>")
def get_users(current_user_id):
    users = User.query.filter(User.id != current_user_id).all()

    user_list = [
        {"id": user.id, "username": user.username}
        for user in users
    ]

    return jsonify(user_list)



@app.route("/api/send-message", methods=["POST"])
def send_message():
    data = request.get_json()

    sender_id = data.get("sender_id")
    receiver_id = data.get("receiver_id")
    content = data.get("content")

    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        content=content
    )

    db.session.add(new_message)
    db.session.commit()

    return jsonify({"status": "success", "message": "Message sent"})


@app.route("/api/messages/<int:user1>/<int:user2>")
def get_messages(user1, user2):

    messages = Message.query.filter(
        ((Message.sender_id == user1) & (Message.receiver_id == user2)) |
        ((Message.sender_id == user2) & (Message.receiver_id == user1))
    ).all()

    chat = [
        {
            "sender_id": msg.sender_id,
            "receiver_id": msg.receiver_id,
            "content": msg.content
        }
        for msg in messages
    ]

    return jsonify(chat)



with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)

