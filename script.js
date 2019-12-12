var offsetAngle = 0
var resAngle = 0 
var ringCenter = []
var startPointer
var pointerDown = false
var seg = 360 / 26
var key = 0
var last = 'encrypt'


spin = window.setInterval(function(){
    seg = 360 / 26
    offsetAngle += seg 
    setAngle(offsetAngle, true, .5)  
    updateKey()
}, 500);

function updateKey(){
    key = (26 + Math.floor((offsetAngle + resAngle + .5 * seg) / seg)) % 26
    $('#key').val(key)
    textUpdate()
}

$('#key').on('input', function(){ 
    newAngle = $(this).val()
    setAngle(newAngle * seg, true, Math.abs((offsetAngle / seg) - newAngle) * .3)
    offsetAngle = newAngle * seg
    textUpdate()
})

$('#encrypt').on('input', function(){
    last = 'encrypt'
    textUpdate()
})

$('#decrypt').on('input', function(){
    last = 'decrypt'
    textUpdate()
})


function textUpdate(){
    if (last == 'encrypt')
        text = $('#encrypt').val()
    else
        text = $('#decrypt').val()

    text = text.toLowerCase()
    outText = []
    var regex = "[.,!?\\- /_\n]"
    text.split('').forEach(char => {
        newChar = String.fromCharCode((26 + char.charCodeAt(0) + (last == 'encrypt' ? key:-key) - 'a'.charCodeAt(0)) % 26 + 'a'.charCodeAt(0))

        outText.push(char.match(regex) != null ? char : newChar )
        
    });
    if (last == 'encrypt')
        $('#decrypt').val(outText.join(''))
    else
        $('#encrypt').val(outText.join(''))

}

function setAngle(angle, transition = false, length = 1){
    if (transition)
        $("#ringOut").css({transition: "transform " +length+ "s", transform:"rotate("+angle+"deg)", 'transition-timing-function': "linear"}); 
    else
        $("#ringOut").css({transition: 'none',transform:"rotate("+angle+"deg)"}); 
}

$("#ringOut").mousedown(function(){
    offsetAngle %= 360
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
        setAngle((offsetAngle + resAngle) % 360)
        updateKey()
    }                           
})

function end(){
    if(pointerDown){
        offsetAngle = (seg * Math.floor((offsetAngle + resAngle + .5 * seg)/seg))%360
        setAngle(offsetAngle, true) 
        pointerDown = false
        resAngle = 0
        updateKey()
    }
}

$("body").mouseup(function(){end()})
$("body").mouseleave(function(){end()})