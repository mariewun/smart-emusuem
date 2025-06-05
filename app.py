from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "Smart e-Museum"
db = SQLAlchemy()
db.init_app(app)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    aid = db.Column(db.String(5),nullable=False)
    comment = db.Column(db.String(999),nullable=False)

    def __init__(self, aid, comment):
        self.aid = aid
        self.comment = comment
    

@app.route("/")
def index():
    db.create_all()
    
    return render_template('index.html',
                           FirstComments = Comment.query.filter_by(aid='1').all(),
                           SecondComments = Comment.query.filter_by(aid='2').all(),
                           ThirdComments = Comment.query.filter_by(aid='3').all(),
                           FourthComments = Comment.query.filter_by(aid='4').all(),
                           FifthComments = Comment.query.filter_by(aid='5').all(),
                           SixthComments = Comment.query.filter_by(aid='6').all(),
                           SeventhComments = Comment.query.filter_by(aid='7').all(),
                           EighthComments = Comment.query.filter_by(aid='8').all())

    
@app.route("/index", methods = ["GET", "POST"])
def addComment():
    if request.method == "POST":
        artID = request.form["aid"]
        addComment = request.form["comment"]
    else:
        artID = request.form.get("aid")
        addComment = request.form.get("comment")
    new_comment = Comment(aid=artID, comment=addComment)
    db.session.add(new_comment)
    db.session.commit()
    return redirect(url_for('index'))



if __name__ == '__main__':
    app.run(debug=True, port=5500)

