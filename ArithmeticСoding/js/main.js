function findCoding() {
    var input = $('#input');
    var output = $('#output');
    output.val(input.val());

    var text = input.val();
    if (text.length == 0) {
        return;
    }

    var dictionary = getDictionary(text);
    sortDictionary(dictionary);

    dictionary.forEach(function (node) {
        node.value /= text.length;
    });
    for (var i = 1; i < dictionary.length; i++) {
        dictionary[i].value += dictionary[i - 1].value;
    }
    var code = getCode(dictionary, text);
    output.val(code);
    code += "";
    if (code.length > 2) {
        code = code.replace("0.", "");
    }
    output.val(output.val() + "\r" + (+code).toString(2));


}

function node(key, value) {
    this.key = key;
    this.value = value;
}


function getDictionary(text) {
    var dictionary = [];
    for (var i = 0; i < text.length; i++) {
        var isConstants = false;
        dictionary.forEach(function (value) {
            if (value.key == text[i]) {
                isConstants = true;
                value.value++;
            }
        })
        if (!isConstants) {
            dictionary.push(new node(text[i], 1))
        }
    }
    return dictionary;
}


function sortDictionary(dictionary) {
    dictionary.sort(function (a, b) {
        if (a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        return 0;
    })

    return dictionary;
}

function getCode(dictionary, text) {
    var table = $("#resultTable");
    table.empty();
    var oldHigh = 1;
    var oldLow = 0;
    var tr = "<tr>";
    for (var i = 0; i < text.length; i++) {
        tr += "<td>" + text[i] + "</td>";
        var number = getNumberInArray(text[i]);
        var hRange = dictionary[number].value;
        hRange = hRange.toFixed(14);

        var lRange = 0;
        if (number != 0) {
            lRange = dictionary[number - 1].value;
            lRange = lRange.toFixed(14);
        } else {
            lRange = 0;
        }
        var newHigh = oldLow + (oldHigh - oldLow) * hRange;
        newHigh = +newHigh.toFixed(10);
        var newLow = oldLow + (oldHigh - oldLow) * lRange;
        newLow = +newLow.toFixed(14);

        oldLow = newLow;
        oldHigh = newHigh;
        tr += "<td>" + "H= " + oldLow + "+(" + oldHigh + "-" + oldLow + ") * " + +hRange + "= " + newHigh;
        tr += "<br>" + "L= " + oldLow + "+(" + oldHigh + "-" + oldLow + ") * " + +lRange + "= " + newLow + "</td>";
        tr += "</tr>";
    }
    table.append(tr);

    return oldLow;

    function getNumberInArray(char) {
        for (var i = 0; i < dictionary.length; i++) {
            if (dictionary[i].key == char) {
                return i;
            }
        }
        return -1;
    }
}

