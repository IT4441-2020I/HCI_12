$(document).ready(function () {
    let stenoUpperBank = $(".stenoUpperBank");
    stenoUpperBank.empty();
    let stenoLowerBank = $(".stenoLowerBank");
    stenoLowerBank.empty();
    let stenoVowelKeys = $(".stenoVowelKeys");
    stenoVowelKeys.empty();
    let stdKeyboard = "#stdKeyboard";
    for (let j = 0; j < listKey.length; j++) {
        let textStd = `<span class="upper">` + listKey[j].valueSteno.replace('-', '') + `</span><span class="lower-left"  style="color: #6b6b47">` + listKey[j].valueQwerty.toUpperCase() + `</span>`
        $(stdKeyboard).find(".code" + listKey[j].keyQwerty).empty()
        $(stdKeyboard).find(".code" + listKey[j].keyQwerty).append(textStd)
        if (listKey[j].idLayout < 10) {
            let text = `<div class="stenoKey square code` + listKey[j].keyQwerty + `" id="stenoKey-` + listKey[j].idLayout + `"
                            data-priority="` + listKey[j].priority + `" data-keyQwerty="` + listKey[j].keyQwerty + `"
                            data-valueQwerty="` + listKey[j].valueQwerty + `">` + listKey[j].valueSteno.replace('-', '') + `</div>`;
            stenoUpperBank.append(text)
        } else if (listKey[j].idLayout < 20) {
            let text = `<div class="stenoKey rounded code` + listKey[j].keyQwerty + `" id="stenoKey-` + listKey[j].idLayout + `"
                            data-priority="` + listKey[j].priority + `" data-keyQwerty="` + listKey[j].keyQwerty + `"
                            data-valueQwerty="` + listKey[j].valueQwerty + `">` + listKey[j].valueSteno.replace('-', '') + `</div>`;
            stenoLowerBank.append(text)
        } else {
            let text = `<div class="stenoKey rounded code` + listKey[j].keyQwerty + `" id="stenoKey-` + listKey[j].idLayout + `"
                            data-priority="` + listKey[j].priority + `" data-keyQwerty="` + listKey[j].keyQwerty + `"
                            data-valueQwerty="` + listKey[j].valueQwerty + `">` + listKey[j].valueSteno.replace('-', '') + `</div>`;
            stenoVowelKeys.append(text)
        }
    }

    $.getJSON('../../' + $.base64.decode(pathSentence), function (data) {
        sentences = data;
    });
    setTimeout(function () {
        generateNextSentence()
    }, 3000)

    window.setInterval(function () {
        writeLogTyping(valueType)
        countLog = 0
        valueType = {}
    }, 1000 * 60 * 5);
    // for (let i = 0; i < 24; i++) {
    //     let keyQwerty = $("#stenoKey-" + i).attr("data-keyQwerty");
    //     for (let j = 0; j < listLayoutFinger.length; j++) {
    //         let arr = listLayoutFinger[j].list
    //         let check = false;
    //         for (let k = 0; k < arr.length; k++) {
    //             if (arr[k] === parseInt(keyQwerty)) {
    //                 check = true;
    //             }
    //         }
    //         if (check === true) {
    //             if (j > 4) {
    //                 $("#stenoKey-" + i).css({
    //                     "background-color": color[listLayoutFinger[j].idFinger],
    //                     "color": "black",
    //                 })
    //             } else {
    //                 $("#stenoKey-" + i).css({"background-color": color[listLayoutFinger[j].idFinger], "color": "black"})
    //             }
    //         }
    //     }
    // }
})

function generateNextSentence() {
    for (let i = 0; i < listKey.length; i++) {
        $(".code" + listKey[i].keyQwerty).css({
            "background-color": "rgb(0,0,0)",
            "color": "white",
        })
    }
    for (let i = 0; i < 10; i++) {
        $(".finger-" + i).css("fill", "white")
    }
    $("#clock").remove()
    $(".clock").append(`<div id="clock"></div>`)
    $("#clock").clock({
        width: 200,
        height: 300,
        date: new Date(0, 0, 0, 0, 0, 0, 0)
    })
    $("#typing-value").val("")
    timeStart = new Date().getTime()
    window.setInterval(function () {
        currentTime = new Date().getTime()
        wpm = correctWord / (currentTime - timeStart) * 60000
        wpm = Math.round(wpm)
        $("#wpm-value").html(wpm)
    }, 1500);
    randomRequireSentence()
}

function randomRequireSentence() {
    let requireKey = $(".require-key")
    let numberRandom;
    let idFinger;
    let text
    let sentenceArray = Object.getOwnPropertyNames(sentences)
    numberRandom = getRandomInt(sentenceArray.length)
    text = `<div class="col-12" id="require-sentence">` + sentenceArray[numberRandom] + `</div>`
    requireKey.empty()
    requireKey.append(text)
    sampleSentence = sentenceArray[numberRandom].trim()
    requireSentenceArr = sentenceArray[numberRandom].trim().split(/(\s+)/).filter(e => e.trim().length > 0)
    sampleSentenceArr = sentenceArray[numberRandom].trim().split(/(\s+)/).filter(e => e.trim().length > 0)
    requireStenoArr = sentences[sentenceArray[numberRandom]].trim().split(/(\s+)/).filter(e => e.trim().length > 0)
    let listKeySplit = convertWordToArrayKey(requireStenoArr[count])
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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function convertWordToArrayKey(word) {
    let listTempt = [];
    for (let i = 0; i < word.length; i++) {
        listTempt.push(word.substring(i, i + 1))
    }
    let listKeySplit = []
    if (listTempt.indexOf("-") !== -1) {
        let part1 = [];
        for (let i = 0; i < listTempt.indexOf("-"); i++) {
            if (listTempt[i] !== '*') {
                part1.push(listTempt[i] + '-');
            } else {
                part1.push(listTempt[i])
            }
        }
        let part2 = [];
        for (let i = listTempt.indexOf("-") + 1; i < listTempt.length; i++) {
            if (listTempt[i] !== '*') {
                part2.push('-' + listTempt[i]);
            } else {
                part2.push(listTempt[i])
            }
        }
        listKeySplit = part1.concat(part2)
    } else {
        for (let i = 0; i < listTempt.length; i++) {
            if (listTempt[i] !== '*') {
                listKeySplit.push(listTempt[i] + '-');
            } else {
                listKeySplit.push(listTempt[i])
            }
        }
    }
    return listKeySplit
}

function addSentence() {
    let requireSentence = $("#input-sentence").val()
    $.ajax({
        url: "/api/v1/convert-steno.html",
        type: "post",
        data: {
            content: requireSentence,
            optionConvert: "VietnameseToSteno",
            typeFile: "noencode"
        },
        beforeSend: function () {
            $("#overlay").css({"display": "block"});
        },
        success: function (res) {
            $("#overlay").css({"display": "none"});
            generateSentenceAdding(requireSentence, res.data)
            $("#modal-add-sentence").modal('toggle')
            $("#input-sentence").val("")
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function generateSentenceAdding(requireSentence, stenoSentence) {
    for (let i = 0; i < listKey.length; i++) {
        $(".code" + listKey[i].keyQwerty).css({
            "background-color": "rgb(0,0,0)",
            "color": "white",
        })
    }
    for (let i = 0; i < 10; i++) {
        $(".finger-" + i).css("fill", "white")
    }
    $("#clock").remove()
    $(".clock").append(`<div id="clock"></div>`)
    $("#clock").clock({
        width: 200,
        height: 300,
        date: new Date(0, 0, 0, 0, 0, 0, 0)
    })
    $("#typing-value").val("")

    let requireKey = $(".require-key")
    let idFinger;
    let text
    text = `<div class="col-12" id="require-sentence">` + requireSentence + `</div>`
    requireKey.empty()
    requireKey.append(text)
    sampleSentence = requireSentence.trim()
    requireSentenceArr = requireSentence.trim().split(/(\s+)/).filter(e => e.trim().length > 0)
    sampleSentenceArr = requireSentence.trim().split(/(\s+)/).filter(e => e.trim().length > 0)
    requireStenoArr = stenoSentence.trim().split(/(\s+)/).filter(e => e.trim().length > 0)
    let listKeySplit = convertWordToArrayKey(requireStenoArr[count])
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