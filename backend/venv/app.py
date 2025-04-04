from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://sreejaaluguvelly:Sreeja@localhost:5432/yourdatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'abc'
app.config['JWT_ALGORITHM'] = 'HS256'


# Initialize db and jwt
db = SQLAlchemy(app)
jwt = JWTManager(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

# Expense Model
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)

# Register route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    new_user = User(username=username,password=password)
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'success':'User registered!','id':new_user.id}),201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error':str(e)}),500



# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        access_token = create_access_token(identity=user.username)
        return jsonify(access_token=access_token)
    return jsonify({"message": "Invalid credentials"}), 401

# Add expense route
@app.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    user_id = get_jwt_identity()
    data = request.json
    new_expense = Expense(user_id=user_id, category=data['category'], amount=data['amount'], date=data['date'])
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"message": "Expense added!"})

# Get expenses route
@app.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = get_jwt_identity()
    expenses = Expense.query.filter_by(user_id=user_id).all()
    return jsonify([{"category": e.category, "amount": e.amount, "date": e.date.strftime("%Y-%m-%d")} for e in expenses])

# Main method to run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the tables within the app context
    app.run(debug=True)
