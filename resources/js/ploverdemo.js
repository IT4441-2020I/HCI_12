// DECLARE GLOBAL VARIABLES

/** Đối tượng này sẽ lưu trữ mã khóa của các phím hiện đang được nhấn xuống.
 * Đã sử dụng một đối tượng để lưu trữ danh sách vì chúng tôi sẽ xóa các mục theo giá trị thường xuyên. */
downKeys = {};

/** Đối tượng này sẽ lưu trữ các phím nằm trong một hợp âm.
 * Đã sử dụng một đối tượng để lưu trữ danh sách vì chúng tôi sẽ xóa các mục theo giá trị thường xuyên. */
var chordKeys = {};

/** Mảng này sẽ lưu trữ tất cả các hợp âm.
 * Used an array to store the list since we want the items ordered. */
var chords = [];

/** Mảng này sẽ lưu trữ tất cả các hợp âm hợp nhất (các từ đa âm).
 * Used an array to store the list since we want the items ordered. */
var words = [];

/** Mảng này sẽ lưu trữ tất cả các ghi chú dọc. Used an array to store the list since we want the items ordered. */
var verticalNotes = [];

/** Boolean này sẽ xác định nếu hợp âm hiện tại là steno hợp lệ.
 * Nếu hợp âm hiện tại chứa một phím không steno, điều này trở thành sai.
 * Được sử dụng để người dùng có thể sử dụng các phím nóng để chọn tất cả (ctrl-a) và sao chép (ctrl-c) */
var isSteno = true;

var translatedStringArrayUndo = [];
var translatedStringArrayRedo = [];

let urlString = window.location.href;
let url = new URL(urlString)
let type = url.searchParams.get("type");
if (urlString.includes("game-exam")) {
    type = "exam"
}

/** Chuỗi này sẽ lưu trữ chuỗi dịch cuối cùng. */
$(function () {
    $('#verticalNotes').focus();
});

// IMPORT OUTSIDE DATA

/**
 * Đối tượng này sẽ lưu trữ ánh xạ giữa các số nhị phân và cờ steno với dữ liệu được nhập từ tệp json bên ngoài.
 * Có một vấn đề trong đó chrome sẽ không tải các tệp json cục bộ,
 * vì vậy các tệp phải được lưu trữ để dữ liệu được nhập vào chrome.
 * @see jQuery's <a href="http://api.jquery.com/jQuery.getJSON/">getJSON documentaion</a>.
 * @see MDN's <a href="https://developer.mozilla.org/en/JavaScript/Reference/Operators/Bitwise_Operators">documentation on bitwise operators</a>.
 * @see The <a href="http://code.google.com/p/chromium/issues/detail?id=40787">chrome bug report</a>.
 */
var binaryToSteno = {};
$.getJSON('../../' + $.base64.decode($("#binaryToSteno").attr("data-path")), function (data) {
    binaryToSteno = data;
});

/**
 * Đối tượng này sẽ lưu trữ ánh xạ giữa các từ steno được định dạng rtf / cre và các từ tiếng Anh với dữ liệu được nhập từ tệp json bên ngoài.
 * Có một vấn đề trong đó chrome sẽ không tải các tệp json cục bộ, vì vậy các tệp phải được lưu trữ để dữ liệu được nhập vào chrome.
 * @see jQuery's <a href="http://api.jquery.com/jQuery.getJSON/">getJSON documentaion</a>.
 * @see The <a href="http://code.google.com/p/chromium/issues/detail?id=40787">chrome bug report</a>.
 */
var dictionary = {};
$.getJSON('../../' + $.base64.decode($("#input-person").attr("data-path")), function (data) {
    dictionary = data;
});

/**
 * Đối tượng này sẽ lưu trữ ánh xạ giữashorthand mã khóa và ký tự qwerty với dữ liệu được nhập từ tệp json bên ngoài.
 * Có một vấn đề trong đó chrome sẽ không tải các tệp json cục bộ, vì vậy các tệp phải được lưu trữ để dữ liệu được nhập vào chrome.
 * @see jQuery's <a href="http://api.jquery.com/jQuery.getJSON/">getJSON documentaion</a>.
 * @see The <a href="http://code.google.com/p/chromium/issues/detail?id=40787">chrome bug report</a>.
 */
var keyCodeToQwerty = {};
$.getJSON('../../' + $.base64.decode($("#keyCodeToQwerty").attr("data-path")), function (data) {
    keyCodeToQwerty = data;
});

/**
 * Đối tượng này sẽ lưu trữ mã khóa betweeen ánh xạ và ký tự steno với dữ liệu được nhập từ tệp json bên ngoài.
 * Có một vấn đề trong đó chrome sẽ không tải các tệp json cục bộ, vì vậy các tệp phải được lưu trữ để dữ liệu được nhập vào chrome.
 * @see jQuery's <a href="http://api.jquery.com/jQuery.getJSON/">getJSON documentaion</a>.
 * @see The <a href="http://code.google.com/p/chromium/issues/detail?id=40787">chrome bug report</a>.
 */
var keyCodeToSteno = {};
$.getJSON('../../' + $.base64.decode($("#keyCodeToSteno").attr("data-path")), function (data) {
    keyCodeToSteno = data;
});

/**
 * Đối tượng này sẽ lưu trữ ánh xạ giữa các khóa steno và số steno với dữ liệu được nhập từ tệp json bên ngoài.
 * Có một vấn đề trong đó chrome sẽ không tải các tệp json cục bộ, vì vậy các tệp phải được lưu trữ để dữ liệu được nhập vào chrome.
 * @see jQuery's <a href="http://api.jquery.com/jQuery.getJSON/">getJSON documentaion</a>.
 * @see The <a href="http://code.google.com/p/chromium/issues/detail?id=40787">chrome bug report</a>.
 */
var stenoKeyNumbers = {};
$.getJSON('../../' + $.base64.decode($("#keyCodeToStenoNumber").attr("data-path")), function (data) {
    stenoKeyNumbers = data;
});

// CREATE GLOBAL FUNCTIONS

/**
 * This function will take in a list of keys and color code the steno keyboard.
 * @param {Object} keys Pass in a list of Key objects.
 * @see jQuery's <a href="http://api.jquery.com/css/">css documentation</a>.
 * @see <a href="http://stenoknight.com/stengrid.png">Mirabai's color chart</a>.
 * @see Key class.
 */
function colorCode(keys) {
    // Make a list of steno keys from the list of Key objects.
    var stenoKeys = {};
    for (var i in keys) {
        stenoKeys[keys[i].toSteno()] = true; // use the conversion function in the Key class to get a steno representation of the Key.
    }

    // Color code the varters that use only 1 steno key.

    // #
    // if ('#' in stenoKeys) {
    //     $('#stenoKeyNumberBar').css('background-color', '#822259');
    // }

    // *
    if ('*' in stenoKeys) {
        $('#stenoKeyAsterisk1').css('background-color', '#822259');
        $('#stenoKeyAsterisk2').css('background-color', '#822259');
    }

    // Initial S
    if ('S-' in stenoKeys) {
        $('#stenoKeyS-1').css('background-color', '#00ff00');
        $('#stenoKeyS-2').css('background-color', '#00ff00');
    }

    // Final S
    if ('-S' in stenoKeys) {
        $('#stenoKey-S').css('background-color', '#00ff00');
    }

    // Initial T
    if ('T-' in stenoKeys) {
        $('#stenoKeyT-').css('background-color', '#8000ff');
    }

    // Final T
    if ('-T' in stenoKeys) {
        $('#stenoKey-T').css('background-color', '#8000ff');
    }

    // Initial P
    if ('P-' in stenoKeys) {
        $('#stenoKeyP-').css('background-color', '#0080ff');
    }

    // Final P
    if ('-P' in stenoKeys) {
        $('#stenoKey-P').css('background-color', '#0080ff');
    }

    // Initial R
    if ('R-' in stenoKeys) {
        $('#stenoKeyR-').css('background-color', '#00ff80');
    }

    // Final R
    if ('-R' in stenoKeys) {
        $('#stenoKey-R').css('background-color', '#00ff80');
    }

    // Final B
    if ('-B' in stenoKeys) {
        $('#stenoKey-B').css('background-color', '#800000');
    }

    // Final D
    if ('-D' in stenoKeys) {
        $('#stenoKey-D').css('background-color', '#808000');
    }

    // Final F
    if ('-F' in stenoKeys) {
        $('#stenoKey-F').css('background-color', '#008000');
    }

    // Final G
    if ('-G' in stenoKeys) {
        $('#stenoKey-G').css('background-color', '#008080');
    }

    // Initial K
    if ('K-' in stenoKeys) {
        $('#stenoKeyK-').css('background-color', '#800080');
    }

    // Final L
    if ('-L' in stenoKeys) {
        $('#stenoKey-L').css('background-color', '#80ffff');
    }

    // Final V
    if ('-F' in stenoKeys) {
        $('#stenoKey-F').css('background-color', '#808080');
    }

    // Final Z
    if ('-Z' in stenoKeys) {
        $('#stenoKey-Z').css('background-color', '#ff0000');
    }

    // Initial A
    if ('A-' in stenoKeys) {
        $('#stenoKeyA-').css('background-color', '#9df347');
    }

    // Final E
    if ('-E' in stenoKeys) {
        $('#stenoKey-E').css('background-color', '#f0a637');
    }

    // Initial H
    if ('H-' in stenoKeys) {
        $('#stenoKeyH-').css('background-color', '#c558d3');
    }

    // Initial O
    if ('O-' in stenoKeys) {
        $('#stenoKeyO-').css('background-color', '#485771');
    }

    // Final U
    if ('-U' in stenoKeys) {
        $('#stenoKey-U').css('background-color', '#bcf3ed');
    }

    // Initial W
    if ('W-' in stenoKeys) {
        $('#stenoKeyW-').css('background-color', '#f26abf');
    }

    // Color code the letters that use 2 Steno Keys.

    // Initial B
    if ('P-' in stenoKeys && 'W-' in stenoKeys) {
        $('#stenoKeyP-').css('background-color', '#800000');
        $('#stenoKeyW-').css('background-color', '#800000');
    }

    // Initial D
    if ('T-' in stenoKeys && 'K-' in stenoKeys) {
        $('#stenoKeyT-').css('background-color', '#808000');
        $('#stenoKeyK-').css('background-color', '#808000');
    }

    // Initial F
    if ('T-' in stenoKeys && 'P-' in stenoKeys) {
        $('#stenoKeyT-').css('background-color', '#008000');
        $('#stenoKeyP-').css('background-color', '#008000');
    }

    // Final K
    if ('-B' in stenoKeys && '-G' in stenoKeys) {
        $('#stenoKey-B').css('background-color', '#800080');
        $('#stenoKey-G').css('background-color', '#800080');
    }

    // Initial L
    if ('H-' in stenoKeys && 'R-' in stenoKeys) {
        $('#stenoKeyH-').css('background-color', '#80ffff');
        $('#stenoKeyR-').css('background-color', '#80ffff');
    }

    // Initial M
    if ('P-' in stenoKeys && 'H-' in stenoKeys) {
        $('#stenoKeyP-').css('background-color', '#804000');
        $('#stenoKeyH-').css('background-color', '#804000');
    }

    // Final M
    if ('-P' in stenoKeys && '-L' in stenoKeys) {
        $('#stenoKey-P').css('background-color', '#804000');
        $('#stenoKey-L').css('background-color', '#804000');
    }

    // Final N
    if ('-P' in stenoKeys && '-B' in stenoKeys) {
        $('#stenoKey-P').css('background-color', '#ff0080');
        $('#stenoKey-B').css('background-color', '#ff0080');
    }

    // Initial V
    if ('S-' in stenoKeys && 'R-' in stenoKeys) {
        $('#stenoKeyS-1').css('background-color', '#808080');
        $('#stenoKeyS-2').css('background-color', '#808080');
        $('#stenoKeyR-').css('background-color', '#808080');
    }

    // Initial X
    if ('K-' in stenoKeys && 'P-' in stenoKeys) {
        $('#stenoKeyK-').css('background-color', '#ffff00');
        $('#stenoKeyP-').css('background-color', '#ffff00');
    }

    // Initial C
    if ('K-' in stenoKeys && 'R-' in stenoKeys) {
        $('#stenoKeyK-').css('background-color', '#af3630');
        $('#stenoKeyR-').css('background-color', '#af3630');
    }

    // I
    if ('-E' in stenoKeys && '-U' in stenoKeys) {
        $('#stenoKey-E').css('background-color', '#575a14');
        $('#stenoKey-U').css('background-color', '#575a14');
    }

    // Initial Q
    if ('K-' in stenoKeys && 'W-' in stenoKeys) {
        $('#stenoKeyK-').css('background-color', '#511151');
        $('#stenoKeyW-').css('background-color', '#511151');
    }

    // Color code the letters that use 3 Steno Keys.

    // Initial N
    if ('T-' in stenoKeys && 'P-' in stenoKeys && 'H-' in stenoKeys) {
        $('#stenoKeyT-').css('background-color', '#ff0080');
        $('#stenoKeyP-').css('background-color', '#ff0080');
        $('#stenoKeyH-').css('background-color', '#ff0080');
    }

    // Final X
    if ('-B' in stenoKeys && '-G' in stenoKeys && '-S' in stenoKeys) {
        $('#stenoKey-B').css('background-color', '#ffff00');
        $('#stenoKey-G').css('background-color', '#ffff00');
        $('#stenoKey-S').css('background-color', '#ffff00');
    }

    // Initial Y
    if ('K-' in stenoKeys && 'W-' in stenoKeys && 'R-' in stenoKeys) {
        $('#stenoKeyK-').css('background-color', '#732cad');
        $('#stenoKeyW-').css('background-color', '#732cad');
        $('#stenoKeyR-').css('background-color', '#732cad');
    }

    // Color code the letters that contain 4 Steno Keys.

    // Initial G
    if ('T-' in stenoKeys && 'K-' in stenoKeys && 'P-' in stenoKeys && 'W-' in stenoKeys) {
        $('#stenoKeyT-').css('background-color', '#008080');
        $('#stenoKeyK-').css('background-color', '#008080');
        $('#stenoKeyP-').css('background-color', '#008080');
        $('#stenoKeyW-').css('background-color', '#008080');
    }

    // Initial J
    if ('S-' in stenoKeys && 'K-' in stenoKeys && 'W-' in stenoKeys && 'R-' in stenoKeys) {
        $('#stenoKeyS-1').css('background-color', '#000080');
        $('#stenoKeyS-2').css('background-color', '#000080');
        $('#stenoKeyK-').css('background-color', '#000080');
        $('#stenoKeyW-').css('background-color', '#000080');
        $('#stenoKeyR-').css('background-color', '#000080');
    }

    // Final J
    if ('-P' in stenoKeys && '-B' in stenoKeys && '-L' in stenoKeys && '-G' in stenoKeys) {
        $('#stenoKey-P').css('background-color', '#000080');
        $('#stenoKey-B').css('background-color', '#000080');
        $('#stenoKey-L').css('background-color', '#000080');
        $('#stenoKey-G').css('background-color', '#000080');
    }

    // Color code the letters that contain use 5 Steno Keys.

    // Final J
    if ('S-' in stenoKeys && 'T-' in stenoKeys && 'K-' in stenoKeys && 'P-' in stenoKeys && 'W-' in stenoKeys) {
        $('#stenoKeyS-1').css('background-color', '#ff0000');
        $('#stenoKeyS-2').css('background-color', '#ff0000');
        $('#stenoKeyT-').css('background-color', '#ff0000');
        $('#stenoKeyK-').css('background-color', '#ff0000');
        $('#stenoKeyP-').css('background-color', '#ff0000');
        $('#stenoKeyW-').css('background-color', '#ff0000');
    }
}

/**
 * This function takes in a string containing meta commands and converts them.
 * @param {string} translationString Pass in a string with meta commands.
 * @return {string} The string with all the meta commands translated.
 * @see MDN's <a href="https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions">guide on regular expressions</a>.
 * @see Josh's <a href="http://launchpadlibrarian.net/81275523/plover_guide.pdf">plover guide</a>.
 */
function demetafy(translationString) {
    // Sentence stops
    translationString = translationString.replace(/\s*{(\.|!|\?)}\s*([a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ]?)/g, function (matchString, punctuationMark, nextLetter) {
        return punctuationMark + ' ' + nextLetter.toUpperCase();
    });

    // Sentence breaks
    translationString = translationString.replace(/\s*{(,|:|;)}\s*/g, function (matchString, punctuationMark) {
        return punctuationMark + ' ';
    });

    // Simple suffixes (pure javascript translation from the Python code base)
    translationString = translationString.replace(/(\w*)\s*{(\^ed|\^ing|\^er|\^s)}/g, simpleSuffix);

    function simpleSuffix() {
        var matchString = arguments[0];
        var prevWord = arguments[1];
        var suffix = arguments[2];
        var returnString = '';

        var CONSONANTS = {
            'b': true,
            'c': true,
            'd': true,
            'f': true,
            'g': true,
            'h': true,
            'j': true,
            'k': true,
            'l': true,
            'm': true,
            'n': true,
            'p': true,
            'q': true,
            'r': true,
            's': true,
            't': true,
            'v': true,
            'w': true,
            'x': true,
            'z': true,
            'B': true,
            'C': true,
            'D': true,
            'F': true,
            'G': true,
            'H': true,
            'J': true,
            'K': true,
            'L': true,
            'M': true,
            'N': true,
            'P': true,
            'Q': true,
            'R': true,
            'S': true,
            'T': true,
            'V': true,
            'W': true,
            'X': true,
            'Z': true
        };
        var VOWELS = {
            'a': true,
            'e': true,
            'i': true,
            'o': true,
            'u': true,
            'A': true,
            'E': true,
            'I': true,
            'O': true,
            'U': true
        };
        var W = {'w': true, 'W': true};
        var Y = {'y': true, 'Y': true};
        var PLURAL_SPECIAL = {'s': true, 'x': true, 'z': true, 'S': true, 'X': true, 'Z': true};
        prepForSimpleSuffix = function (wordParam) {
            var numChars = wordParam.length;
            if (numChars < 2) {
                return wordParam;
            }
            if (numChars >= 3) {
                thirdToLast = wordParam.slice(-3, -2);
            } else {
                thirdToLast = '';
            }
            secondToLast = wordParam.slice(-2, -1);
            last = wordParam.slice(-1);
            if (secondToLast in VOWELS || secondToLast in CONSONANTS) {
                if (last in VOWELS) {
                    if (thirdToLast && (thirdToLast in VOWELS || thirdToLast in CONSONANTS)) {
                        return wordParam.slice(0, -1);
                    }
                } else if (last in CONSONANTS && !(last in W) && secondToLast in VOWELS && thirdToLast && !(thirdToLast in VOWELS)) {
                    return wordParam + last;
                } else if (last in Y && secondToLast in CONSONANTS) {
                    return wordParam.slice(0, -1) + 'i';
                }
            }
            return wordParam;
        };

        if (suffix === '^s') {
            if (prevWord.length < 2) {
                return prevWord + 's';
            }
            var a = prevWord.slice(-2, -1);
            var b = prevWord.slice(-1);

            if (b in PLURAL_SPECIAL) {
                return prevWord + 'es';
            } else if (b in Y && a in CONSONANTS) {
                return prevWord.slice(0, -1) + 'ies';
            }
            return prevWord + 's';
        }
        if (suffix === '^ed') {
            return prepForSimpleSuffix(prevWord) + 'ed';
        }
        if (suffix === '^er') {
            return prepForSimpleSuffix(prevWord) + 'er';
        }
        if (suffix === '^ing') {
            if (prevWord && prevWord.slice(-1) in Y) {
                return prevWord + 'ing';
            }
            return prepForSimpleSuffix(prevWord) + 'ing';
        }
    }

    // Capitalize
    translationString = translationString.replace(/\s*{-\|}\s*([a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ]?)/g, function (matchString, nextLetter) {
        return nextLetter.toUpperCase();
    });

    // Glue flag
    translationString = translationString.replace(/(\s*{&[^}]+}\s*)+/g, glue);

    function glue() {
        var testString = '';
        for (var i = 0; i < arguments.length; i++) {
            testString += arguments[i] + ', ';
        }
        var matchString = arguments[0];
        matchString = matchString.replace(/\s*{&([^}]+)}\s*/g, function (a, p1) {
            return p1;
        });
        return ' ' + matchString + ' ';
    }

    // Attach flag
    translationString = translationString.replace(/\s*{\^([^}]+)\^}\s*/g, function (matchString, attachString) {
        return attachString;
    });
    translationString = translationString.replace(/\s*{\^([^}]+)}(\s*)/g, function (matchString, attachString, whitespace) {
        return attachString + ' ';
    });
    translationString = translationString.replace(/(\s*){([^}]+)\^}\s*/g, function (matchString, whitespace, attachString) {
        return ' ' + attachString;
    });

    // Key Combinations
    translationString = translationString.replace(/\s*{#Return}\s*/g, '\n');
    translationString = translationString.replace(/\s*{#Tab}\s*/g, '\t');
    translationString = translationString.replace('Return', '\n');
    translationString = translationString.replace('Tab', '\t');

    return translationString;
}

/**
 * This function resets the keys to how they were before any user interaction.
 */
function resetKeys() {
    // Clear the list of keys currently being pressed down.
    for (var key in downKeys) {
        delete downKeys[key];
    }

    // Clear the list of keys in the current chord.
    for (var key in chordKeys) {
        delete chordKeys[key];
    }

    // Assume the next stroke is valid steno.
    isSteno = true;

    // Clear keyboard colors
    $('.stdKey').css('background-color', '#6b6b47');
    for (let j = 0; j < listKey.length; j++) {
        $("#stdKeyboard").find(".code" + listKey[j].keyQwerty).css('background-color', '#000000')
    }
    for (let i = 0; i < 10; i++) {
        $("#stdKey" + i).css('background-color', '#71787D')
        $(".finger-" + i).css("fill", "#FFFFFF")
    }
    $("#stdKeyboard").find(".code16").css('background-color', '#71787D')
    $("#stdKeyboard").find(".code17").css('background-color', '#71787D')
    $('.stenoKey').css('background-color', '#000000');
    $('#stenoKeyNumberBar').css('background-color', '#71787D')

    //Khôi phục nút đang cần bấm
    if (type === "key") {
        let valueSteno = $(".require-key").find(".stenoKey").attr("data-valueSteno")
        let keyQwerty = $(".require-key").find(".stenoKey").attr("data-keyQwerty")
        let idFinger;
        for (let i = 0; i < listLayoutFinger.length; i++) {
            if (listLayoutFinger[i].list.includes(parseInt(keyQwerty))) {
                idFinger = listLayoutFinger[i].idFinger
                break
            }
        }
        for (let i = 0; i < listKey.length; i++) {
            if (valueSteno === listKey[i].valueSteno) {
                $(".code" + listKey[i].keyQwerty).css({
                    "background-color": color[idFinger],
                    "color": "black",
                })
            }
        }
        $(".finger-" + idFinger).css("fill", color[idFinger])
    } else if (type === "phonetics" || type === "word") {
        let requirePhonetic = $(".require-key").find("h4").attr("data-key")
        let listKeySplit = convertWordToArrayKey(requirePhonetic)
        let idFinger
        for (let i = 0; i < listKeySplit.length; i++) {
            for (let j = 0; j < listKey.length; j++) {
                if (listKeySplit[i] === listKey[j].valueSteno) {
                    let key = listKey[j]
                    for (let i = 0; i < listLayoutFinger.length; i++) {
                        if (listLayoutFinger[i].list.includes(key.keyQwerty)) {
                            idFinger = listLayoutFinger[i].idFinger
                            break
                        }
                    }
                    $(".finger-" + idFinger).css("fill", color[idFinger])
                    $(".code" + key.keyQwerty).css({
                        "background-color": color[idFinger],
                        "color": "black",
                    })
                }
            }
        }
    } else if (type === "sentence" || type === "exam") {
        for (let i = 0; i < listKey.length; i++) {
            $(".code" + listKey[i].keyQwerty).css({
                "background-color": "rgb(0,0,0)",
                "color": "white",
            })
        }
        let requirePhonetic = requireStenoArr[count]
        let listKeySplit = convertWordToArrayKey(requirePhonetic)
        let idFinger
        for (let i = 0; i < listKeySplit.length; i++) {
            for (let j = 0; j < listKey.length; j++) {
                if (listKeySplit[i] === listKey[j].valueSteno) {
                    let key = listKey[j]
                    for (let i = 0; i < listLayoutFinger.length; i++) {
                        if (listLayoutFinger[i].list.includes(key.keyQwerty)) {
                            idFinger = listLayoutFinger[i].idFinger
                            break
                        }
                    }
                    $(".finger-" + idFinger).css("fill", color[idFinger])
                    $(".code" + key.keyQwerty).css({
                        "background-color": color[idFinger],
                        "color": "black",
                    })
                }
            }
        }
    }
}

/**
 * This function trims a string of leading and trailing whitespace.
 * @return {String} The string stripped of whitespace from both ends.
 * @see MDN's <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim">trim documentation</a>.
 */
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

/**
 * This function will zero-fill a number.
 * @param {integer} number The number to be zero-filled.
 * @param {integer} width The width of the zero-filled number.
 * @return {string} A string of a zero-filled number.
 * @see The <a href="http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript">question on Stack Overflow</a>.
 */
function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number;
}


// CREATE 'CLASSES'

/**
 * Creates a new Key.
 * @class Represents a key.
 * @param {number} keyCodeParam The key code of the key.
 */
function Key(keyCodeParam) {
    /** @private */
    var keyCode = keyCodeParam;

    /**
     * Custom toString function to create unique identifier.
     * @return {string}
     */
    this.toString = function () {
        return keyCode;
    };

    /**
     * Accessor that gets the key code.
     * @return {integer} The key code.
     */
    this.getKeyCode = function () {
        return keyCode;
    };

    /**
     * Mutator that sets the key code.
     * @param {integer} newKeyCode A new key code.
     */
    this.setKeyCode = function (newKeyCode) {
        keyCode = newKeyCode;
    };

    /**
     * Converts the key code to the qwerty character.
     * @return {string} The qwerty character.
     */
    this.toQwerty = function () {
        return keyCodeToQwerty[keyCode];
    };

    /**
     * Converts the key code from a new qwerty character.
     * @return {string} A new qwerty character.
     */
    this.fromQwerty = function (newQwerty) {
        for (var i in keyCodeToQwerty) { // go through each key code in the imported key code to qwerty mapping
            if (keyCodeToQwerty[i] === newQwerty) { // if the qwerty mapping associated with the current key code is strictly equal to the new qwerty mapping
                keyCode = i; // set the private keyCode property to the current key code
                break; // and stop looping
            }
        }
    };

    /**
     * Converts the key code to the steno character.
     * @return {string} The steno character.
     */
    this.toSteno = function () {
        return keyCodeToSteno[keyCode];
    };

    /**
     * Converts the key code from a new steno character.
     * @return {string} A new steno character.
     */
    this.fromSteno = function (newSteno) {
        for (var i in keyCodeToSteno) { // go through each key code in the imported key code to steno mapping
            if (keyCodeToSteno[i] === newSteno) { // if the steno mapping associated with the current key code is strictly equal to the new steno mapping
                keyCode = i; // set the private keyCode property to the current key code
                break; // and stop looping
            }
        }
    };
}

/**
 * Creates a new Chord.
 * @class Represents a steno chord.
 * @param {Object} A list of Keys.
 */
function Chord(keysParam) {
    /** @private */
    var keys = keysParam;

    /**
     * Custom toString function to create unique identifier.
     * @return {string}
     */
    this.toString = function () {
        var returnString = 'A Stroke with the keys ';
        for (var i = 0; i <= keysParam.length; i++) {
            returnString += keysParam[i].toSteno() + ', '
        }
        returnString = returnString.slice(0, -2) + '.';
        return returnString;
    };

    /**
     * Accessor that gets the list of Keys.
     * @return The list of Keys.
     */
    this.getKeys = function () {
        return keys;
    };

    /**
     * Mutator that sets the list of Keys.
     * @param newKeys A new list of Keys.
     */
    this.setKeys = function (newKeys) {
        keys = newKeys;
    };

    /**
     * This is a function that will take in a string and see if that string is in the key code, qwerty characters, or steno characters.
     * @param {string} keyParam
     */
    this.contains = function (keyParam) {
        for (var key in keys) {
            if (keys[key].getKeyCode() === keyParam || keys[key].toQwerty() === keyParam || keys[key].toSteno() === keyParam) {
                return true;
            }
        }
        return false;
    };

    /**
     * Converts the list of Keys to binary.
     * @return {number} The binary representation of the stroke.
     */
    this.toBinary = function () {
        var flags = parseInt('00000000000000000000000000000000', 2);
        for (var i = parseInt('00000000000000000000001', 2); i <= parseInt('1000000000000000000000000', 2); i <<= 1) {
            if (this.contains(binaryToSteno[i])) {
                flags |= i;
            }
        }
        return flags;
    };

    /**
     * Converts the list of Keys to RTF/CRE format.
     * @return {string} The RTF/CRE representation of the stroke.
     */
    this.toRTFCRE = function () {
        var rtfcre = '';
        for (var i = parseInt('00000000000000000000001', 2); i <= parseInt('1000000000000000000000000', 2); i <<= 1) {
            if (this.contains(binaryToSteno[i]) && binaryToSteno[i] !== '#') {
                if (this.contains('#') && stenoKeyNumbers[binaryToSteno[i]]) {
                    rtfcre += stenoKeyNumbers[binaryToSteno[i]];
                } else {
                    rtfcre += binaryToSteno[i];
                }
            }
        }

        const specialChars = ['*'];
        if (rtfcre[0] === '-') {
            return '-' + rtfcre.replace('--', '.').replace(/-/g, '').replace('.', '-');
        } else if (rtfcre.indexOf('--') !== -1) {
            var part1 = rtfcre.substring(0, rtfcre.indexOf('--'));
            var part2 = rtfcre.substring(rtfcre.indexOf('--'), rtfcre.length);
            return part1.replace(/-/g, '') + part2.replace('--', '.').replace(/-/g, '').replace('.', '-');
        } else {
            if (rtfcre.indexOf(specialChars[0]) !== -1) {
                var indexSpecialChar = rtfcre.indexOf(specialChars[0]);
                var part1 = rtfcre.substring(0, indexSpecialChar)
                var part2 = '-' + rtfcre.substring(indexSpecialChar + 1, rtfcre.length)
                return part1.replace(/-/g, '') + specialChars[0] + part2.replace('--', '.').replace(/-/g, '').replace('.', '-');
            } else {
                return rtfcre.replace('--', '.').replace(/-/g, '').replace('.', '-');
            }
        }
    };

    /**
     * Converts the list of Keys to a list of key codes.
     * @return The list of key codes.
     */
    this.toKeyCodes = function () {
        var keyCodes = {};
        for (var i in keys) {
            keyCodes[keys[i].getKeyCode()] = true;
        }
        return keyCodes;
    };

    /**
     * Converts the list of Keys to a list of qwerty characters.
     * @return The list of qwerty characters.
     */
    this.toQwertyKeys = function () {
        var qwertyKeys = {};
        for (var i in keys) {
            qwertyKeys[keys[i].toQwerty()] = true;
        }
        return qwertyKeys;
    };

    /**
     * Converts the list of Keys to a list of steno characters.
     * @return The list of steno characters.
     */
    this.toStenoKeys = function () {
        var stenoKeys = {};
        for (var i in keys) {
            stenoKeys[keys[i].toSteno()] = true;
        }
        return stenoKeys;
    };

    /**
     * Adds a key to the stroke.
     */
    this.addKey = function (key) {
        keys[key] = key;
    };

    /**
     * Removes a key from the stroke.
     */
    this.removeKey = function (key) {
        if (key in keys) {
            delete keys[key];
        }
    }
}

/**
 * Creates a new Word.
 * @class Represents a word.
 * @param {Object} strokesParam A list of strokes.
 */
function Word(strokesParam) {
    /** @private */
    var strokes = strokesParam;

    var string = '';
    if (strokes.length > 0) {
        for (var i = 0; i < strokes.length; i++) {
            string += strokes[i].toRTFCRE() + '/';
        }
        string = string.slice(0, -1);
    }

    /**
     * Custom toString function to create unique identifier.
     * @return {string}
     */
    this.toString = function () {
        return string;
    };

    /**
     * Accessor that gets the list of strokes.
     * @return The list of strokes.
     */
    this.getStrokes = function () {
        return strokes;
    };

    /**
     * Mutator that sets the list of strokes.
     * @param {Object} newStrokes A list of strokes.
     * @return The list of strokes.
     */
    this.setStrokes = function (newStrokes) {
        strokes = newStrokes;
    };

    /**
     * Adds a stroke to the word.
     * @param {Object} strokeParam A stroke object.
     */
    this.addStroke = function (strokeParam) {
        strokes.push(strokeParam);
        string += '/' + strokeParam.toRTFCRE();
    };

    /**
     * Removes a stroke from the word.
     */
    this.removeStroke = function () {
        strokes.pop();
        var stringArray = string.split('/');
        string = '';
        if (strokes.length > 0) {
            for (var i = 0; i < stringArray.length - 1; i++) {
                string += stringArray[i] + '/';
            }
            string = string.slice(0, -1);
        }
    };

    /**
     * Converts the strokes to English.
     * @return {string} The English translation.
     */
    this.toEnglish = function () {
        if (dictionary[string]) { // if there exists a translation
            return dictionary[string];
        } else if ($.isNumeric(string)) {
            return string;
        } else { // else, return the RTF/CRE formatted strokes.
            return ''
        }
    }
}

/**
 * Creates a new VerticalNote.
 * @class Represents a vertical note.
 * @param {Object} timestampParam A Date object.
 * @param {Object} strokeParam A Chord object.
 */
function VerticalNote(timestampParam, strokeParam) {
    /** @private */
    var timestamp = timestampParam;

    /** @private */
    var stroke = strokeParam;

    var string = zeroFill(timestamp.getHours(), 2) + ':' + zeroFill(timestamp.getMinutes(), 2) + ':' + zeroFill(timestamp.getSeconds(), 2) + '.' + zeroFill(timestamp.getMilliseconds(), 3) + ' ';
    for (var i = parseInt('00000000000000000000001', 2); i <= parseInt('1000000000000000000000000', 2); i <<= 1) {
        if (stroke.toBinary() & i) {
            string += binaryToSteno[i].replace(/-/g, '');
        } else {
            string += ' ';
        }
    }
    string = string.trim();
    string += '\n';

    /**
     * Custom toString function to create unique identifier.
     * @return {string}
     */
    this.toString = function () {
        return string;
    };

    /**
     * Accessor that gets the timestamp.
     * @return The timestamp.
     */
    this.getTimestamp = function () {
        return timestamp;
    };

    /**
     * Accessor that gets the chord.
     * @return The chord.
     */
    this.getStroke = function () {
        return stroke;
    };

    /**
     * Mutator that sets the timestamp.
     * @param {Object} newTimestamp A new Date object.
     */
    this.setTimestamp = function (newTimestamp) {
        timestamp = newTimestamp;
    };

    /**
     * Mutator that sets the chord.
     * @param {Object} newStroke A new Chord object.
     */
    this.setStroke = function (newStroke) {
        stroke = newStroke;
    }
}

function checkIsActive() {
    // return $(".shorthand").length > 0;
    return true;
}


// EVENT HANDLERS

/**
 * This will handle the key down event.
 * @event
 * @see keydown method: http://api.jquery.com/keydown/
 * @see event.preventDefault method: http://api.jquery.com/event.preventDefault/
 * @see event.stopPropagation method: http://api.jquery.com/event.stopPropagation/
 * @see jQuery.isEmptyObjecy method: http://api.jquery.com/jQuery.isEmptyObject/
 */
$(document).keydown(function (event) {
    if (checkIsActive()) {
        // Check to see if this is the start of a new stroke.
        if ($.isEmptyObject(downKeys)) { // if no keys were being pressed down before, this is the start of a new stroke.
            resetKeys(); // so clear the keys before processing the event.
        }

        // Create a new Key Object based on the event.
        var key = new Key(event.which);

        // Update the appropriate lists
        downKeys[key] = key; // add key to the list of keys currently being pressed down
        chordKeys[key] = key; // add key to the list of keys in this stroke

        // Update the display
        if (type === "key") {
            let valueSteno = $(".require-key").find(".stenoKey").attr("data-valueSteno")
            let idFinger;
            if (key.toSteno() === valueSteno) {
                for (let i = 0; i < listKey.length; i++) {
                    if (valueSteno === listKey[i].valueSteno) {
                        $(".code" + listKey[i].keyQwerty).css({
                            "background-color": "#00ff04",
                            "color": "black",
                        })
                    }
                }

                for (let i = 0; i < listLayoutFinger.length; i++) {
                    if (listLayoutFinger[i].list.includes(key.getKeyCode())) {
                        idFinger = listLayoutFinger[i].idFinger
                        break
                    }
                }
                $(".finger-" + idFinger).css("fill", "#00ff04")
            } else {
                $('.code' + key.getKeyCode()).css('background-color', '#ff0000'); // color the qwerty keyboard
                colorCode(chordKeys); // color the steno keyboard
                for (let i = 0; i < listLayoutFinger.length; i++) {
                    if (listLayoutFinger[i].list.includes(key.getKeyCode())) {
                        idFinger = listLayoutFinger[i].idFinger
                        break
                    }
                }
                $(".finger-" + idFinger).css("fill", "#ff0000")
            }
        } else if (type === "phonetics" || type === "word") {
            let requirePhonetic = $(".require-key").find("h4").attr("data-key")
            let listKeySplit = convertWordToArrayKey(requirePhonetic)
            let idFinger
            if (listKeySplit.includes(key.toSteno())) {
                for (let i = 0; i < listLayoutFinger.length; i++) {
                    if (listLayoutFinger[i].list.includes(key.getKeyCode())) {
                        idFinger = listLayoutFinger[i].idFinger
                        break
                    }
                }
                $(".finger-" + idFinger).css("fill", "#00ff04")
                $(".code" + key.getKeyCode()).css({
                    "background-color": "#00ff04",
                    "color": "black",
                })
            } else {
                $('.code' + key.getKeyCode()).css('background-color', '#ff0000'); // color the qwerty keyboard
                colorCode(chordKeys); // color the steno keyboard
                for (let i = 0; i < listLayoutFinger.length; i++) {
                    if (listLayoutFinger[i].list.includes(key.getKeyCode())) {
                        idFinger = listLayoutFinger[i].idFinger
                        break
                    }
                }
                $(".finger-" + idFinger).css("fill", "#ff0000")
            }
        } else if (type === "sentence" || type === "exam") {
            let requirePhonetic = requireStenoArr[count]
            let listKeySplit = convertWordToArrayKey(requirePhonetic)
            let idFinger
            if (listKeySplit.includes(key.toSteno())) {
                for (let i = 0; i < listLayoutFinger.length; i++) {
                    if (listLayoutFinger[i].list.includes(key.getKeyCode())) {
                        idFinger = listLayoutFinger[i].idFinger
                        break
                    }
                }
                $(".finger-" + idFinger).css("fill", "#00ff04")
                $(".code" + key.getKeyCode()).css({
                    "background-color": "#00ff04",
                    "color": "black",
                })
            } else {
                $('.code' + key.getKeyCode()).css('background-color', '#ff0000'); // color the qwerty keyboard
                colorCode(chordKeys); // color the steno keyboard
                for (let i = 0; i < listLayoutFinger.length; i++) {
                    if (listLayoutFinger[i].list.includes(key.getKeyCode())) {
                        idFinger = listLayoutFinger[i].idFinger
                        break
                    }
                }
                $(".finger-" + idFinger).css("fill", "#ff0000")
            }
        }

        // See if this key is a valid steno key
        // if (!keyCodeToSteno[key.getKeyCode()]) { // if the key code does not have a steno translation
        //     isSteno = false;
        //     console.debug("Steno false on keydown");
        // }


        // Handle potential conflicts
        // removed check for isSteno here to prevent "stop working after error" bug --Erika
        event.preventDefault(); // will prevent potential conflicts with browser hotkeys like firefox's hotkey for quicklinks (')

    }
});

/**
 * This will handle the key up event.
 * @event
 * @see keydown method: http://api.jquery.com/keyup/
 * @see event.preventDefault method: http://api.jquery.com/event.preventDefault/
 * @see event.stopPropagation method: http://api.jquery.com/event.stopPropagation/
 * @see jQuery.isEmptyObjecy method: http://api.jquery.com/jQuery.isEmptyObject/
 */

let temp = ''
let checkCorrectArr = []
let totalWord = 0
let correctWord = 0
let accuracy = 0
let wpm = 0
let currentTime = 0
$(document).keyup(function (event) {

    if (checkIsActive()) {
        // Create a new Key Object based on the event.
        var key = new Key(event.which);

        // Update the appropriate lists
        delete downKeys[key]; // remove key from the list of keys currently being pressed down

        // Update the display
        // $('.stdKey.code' + event.which).css('background-color', '#000000'); // color the qwerty keyboard

        if (isSteno) {
            // Check to see if this is the end of the stroke.
            if ($.isEmptyObject(downKeys)) { // if no more keys are being pressed down, this is the end of the stroke.
                var timestamp = new Date();
                var chord = new Chord(chordKeys);
                // var verticalNote = new VerticalNote(timestamp, chord);
                var word = new Word([chord]);
                switch (type) {
                    case "key":
                        var valueSteno = $(".require-key").find(".stenoKey").attr("data-valueSteno")
                        if (word.getStrokes()[0].toStenoKeys()[valueSteno]) {
                            generateNextKey()
                        }
                        break
                    case "phonetics":
                    case "word":
                        let inputText = word.toEnglish().toUpperCase()
                        let requirePhonetic = $(".require-key").find("h4").attr("data-value").toUpperCase()
                        $("#typing-value").val(inputText)
                        if (requirePhonetic === inputText) {
                            generateNextKey()
                            correctWord++
                            currentTime = new Date().getTime()
                            wpm = correctWord / (currentTime - timeStart) * 60000
                            wpm = Math.round(wpm)
                            $("#correct-word-value").html(correctWord)
                            $("#wpm-value").html(wpm)
                        }
                        totalWord++
                        accuracy = Math.round( correctWord/totalWord * 1000 + Number.EPSILON ) / 10
                        $("#total-word-value").html(totalWord)
                        $("#accuracy-value").html(accuracy + '%')
                        break
                    case "sentence":
                    case "exam":
                        let ctrlKey = 17,
                            cKey = 67,
                            vKey = 86

                        if (chord.toKeyCodes()[ctrlKey]) {
                            if (chord.toKeyCodes()[cKey] && chord.toKeyCodes()[ctrlKey]) {
                                temp = window.getSelection().toString()
                                document.execCommand('copy')
                            }
                            if (chord.toKeyCodes()[vKey] && chord.toKeyCodes()[ctrlKey]) {
                                document.execCommand('paste')
                                $("#input-sentence").val(temp)
                            }
                            if (chord.toKeyCodes()[116] && chord.toKeyCodes()[ctrlKey]) {
                                location.reload(true)
                            }
                        } else {
                            chords.push(chord);
                            if (words.length > 0 && chord.toRTFCRE() !== '*' && dictionary[words[words.length - 1].toString() + '/' + chord.toRTFCRE()]) {
                                words[words.length - 1].addStroke(chord);
                            } else if (words.length > 0 && chord.toRTFCRE() === '*') {
                                words[words.length - 1].removeStroke();
                                if (words[words.length - 1].toString() === '') {
                                    words.pop();
                                    count = words.length
                                }
                            } else if (word.toEnglish() !== '') {
                                words.push(word);
                                if (words[words.length - 1].toString() === requireStenoArr[words.length - 1]) {
                                    count = words.length
                                    correctWord++
                                    currentTime = new Date().getTime()
                                    wpm = correctWord / (currentTime - timeStart) * 60000
                                    wpm = Math.round(wpm)
                                    $("#correct-word-value").html(correctWord)
                                    $("#wpm-value").html(wpm)
                                }
                                totalWord++
                                accuracy = Math.round( correctWord/totalWord * 1000 + Number.EPSILON ) / 10
                                $("#total-word-value").html(totalWord)
                                $("#accuracy-value").html(accuracy + '%')
                            }

                            let translatedString = '';
                            let startPos = document.getElementById('typing-value').selectionStart
                            if (chord.toRTFCRE() === '*') {
                                translatedString = $("#typing-value").val()
                                let index
                                for (let i = translatedString.length; i >= 0; i--) {
                                    if (translatedString[i] !== ' ') {
                                        index = i - 1
                                        break
                                    }
                                }
                                translatedString = translatedString.substring(0, index)
                                index = translatedString.lastIndexOf(' ') + 1
                                translatedString = translatedString.substring(0, index - 1)
                                $("#typing-value").val(translatedString)
                            } else if (word.toEnglish() !== '') {
                                if ((words.length > 1) && ((words[words.length - 2].toEnglish() === "{^ ^}{-|}") || (words[words.length - 2].toEnglish() === "{-|}"))) {
                                    translatedString = $("#typing-value").val()
                                    if (translatedString[startPos - 2] === ' ') {
                                        let temp = words[words.length - 2].toEnglish() + words[words.length - 1].toEnglish()
                                        temp = demetafy(temp);
                                        translatedString = translatedString.substring(0, translatedString.length - 1) + temp.trim()
                                        $("#typing-value").val(translatedString)
                                    } else {
                                        let temp = words[words.length - 2].toEnglish() + words[words.length - 1].toEnglish()
                                        temp = demetafy(temp);
                                        translatedString = translatedString + temp.trim()
                                        $("#typing-value").val(translatedString)
                                    }
                                } else if ($("#typing-value").val() !== '') {
                                    translatedString = $("#typing-value").val()
                                    let temp = demetafy(words[words.length - 1].toEnglish())
                                    let reg = new RegExp("^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ]+$")
                                    if (reg.test(temp)) {
                                        if (translatedString[startPos - 1] === ' ') {
                                            translatedString = translatedString + temp
                                            $("#typing-value").val(demetafy(translatedString))
                                        } else {
                                            translatedString = translatedString + ' ' + temp
                                            $("#typing-value").val(demetafy(translatedString))
                                        }
                                    } else {
                                        translatedString = translatedString + temp
                                        $("#typing-value").val(demetafy(translatedString))
                                    }
                                } else {
                                    translatedString = demetafy(words[words.length - 1].toEnglish())
                                    $("#typing-value").val(demetafy(translatedString))
                                }
                            }

                            let outputValue = $("#typing-value").val().trim()
                            let outputArr = outputValue.split(/(\s+)/).filter(e => e.trim().length > 0);
                            for (let i = 0; i < outputArr.length; i++) {
                                if (outputArr[i] === sampleSentenceArr[i]) {
                                    checkCorrectArr.push(1)
                                } else checkCorrectArr.push(0)
                            }

                            for (let i = 0; i < requireSentenceArr.length; i++) {
                                if (checkCorrectArr[i] === 0) {
                                    requireSentenceArr[i] = '<span style="color: red">' + sampleSentenceArr[i] + '</span>';
                                } else if (checkCorrectArr[i] === 1) {
                                    requireSentenceArr[i] = '<span style="color: blue">' + sampleSentenceArr[i] + '</span>';
                                }
                            }
                            $("#require-sentence").empty()
                            $("#require-sentence").append(requireSentenceArr.join(' '));
                            checkCorrectArr = []

                            if (outputArr.length === sampleSentenceArr.length) {
                                if (outputArr[outputArr.length - 1] === sampleSentenceArr[sampleSentenceArr.length - 1]) {
                                    if (outputValue === sampleSentence) {
                                        count = 0
                                        words = []
                                        outputArr = []
                                        currentTime = new Date().getTime()
                                        $("#time-typing-result").html(msToTime(currentTime - timeStart))
                                        $("#time-typing-result").attr("data-value", currentTime - timeStart)
                                        $("#wpm-result").html($("#wpm-value").html())
                                        $("#total-word-result").html($("#total-word-value").html())
                                        $("#correct-word-result").html($("#correct-word-value").html())
                                        $("#accuracy-result").html($("#accuracy-value").html())
                                        if (type === "exam") {
                                            let typeExam = $("#type-exam").attr("data-value")
                                            let currentResult
                                            let requireValue
                                            switch (typeExam) {
                                                case "wpm":
                                                    currentResult = parseInt($("#wpm-result").html())
                                                    requireValue = parseInt($("#require-value").attr("data-value"))
                                                    if (currentResult < requireValue) {
                                                        $("#status-result").html(`<span class="badge btn-warning">Không đạt</span>`)
                                                        $("#status-result").attr("data-value", 0)
                                                    } else {
                                                        $("#status-result").html(`<span class="badge btn-success">Đạt</span>`)
                                                        $("#status-result").attr("data-value", 1)
                                                    }
                                                    break
                                                case "time":
                                                    currentResult = parseInt($("#wpm-result").html())
                                                    requireValue = parseInt($("#require-value").attr("data-value"))
                                                    if (currentResult < requireValue) {
                                                        $("#status-result").html(`<span class="badge btn-warning">Không đạt</span>`)
                                                        $("#status-result").attr("data-value", 0)
                                                    } else {
                                                        $("#status-result").html(`<span class="badge btn-success">Đạt</span>`)
                                                        $("#status-result").attr("data-value", 1)
                                                    }
                                                    break
                                                case "accuracy":
                                                    currentResult = parseInt($("#accuracy-result").html().replace('%', ''))
                                                    requireValue = parseInt($("#require-value").attr("data-value"))
                                                    if (currentResult < requireValue) {
                                                        $("#status-result").html(`<span class="badge btn-warning">Không đạt</span>`)
                                                        $("#status-result").attr("data-value", 0)
                                                    } else {
                                                        $("#status-result").html(`<span class="badge btn-success">Đạt</span>`)
                                                        $("#status-result").attr("data-value", 1)
                                                    }
                                                    break
                                            }

                                            submitResultExam()
                                        }
                                        $("#wpm-value").html(0)
                                        $("#total-word-value").html(0)
                                        $("#correct-word-value").html(0)
                                        $("#accuracy-value").html(0)

                                        $("#modal-result").modal("toggle")
                                        $("#clock").remove()
                                        $(".clock").append(`<div id="clock"></div>`)
                                        $("#clock").clock({
                                            width: 200,
                                            height: 300,
                                            date: new Date(0, 0, 0, 0, 0, 0, 0)
                                        }).data('clock').pause()
                                        window.clearInterval()
                                    }
                                }
                            }
                        }
                        break
                }
                var string = zeroFill(timestamp.getFullYear(), 4) + '-' + zeroFill(timestamp.getMonth() + 1, 2) + '-' + zeroFill(timestamp.getDay(), 2) + ' ' + zeroFill(timestamp.getHours(), 2) + ':' + zeroFill(timestamp.getMinutes(), 2) + ':' + zeroFill(timestamp.getSeconds(), 2) + '.' + zeroFill(timestamp.getMilliseconds(), 3);
                if (word.toEnglish() !== '') {
                    valueType[string] = word.toEnglish()
                } else {
                    valueType[string] = word.toString()
                }

                countLog++
                if (countLog === 5) {
                    writeLogTyping(valueType)
                    countLog = 0
                    valueType = {}
                }
                resetKeys()

                // verticalNotes.push(verticalNote);

                // $('#verticalNotes').append(verticalNote.toString());
                // document.getElementById('verticalNotes').scrollTop = document.getElementById('verticalNotes').scrollHeight; // scroll the textarea to the bottom

                // chords.push(chord);

                // if (words.length > 0 && chord.toRTFCRE() !== '*' && dictionary[words[words.length - 1].toString() + '/' + chord.toRTFCRE()]) {
                //     words[words.length - 1].addStroke(chord);
                // } else if (words.length > 0 && chord.toRTFCRE() === '*') {
                //     words[words.length - 1].removeStroke();
                //     if (words[words.length - 1].toString() === '') {
                //         words.pop();
                //     }
                // } else if (word.toEnglish() !== '') {
                //     words.push(word);
                // }
                //
                // let translatedString = '';
                // let startPos = document.getElementById('output').selectionStart
                // if (chord.toRTFCRE() === '*') {
                //     translatedString = $("#output").val()
                //     let firstString = translatedString.substring(0, startPos)
                //     let lastString = translatedString.substring(startPos, translatedString.length)
                //     let index
                //     for (let i = firstString.length; i >= 0; i--) {
                //         if (firstString[i] !== ' ') {
                //             index = i - 1
                //             break
                //         }
                //     }
                //     firstString = firstString.substring(0, index)
                //     index = firstString.lastIndexOf(' ') + 1
                //     firstString = firstString.substring(0, index - 1)
                //     translatedString = firstString + lastString
                //     translatedStringArrayUndo.push(translatedString)
                //     $("#output").html(translatedStringArrayUndo[translatedStringArrayUndo.length - 1])
                //     setCaretToPos(document.getElementById("output"), index)
                // } else if (word.toEnglish() !== '') {
                //     if ((words.length > 1) && ((words[words.length - 2].toEnglish() === "{^ ^}{-|}") || (words[words.length - 2].toEnglish() === "{-|}"))) {
                //         translatedString = $("#output").val()
                //         if (translatedString[startPos - 2] === ' ') {
                //             let temp = words[words.length - 2].toEnglish() + words[words.length - 1].toEnglish()
                //             temp = demetafy(temp);
                //             translatedString = translatedString.substring(0, startPos - 1) + temp.trim() + translatedString.substring(startPos, translatedString.length)
                //             translatedStringArrayUndo.push(translatedString)
                //             $("#output").html(translatedStringArrayUndo[translatedStringArrayUndo.length - 1])
                //             setCaretToPos(document.getElementById("output"), startPos + temp.length - 1)
                //         } else {
                //             let temp = words[words.length - 2].toEnglish() + words[words.length - 1].toEnglish()
                //             temp = demetafy(temp);
                //             translatedString = translatedString.substring(0, startPos) + temp.trim() + translatedString.substring(startPos, translatedString.length)
                //             translatedStringArrayUndo.push(translatedString)
                //             $("#output").html(translatedStringArrayUndo[translatedStringArrayUndo.length - 1])
                //             setCaretToPos(document.getElementById("output"), startPos + temp.length)
                //         }
                //     } else if ($("#output").val() !== '') {
                //         translatedString = $("#output").val()
                //         let temp = demetafy(words[words.length - 1].toEnglish())
                //         let reg = new RegExp("^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ]+$")
                //         if (reg.test(temp)) {
                //             if (translatedString[startPos - 1] === ' ') {
                //                 translatedString = translatedString.substring(0, startPos) + temp + translatedString.substring(startPos, translatedString.length)
                //                 translatedStringArrayUndo.push(translatedString)
                //                 $("#output").html(demetafy(translatedStringArrayUndo[translatedStringArrayUndo.length - 1]))
                //                 setCaretToPos(document.getElementById("output"), startPos + temp.length)
                //             } else {
                //                 translatedString = translatedString.substring(0, startPos) + ' ' + temp + translatedString.substring(startPos, translatedString.length)
                //                 translatedStringArrayUndo.push(translatedString)
                //                 $("#output").html(demetafy(translatedStringArrayUndo[translatedStringArrayUndo.length - 1]))
                //                 setCaretToPos(document.getElementById("output"), startPos + temp.length + 1)
                //             }
                //         } else {
                //             translatedString = translatedString.substring(0, startPos) + temp + translatedString.substring(startPos, translatedString.length)
                //             translatedStringArrayUndo.push(translatedString)
                //             $("#output").html(demetafy(translatedStringArrayUndo[translatedStringArrayUndo.length - 1]))
                //             setCaretToPos(document.getElementById("output"), startPos + temp.length)
                //         }
                //     } else {
                //         translatedString = demetafy(words[words.length - 1].toEnglish())
                //         translatedStringArrayUndo.push(translatedString)
                //         $("#output").html(demetafy(translatedStringArrayUndo[translatedStringArrayUndo.length - 1]))
                //         setCaretToPos(document.getElementById("output"), $("#output").val().length)
                //     }
                // }
                // if (translatedStringArrayUndo.length > 20) {
                //     translatedStringArrayUndo.shift()
                // }
                // $('#output').html(demetafy(translatedString));
            }

            // Handle potential conflicts
            event.preventDefault();	// will prevent potential conflicts with browser hotkeys like firefox's hotkey for quicklinks (')
            //event.stopPropagation();
        }
    }
});

/**
 * This will handle the event when the window loses focus.
 * @event
 * @see jQuery's <a href="http://api.jquery.com/blur/">blur method</a>
 */
// $(window).blur(function () {
//     resetKeys();
// });

/**
 * This will handle the event when the window gains focus.
 * @event
 * @see jQuery's <a href="http://api.jquery.com/focus/">focus method</a>
 */
// $(window).focus(function () {
//     resetKeys();
// });

function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function setCaretToPos(input, pos) {
    setSelectionRange(input, pos, pos);
}

function msToTime (ms) {
    var seconds = (ms/1000);
    var minutes = parseInt(seconds/60, 10);
    seconds = seconds%60;
    var hours = parseInt(minutes/60, 10);
    minutes = minutes%60;
    seconds = Math.round(seconds)
    if (hours !== 0) {
        return hours + ':' + minutes + ':' + seconds;
    } else {
        return minutes + ':' + seconds;
    }
}