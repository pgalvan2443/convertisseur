const prefixes = ["", "un", "duo", "ter", "quater", "quin", "sex", "sept", "octo", "novo"]
const radUnit = ["", "semel", "bis", "ter", "quater", "quinquies", "sexies", "septies", "octies", "nonies"]
const radDiz = ["", "decies", "vicies", "tricies", "quadrigies", "quinquagies", "sexagies", "septuagies", "octuagies", "nonagies"]
const radCent = ["", "centies", "ducenties", "tricenties", "quadragenties", "quinquagenties", "sexagenties", "septuagenties", "octuagenties", "nonagenties"]
const radMil = ["", "millies", "dumillies", "trimillies", "quadramillies", "quinquamillies", "sexamillies", "septuamillies", "octuamillies", "nonamillies"]
const alphLat = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

const numberPattern = /^[0-9]+$/

let number = document.getElementById('number');
let latin = document.getElementById('latin');
let german = document.getElementById('german');
let error = document.getElementById('error');
let add = document.getElementById('add');
let table = document.getElementById('table');

function convNbLat(n) {

    let res = "";

    if (n > 9999) {
        return;
    }

    if (n < 10) {
        res += radUnit[n];
    }

    if (n > 9) {
        let mil = Math.floor(n / 1000);
        let cent = Math.floor((n % 1000) / 100);
        let diz = Math.floor((n % 100) / 10);
        let unit = n % 10;

        res += prefixes[unit];
        res += radDiz[diz];
        res += radCent[cent];
        res += radMil[mil];
    }

    return res

}

function convLatNb(nb) {

    let val = 0;
    let testCent = false;
    let testMil = false;

    for (let i = 2; i < 10; i++) {

        if (nb === radUnit[i]) {
            return i;
        }

        if (nb.endsWith(radMil[i])) {
           val += i*1000;
           testMil = true;
        }

        if (nb.indexOf(radCent[i]) !== -1) {
            val += i*100;
            testCent = true;
        }

        if (nb.indexOf(radDiz[i]) !== -1) {
            val += i*10;
        }

    }

    for (let i = 2; i < 5; i++) {
        if (nb.startsWith(prefixes[i])) {
            val += i;
        }
    }

    if (nb.startsWith('quin')) {
        if (nb.startsWith('quinquadr')) {
            val += 5;
        }

        if (!nb.startsWith('quinqua')) {
            val += 5;
        }
    }

    if (nb.startsWith('sex')) {
        if (!nb.startsWith('sexa')) {
            val += 6;
        }
    }

    if (nb.startsWith('sept')) {
        if (!nb.startsWith('septua')) {
            val += 7;
        }
    }

    for (let i = 8; i < 10; i++) {
        if (nb.startsWith(prefixes[i])) {
            val += i;
        }
    }

    if (!testMil) {
        if (nb.indexOf('millies') !== -1) {
            val += 1000;
        }
    }

    if (!testCent) {
        if (nb.indexOf('centies') !== -1) {
            val += 100;
        }
    }

    if (nb.indexOf('decies') !== -1) {
        val += 10;
    }

    if (nb.startsWith('un')) {
        val += 1;
    }

    return val;

}

function convNbAlph(n) {
    if (n < 27) {
        return alphLat[n - 1];
    }

    if (n < 703) {
        return alphLat[Math.floor((n - 27) / 26)] + alphLat[(n - 1) % 26];
    }

    let v1 = (Math.floor((n - 703) / 26)) % 26;
    let v2 = (n - 1) % 26;

    return alphLat[Math.floor((n - 703) / 676)] + alphLat[v1] + alphLat[v2];

}

function convAlphNb(n) {

    switch (n.length) {
        case 1: return alphLat.indexOf(n);

        case 2: return (
            26 +
            26 * alphLat.indexOf(n[0]) +
            alphLat.indexOf(n[1])
        );

        case 3: return (
            702 +
            676 * alphLat.indexOf(n[0]) +
            26 * alphLat.indexOf(n[1]) +
            alphLat.indexOf(n[2])
        );
    }

}

function throwError(message) {
    error.innerHTML = message;
    error.style.display = "block";
}

function hideError() {
    error.style.display = "none";
}

function updateFromNb(n) {
    if (!numberPattern.test(n)) {
        throwError("La première colonne doit contenir un nombre entier positif.");
        return;
    };

    n = n * 1;

    if (n >= 9999) {
        throwError("Ce programme ne traite les nombres que jusqu'à 9998.");
        return;
    }

    hideError();

    latin.value = convNbLat(n+1);
    german.value = convNbAlph(n);
}

function updateFromLatin(n) {
    hideError();
    let value = convLatNb(n) - 1;
    number.value = value
    german.value = convNbAlph(value);
}

function updateFromGerman(n) {

    if (n.length > 3) {
        throwError("Ce programme ne traite la notation germanique que jusqu'à 3 lettres.");
        return;
    }

    hideError();

    let value = convAlphNb(n) + 1;
    number.value = value;
    latin.value = convNbLat(value + 1);
}

number.addEventListener('keyup', function() {
    updateFromNb(number.value, 10);
});

latin.addEventListener('change', function() {
    updateFromLatin(latin.value);
});

german.addEventListener('keyup', function() {
    updateFromGerman(german.value);
});

add.addEventListener('click', function() {
    let element = document.createElement('tr');
    let first = document.createElement('td');
    first.innerHTML = number.value;
    let second = document.createElement('td');
    second.innerHTML = latin.value;
    let third = document.createElement('td');
    third.innerHTML = german.value;
    element.appendChild(first);
    element.appendChild(second);
    element.appendChild(third);
    table.appendChild(element);
});
