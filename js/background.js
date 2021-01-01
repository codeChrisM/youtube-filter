console.log("background running");

var background = {

    keywords: [],

    init: function(){
        //**Listen** for messages from Popup to Background
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
            if(request.fn in background){ 
                background[request.fn](request,sender,sendResponse)
            }
        })
    },

    setKeys: function(request, sender, sendResponse){
        this.keywords = request.keywords;
        console.log("Background: setKeys ", request.keywords);
        console.log(this.keywords);
    },

    getKeys:function(request, sender, sendResponse){
        sendResponse(this.keywords);
        console.log("Background: getKeys ", this.keywords);
        console.log(this.keywords);
    }
};

//initialize 
background.init();






