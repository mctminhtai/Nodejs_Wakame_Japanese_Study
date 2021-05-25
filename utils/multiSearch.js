exports.multiSearchOr = function (text, searchWords) {
    text = text.toLowerCase()
    if (text && searchWords) {
        var filteredText = text.match(/[^_\W]+/g);
        if (filteredText !== null) {
            var lowerCaseText = filteredText.map(function (word) {
                return word.toLowerCase();
            });
            for (var i = 0; i < searchWords.length; i++) {
                //var vt = text.indexOf(searchWords[i].toLowerCase());
                if (text.indexOf(searchWords[i].toLowerCase()) === -1) {
                    return "Not found!";
                }
            }
            return "Found!"
        }
        return "Error: the text provided doesn't contain any words!"
    }
    return "Error: Props are missing";
}