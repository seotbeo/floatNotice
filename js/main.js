var resources = new Array();
var type = 0;
var fontSize = 14;
var color = "#ffffff";
var font = "Nanum Gothic"
var noticeType = 0
var loading = false

function init() {
    fillComboBox();

    setNoticeType(typeList[0].id);
}

function setNoticeType(v) {
    if (loading) return;

    type = v;
    const c = document.getElementById("colorinput");
    c.value = getColorStr((typeList.find(item => item.id == type)).fontColor);
    color = "#" + c.value;

    loadResource(type);
}

function getColorStr(integer) {
    var value = 16777215 + integer;
    return value.toString(16);
}

function fillComboBox() {
    const selector = document.getElementById('type');

    typeList.forEach(item => {
        var t = document.createElement("option");
        t.value = t.innerHTML = item.id;
        selector.appendChild(t);
    })
}

function loadResource(type) {
    loading = true;
    
    const input = document.getElementById('input');
    var path = "floatNotice\\FloatNotice.";
    var format = ".png";
    noticeType = (typeList.find(item => item.id == type)).type;

    var reslist = [path + type + ".0" + format,
        path + type + ".1" + format,
        path + type + ".2" + format
    ];
    if (noticeType == 1) {
        reslist = [path + type + ".0" + format];
    }

    var loadedCount = 0;

    function resLoaded()
    {
        loadedCount++;
        if (loadedCount === reslist.length)
        {
            loading = false;
            requestAnimationFrame(() => draw(input.value));
        }
    }

    for (var i = 0; i < reslist.length; i++)
    {
        resources[i] = new Image();
        resources[i].src = reslist[i];
        resources[i].onload = resLoaded;
        if (resources[i].complete)
        {
            resources[i].onload();
        }
        else
        {
            resources[i].onload = resLoaded;
        }
    }
}

function draw(name) {
    if (loading) return;

    clear();

    if (name == undefined || name == "")
    {
        name = " ";
    }

    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");
    var w2 = 0;
    var h = (typeList.find(item => item.id == type)).y
    
    ctx.font = fontSize + "px " + font;
    ctx.textAlign = "left";
    ctx.letterSpacing = "2.33px";
    const rv = ctx.measureText(name);
    const fontWidth = Math.ceil(rv.width);


    if (noticeType == 0) {
        var w1 = resources[0].width
        var wc = resources[1].width
        var we = resources[2].width

        canvas.width = w1 + Math.ceil(fontWidth / wc) * wc + we;
        canvas.height = resources[0].height;

        ctx.imageSmoothingEnabled = false;
        ctx.font = fontSize + "px " + font;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.textAlign = "left";
        ctx.letterSpacing = "2.33px";

        ctx.drawImage(resources[0], 0, 0);
        for (let i = w1; i < w1 + fontWidth; i += wc) {
            ctx.drawImage(resources[1], i, 0);
            w2 = i;
        }
        w2 += resources[1].width;
        ctx.drawImage(resources[2], w2, 0);
        ctx.fillText(name, (w1 + w2 - fontWidth) / 2, h + fontSize/2 + 5);
    }
    else {
        var w1 = resources[0].width

        canvas.width = w1;
        canvas.height = resources[0].height;

        ctx.imageSmoothingEnabled = false;
        ctx.font = fontSize + "px " + font;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.textAlign = "left";
        ctx.letterSpacing = "2.33px";

        ctx.drawImage(resources[0], 0, 0);
        ctx.fillText(name, (w1 - fontWidth) / 2, h + fontSize/2 + 5);
    }
}

function clear() {
    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function save()
{
    const preview = document.getElementById("preview");
    const link = document.createElement("a");
    link.href = preview.toDataURL();
    link.setAttribute("download", "floatNotice");
    link.click();
    URL.revokeObjectURL(link.href);
    showAlert("이미지로 저장합니다.");
}

function colorChange() {
    const c = document.getElementById("colorinput");
    const input = document.getElementById('input');
    var value = c.value;
    if (value.length != 6)
    {
        value = "ffffff";
    }

    if (color == "#" + value)
    {
        showAlert("현재 적용 중인 색상과 동일합니다. " + color);
        return;
    }

    color = "#" + value;

    requestAnimationFrame(() => draw(input.value));
    showAlert("색이 변경되었습니다: " + color);
}

function checkboxMapleFont(event) {
    if (event.target.checked)
    {
        font = "MaplestoryOTFLight";
    }
    else
    {
        font = "Nanum Gothic";
    }
    const input = document.getElementById('input');
    requestAnimationFrame(() => draw(input.value));
    showAlert("폰트가 변경되었습니다.");
}