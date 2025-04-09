from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from datetime import datetime, timedelta
from langchain.prompts import PromptTemplate
from langchain.chains.llm import LLMChain
from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableSequence



# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Authorization", "Content-Type"]
    }
})

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
    data = request.get_json()

    try:
        # Check if an expense with the same category already exists
        existing_expense = Expense.query.filter_by(user_id=user_id, category=data.get('category')).first()

        if existing_expense:
            # If expense with same category exists, update the amount and date
            existing_expense.amount += data.get('amount')
            existing_expense.date = datetime.strptime(data.get('date'), "%Y-%m-%d")
            db.session.commit()

            return jsonify({
                "id": existing_expense.id,
                "category": existing_expense.category,
                "amount": existing_expense.amount,
                "date": existing_expense.date.strftime("%Y-%m-%d")
            }), 200
        else:
            # If no expense exists, add a new one
            new_expense = Expense(
                user_id=user_id,
                category=data.get('category'),
                amount=data.get('amount'),
                date=datetime.strptime(data.get('date'), "%Y-%m-%d")
            )
            db.session.add(new_expense)
            db.session.commit()

            return jsonify({
                "id": new_expense.id,
                "category": new_expense.category,
                "amount": new_expense.amount,
                "date": new_expense.date.strftime("%Y-%m-%d")
            }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Edit expense route
@app.route('/expenses/<int:id>', methods=['PUT'])
@jwt_required()
def edit_expense(id):
    user_id = get_jwt_identity()
    expense = Expense.query.filter_by(id=id, user_id=user_id).first()

    if not expense:
        return jsonify({"message": "Expense not found"}), 404

    data = request.json
    expense.category = data['category']
    expense.amount = data['amount']
    expense.date = data['date']

    try:
        db.session.commit()
        return jsonify({"message": "Expense updated!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Delete expense route
@app.route('/expenses/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_expense(id):
    user_id = get_jwt_identity()
    expense = Expense.query.filter_by(id=id, user_id=user_id).first()

    if not expense:
        return jsonify({"message": "Expense not found"}), 404

    try:
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"message": "Expense deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Get expenses route
@app.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = get_jwt_identity()
    expenses = Expense.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": e.id,"category": e.category, "amount": e.amount, "date": e.date.strftime("%Y-%m-%d")} for e in expenses])

# Chat route for AI assistance
@app.route('/chat', methods=['POST'])
def chat_with_assistant():
    data = request.get_json()
    print("Incoming request:", data)
    user_question = data.get("question")

    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    try:
        # Build the LangChain pipeline
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant that answers questions about user expenses."),
            ("user", "{question}")
        ])
        llm = ChatOllama(model="llama2")
        chain = prompt | llm

        # Get the response
        result = chain.invoke({"question": user_question})
        return jsonify({"response": result.content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Main method to run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the tables within the app context
    app.run(debug=True)
