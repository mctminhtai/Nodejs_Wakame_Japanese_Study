import SVCmodel # Import the python file containing the ML model
from flask import Flask, request, render_template,jsonify # Import flask libraries

app = Flask(__name__,template_folder="templates")

@app.route("/")
def home():
    # return "Hello, World!"
    return render_template('home1.html')   

@app.route("/classify",methods=['POST','GET'])
def classify_type():
    # return "Hello, Salvador"
    try:
        exam = request.args.get('txt') # Get parameters for sentence

        # Get the output from the classification model
        variety = SVCmodel.classify(exam)

        # Render the output in new HTML page
        return render_template('output1.html', variety=variety)
    except:
        return 'Error'

    
if __name__ == "__main__":
    app.run(debug=True)