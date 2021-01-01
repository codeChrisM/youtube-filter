let console = chrome.extension.getBackgroundPage().console; //allows BG console to get popup scripts console logs.

var app = {
	init:function(){
		let AddKeyButton = document.querySelector('#AddKeyButton');
		let keywordInput = document.querySelector('#keywordInput');	
		let ul_List = document.querySelector('.keyword-list');	
		let keywordArray = [];

		//**GET** Keys from background
		chrome.runtime.sendMessage({fn: 'getKeys'}, function(response){
			keywordArray = response;
			buildFilterList(keywordArray);
		});


		//**ADD** to filter
		AddKeyButton.addEventListener('click', function () {		
			keywordArray.push(keywordInput.value);
			keywordInput.value = '';

			buildFilterList(keywordArray);

			//**SET**  this to background
			chrome.runtime.sendMessage({fn: 'setKeys',  keywords: keywordArray});
		});
		//**ADD** to filter
		keywordInput.addEventListener("keydown", function (event) {
			if (event.keyCode === 13) {	// "13" is  "Enter" on keyboard
				event.preventDefault();
				AddKeyButton.click();
			}		
		});


		//**PASS** message from popup to content
		function sendMessageToContent(message){
			setTimeout(() => {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, message);
				});
			},100);
		}

		function buildFilterList(targetArray) {
			//1. remove clear out Ul
			while ( ul_List.firstChild ) {
				ul_List.removeChild( ul_List.firstChild );
			}
			
			//2. ill ul with li's from keywords
			for (let j = 0; j < targetArray.length; ++j) {				
				let li = document.createElement('li');
				li.innerHTML = "<li class='keyword-list__item'>" + targetArray[j]+ "<a class='close-item' href=''></a></li>";			
				ul_List.appendChild(li);

				//3. add click event to "close button"
				let current_li_close= ul_List.lastChild.querySelector('.close-item');
				current_li_close.addEventListener('click', function(e){
					e.preventDefault;
					this.parentElement.remove();

					var array = keywordArray;
					var newarr = array.filter(function(a){return a !== targetArray[j] });
					keywordArray = newarr;

					chrome.runtime.sendMessage({fn: 'setKeys',  keywords: keywordArray});

					buildFilterList(keywordArray);
				});				
			}	
			
			//4. Send Keywords to Content.JS
			sendMessageToContent({keywords: keywordArray});
		}
	}
}


document.addEventListener("DOMContentLoaded", function(){
	app.init();
});


