const inputs = document.querySelectorAll('.passcode-area input');
inputs[0].focus();
for (elem of inputs) {
  elem.addEventListener('input', function() {
    const value = this.value;
    const nextElement = this.nextElementSibling;
    if (value === '' || !nextElement) {
      return;
    }
    nextElement.focus();
  });
}
for (let elem of inputs) {
  elem.addEventListener('keydown', function(event) {
     //Right Arrow Key
    if (event.keyCode == 39) {
      this.nextElementSibling.focus();
    }
     //Left Arrow Key
    //Add Highlight
    if (event.keyCode == 37) {
      this.previousElementSibling.focus();
    }
    //Backspace Key
    if (event.keyCode == 8 && event.metaKey) {
      console.log('🐰🥚 FOUND!!! Cmd + Backspace = clear all');
      for (innerElem of inputs) {
        innerElem.value = '';
      }
      inputs[0].focus();
    } else if (event.keyCode == 8) {
      if(elem.value === '') {
        this.previousElementSibling.focus();
        return;
      }
      elem.value = '';
    }
  });
}
