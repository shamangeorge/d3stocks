function animate(opts) {
    var start = new Date();
    var id = setInterval(function() {
        var timePassed = new Date - start
        var progress = timePassed / opts.duration
        if (progress > 1) progress = 1
        var delta = opts.delta(progress)

        opts.step(delta)
        if (progress == 1) {
            clearInterval(id)
            if (opts.removeId) {
                document.getElementById(opts.removeId).remove();
            }
        }

    }, opts.delay || 10)
}


function move(element, delta, duration, distance, remove) {
    var to = distance || 500;
    var rect = element.getBoundingClientRect();
    var from = rect.left;

    if (!remove) {
        animate({
            delay: 10,
            duration: duration || 1000, // 1 sec by default
            delta: delta,
            step: function(delta) {
                element.style.marginLeft = from + to * delta + "px"
            }
        })
    } else {
        animate({
            delay: 10,
            duration: duration || 1000, // 1 sec by default
            delta: delta,
            step: function(delta) {
                element.style.marginLeft = from + to * delta + "px"
            },
            removeId: remove
        })
    }
}

function linear(progress) {
    return progress;
}

function linear_inv(progress) {
    return -progress;
}

function quad(progress) {
    return Math.pow(progress, 2)
}

function circ(progress) {
    return 1 - Math.sin(Math.acos(progress))
}

function back(progress, x) {
    return Math.pow(progress, 2) * ((x + 1) * progress - x)
}

function bounce(progress) {
    for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (progress >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
        }
    }
}

function makeEaseOut(delta) {
    return function(progress) {
        return 1 - delta(1 - progress)
    }
}

function makeEaseInOut(delta) {
    return function(progress) {
        if (progress < .5)
            return delta(2 * progress) / 2
        else
            return (2 - delta(2 * (1 - progress))) / 2
    }
}

var bounceEaseInOut = makeEaseInOut(bounce)

var bounceEaseOut = makeEaseOut(bounce);

function elastic(progress, x) {
    return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress)
}

function highlight(elem) {
    var from = [255, 0, 0],
        to = [255, 255, 255]
        animate({
            delay: 10,
            duration: 1000,
            delta: linear,
            step: function(delta) {
                elem.style.backgroundColor = 'rgb(' +
                    Math.max(Math.min(parseInt((delta * (to[0] - from[0])) + from[0], 10), 255), 0) + ',' +
                    Math.max(Math.min(parseInt((delta * (to[1] - from[1])) + from[1], 10), 255), 0) + ',' +
                    Math.max(Math.min(parseInt((delta * (to[2] - from[2])) + from[2], 10), 255), 0) + ')'
            }
        })
}

function animateText(textArea) {
    var text = textArea.value
    var to = text.length,
        from = 0

        animate({
            delay: 20,
            duration: 5000,
            delta: bounce,
            step: function(delta) {
                var result = (to - from) * delta + from
                textArea.value = text.substr(0, Math.ceil(result))
            }
        })
}
