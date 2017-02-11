function iteration(z, c) { //迭代30次,返回arr[],arr[0]记录迭代次数
    function f(z, c) { //f(z)=z^2+c ,z,c = x+yi
        var res = {};
        res.x = z.x * z.x - z.y * z.y + c.x;
        res.y = 2 * z.x * z.y + c.y;
        res.r = Math.sqrt(res.x * res.x + res.y * res.y);
        return res;
    }

    var res = f(z, c); //第一次计算
    var arr = [1, res];
    if (res.r > 2)
        return arr;
    for (var i = 2; i <= 30; i++) { //迭代
        arr[i] = f(arr[i - 1], c);
        if (arr[i].r > 2)
            break;
    }
    if (i == 31) //迭代完30次后会i++所以减回来
        i--;
    arr[0] = i;
    return arr;
}
var color = [0, //下标1到30，0随便填个数
    '#2A42FF', '#74A4FF', '#B5D0FF', '#A2FFC3', '#89FFC1',
    '#6DFF66', '#41FF6A', '#94FF4E', '#B5FF6B', '#ECFFA5',
    '#FFF987', '#EEFF64', '#F2FF54', '#FFE73C', '#FFCB3E',
    '#FFDD4A', '#FFAA34', '#FF8C1D', '#FF7C29', '#FF522A',
    '#FF4C2F', '#FF553C', '#FF3533', '#FF1F3D', '#FF1C64',
    '#FF209F', '#FF2DF1', '#E454FF', '#36F3FF', '#252525'
];
function colorToRGB(color) {
    var r = "0x" + color[1] + color[2];
    var g = "0x" + color[3] + color[4];
    var b = "0x" + color[5] + color[6];
    return [r, g, b];
}
function change(i, canvas, scale) { //像素一维数组下标i到复数z
    var z = {};
    var x = i % canvas.width;
    var y = i / canvas.width;
    z.x = (x - parseInt(canvas.width / 2)) / scale;
    z.y = (parseInt(canvas.height / 2) - y) / scale;
    return z;
}
function draw(set, zc, canvas, context, scale) {
    //imageData是一个对象,有data,width,height三个属性
    //data是个数组,保存了每个像素的rgba值,所以data数组的长度=4*width*height
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var pixelData = imageData.data;
    var numPiexel = imageData.data.length / 4;
    for (var i = 0; i < numPiexel; ++i) {
        var z, c;
        if (set === "J") {
            z = change(i, canvas, scale);
            c = zc;
        } else {
            z = zc;
            c = change(i, canvas, scale);
        }
        var arr = iteration(z, c);
        var t = colorToRGB(color[arr[0]]);
        var r = t[0];
        var g = t[1];
        var b = t[2];
        pixelData[i * 4] = r;
        pixelData[i * 4 + 1] = g;
        pixelData[i * 4 + 2] = b;
        pixelData[i * 4 + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);
}
(function () { //Julia集
    var canvas = document.getElementById('DrawJulia');
    canvas.width = 801; //801/2=400.5,为了处理坐标和像素的偏移问题
    canvas.height = 601;
    var context = canvas.getContext('2d');
    var c = {x: 0, y: 0};//c = x+yi , 初始为0
    var scale = 200;//缩放比例，每单位长度对应像素

    draw("J", c, canvas, context, scale);

    var A = document.getElementById('scaleOutputA');
    var B = document.getElementById('scaleOutputB');
    var C = document.getElementById('c');
    var showC = document.getElementById('showC');
    C.oninput = function (e) { //修改滑动条的时候修改c的值
        var value = e.target.value;
        var change = document.getElementById(e.target.id.replace("scaleSlider", "scaleOutput"));
        change.innerHTML = parseFloat(value).toFixed(3);
        showC.innerHTML = A.innerHTML + "+" + B.innerHTML + "i";
        c.x = parseFloat(A.innerHTML);
        c.y = parseFloat(B.innerHTML);
        draw("J", c, canvas, context, scale);
    };
}());
(function () { //Mandelbrot集
    var canvas = document.getElementById('DrawMandelbrot');
    canvas.width = 801; //801/2=400.5,为了处理坐标和像素的偏移问题
    canvas.height = 601;
    var context = canvas.getContext('2d');
    var z = {x: 0.0, y: 0.0};//z = x+yi , 初始为0
    var scale = 200;//缩放比例，每单位长度对应像素
    draw("M", z, canvas, context, scale);
}());
