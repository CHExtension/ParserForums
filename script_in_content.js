/**
 * При каждой перезагрузки
 */
document.addEventListener('click', () => {
    // let url = chrome.runtime.getURL('sound/note.mp3')
    // console.log(url)

    // let a = new Audio(url)
    // a.play()
})



// console.log('script_in_content.js');
window.onload = function(){

 console.log( typeof jQuery )

    

    // responsAjax ();



};

function responsAjax (){
    let pStart = new parseStart ();
    let option = {
        url : pStart._setting._site ,
    };
    console.log( option )
    // getContentBlock( option )
    console.log(pStart._setting._site);
    sound( 2 )
}


























