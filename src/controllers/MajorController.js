/**
 * Created by ENVY on 2017-03-19.
 */
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class MajorController {



    constructor() {
        this.counter = false;
    }

    httpGetAsync(theUrl, callback) { //theURL or a path to file
        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                let data = httpRequest.responseText;  //if you fetch a file you can JSON.parse(httpRequest.responseText)
                if (callback) {

                    callback(data);
                }
            }
        };

        httpRequest.open('GET', theUrl, true);
        httpRequest.send(null);
    }

    searchRecursively(node, name, list){
        let newRegex = new RegExp("^index.cfm\\?tree=[0-9]\\S*");
        let newRegex2 = new RegExp("[a-z]+(\\s|[a-z])*")
        if (typeof node.attrs !== "undefined") {
            for (let attribute of node.attrs) {

                if(attribute.name == "cellpadding" && attribute.value == 1){
                    this.counter = true;
                }
                if (attribute.name == name && newRegex.test(attribute.value) && newRegex2.test(node.childNodes[0].value)) {
                    let name = node.childNodes[0].value;
                    let link = "http://www.calendar.ubc.ca/vancouver/" + attribute.value;
                    let newobject = {};
                    newobject["name"] = name;
                    newobject["link"] = link;

                    if (this.counter)
                        list.push(newobject);
                }
            }
        }

        if (typeof node.childNodes !== "undefined") {
            let that = this;
            for(let child of node.childNodes) {
                this.searchRecursively(child, name, list);
            }
        }
    }
}

module.exports = MajorController;