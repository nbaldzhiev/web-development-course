document.addEventListener("DOMContentLoaded",
	function (event) {
		document.querySelector("button").addEventListener("click",
			function () {
				$ajaxUtils.sendGetRequest("/data/name.json", 
					function (res) {

						var message = res.firstName + " " + res.lastName;
						if (res.likesChineseFood) {
							message += " likes Chinese food";
						}
						else {
							message += " does not like Chinese food";
						}
						message += " and uses ";
						message += res.numberOfDisplays;
						message += " displays for coding.";

						document.querySelector("#content").innerHTML = 
							"<h2>" + message + "</h2>";
					}
				);
			}
		);
	}
)