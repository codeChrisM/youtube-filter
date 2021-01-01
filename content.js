let itemList;
var timerId;

let searchWords;

function debounceFunction(func, delay) {
    // Cancels the setTimeout method execution
    clearTimeout(timerId)

    // Executes the func after delay time.
    timerId  =  setTimeout(func, delay)
}

function hideVideos(){
    var timerStart = performance.now()//speedCheck


    /** WHAT ELEMENTS ARE VIDEOS? **/
    if(window.location.href.indexOf("/watch?") > -1){ //watch page
        itemList = document.querySelectorAll("ytd-compact-video-renderer");
    }
    else if(window.location.href.indexOf("/feed") > -1){ //"trending  /feed/trending,"
        itemList = document.querySelectorAll("ytd-video-renderer");
    }
    else if(document.querySelectorAll("ytd-rich-item-renderer").length){ // "HOME Page"
        itemList = document.querySelectorAll("ytd-rich-item-renderer");
    }
        
    
        for(let i=0; itemList.length > i; i++){
            if(searchWords === undefined){ break;} //escape loop
            let title = itemList[i].querySelector("h3");
            if(title != null){
                title = title.innerText;

            //1. create an array out of the words in the title that are all lower case
                let titleArray = title.split(" ").join().toLowerCase().split(",");

                //2. search for any of the filtered words in this title
                const matchesFound = titleArray.filter(element => searchWords.includes(element));

                //3. show or don't
                if(matchesFound.length > 0 ){
                    console.log(title);
                    itemList[i].style.display = "none";
                }else{
                    itemList[i].style.display = "block";
                }
            }
        }
    


    var timerEnd = performance.now()//speedCheck
    console.log("Call time: " + (timerEnd - timerStart) + " milliseconds.")//speedCheck
};  


window.addEventListener('scroll', function(){
    
        debounceFunction(hideVideos, 200);
    
});

//**LISTEN** Popup to Content
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    searchWords = request.keywords;
    console.log("Content: Listener searchWords:", searchWords)    
        hideVideos();    
});









