import backend # Import the python file containing the ML model
from flask import Flask, request, render_template,jsonify # Import flask libraries

app = Flask(__name__,template_folder="templates",static_url_path='/static')

@app.route("/")
def home():
    return render_template('home1.html')   

@app.route("/classify",methods=['POST','GET'])
def classify_type():
    try:
        exam = request.args.get('txt') # Get parameters for sentence

        # Get the output from the classification model
        label = backend.classify(exam)
        
        #CSS for output
        if exam == "":
            img = "error.png"
            label_class = "input alert-warning"
            return render_template('home1.html', label='Nothing to predict',sentence='', label_class=label_class, image = img, display="block")
        if label == "fake":
            img = "sad.png"
            label_class = "input alert-danger"
        else:
            img = "happy.png"
            label_class = "input alert-success"

        # Render the output in new HTML page
        return render_template('home1.html', label=label,sentence=exam, label_class=label_class, image = img, display="block")
    except:
        return 'Error'

def retry():
    exam = request.args.get('txt') # Get parameters for sentence

    # Get the output from the classification model
    label = backend.classify(exam)
    
    return render_template('home1.html', label='',sentence='', label_class='', image = img, display="none")

if __name__ == "__main__":
    app.run(debug=True)