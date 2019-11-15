var offsetAngle = 0
var resAngle = 0 
var ringCenter = []
var startPointer
var pointerDown = false
var seg = 360 / 26
var key = 0


spin = window.setInterval(function(){
    seg = 360 / 26
    setAngle(offsetAngle)           
    offsetAngle+= .1
    updateKey()
}, 5);

function updateKey(){
    key = (26 + Math.floor((offsetAngle + resAngle + .5 * seg) / seg)) % 26
    $('#key').text(key)
}

$('#key').on('input', function(){ 
    newAngle = $(this).text()
    setAngle(newAngle * seg, true, Math.abs((offsetAngle / seg) - newAngle) * .4)
    offsetAngle = newAngle * seg
});

function setAngle(angle, transition = false, length = 1){
    if (transition)
        $("#ringOut").css({transition: "transform " +length+ "s", transform:"rotate("+angle+"deg)"}); 
    else
        $("#ringOut").css({transition: 'none',transform:"rotate("+angle+"deg)"}); 
}

$("#ringOut").mousedown(function(){
    window.clearTimeout(spin)
    ringBox = $(this)[0].getBoundingClientRect()
    ringCenter = {x: ringBox.x + .5*ringBox.width,
                  y: ringBox.y + .5*ringBox.height}
    pointerDown = true
    startPointer = {x:event.clientX, y:event.clientY}
})

$("body").mousemove(function(){
    if(pointerDown){
        resAngle = Math.atan2(event.clientY - ringCenter.y, event.clientX - ringCenter.x) - 
        Math.atan2(startPointer.y - ringCenter.y, startPointer.x - ringCenter.x);
        resAngle *= 180 / Math.PI
        setAngle(offsetAngle + resAngle)
        updateKey()
    }                           
})

function end(){
    if(pointerDown){
        offsetAngle = seg * Math.floor((offsetAngle + resAngle + .5 * seg)/seg)
        setAngle(offsetAngle, true) 
        pointerDown = false
        resAngle = 0
        updateKey()
    }
}

$("body").mouseup(function(){end()})
$("html").mouseleave(function(){end()})