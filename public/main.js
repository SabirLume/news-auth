var star = document.getElementsByClassName("fa-star");
var trash = document.getElementsByClassName("fa-trash");
var socket = io("http://localhost:8080");
var key = "c2e6744e136e40ada602e3af2107c358";
let results = document.querySelector('input')

socket.on("update news", function (results) {
  console.log(results)
  console.log("fire update messages")
  updateMessages(results.msg);
})
document.querySelector("button").addEventListener("click", news);
function news(e) {
  let title = results.value;
  e.preventDefault();
  let url = "https://newsapi.org/v2/everything?q=" + title + "&apikey=" + key;
  console.log(url)
  fetch(url)
    .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
    .then(response => {
      console.log(response)
      // let listItem = document.createElement("li");
      // document.querySelector("ul").appendChild(listItem);
      document.querySelectorAll('.message1')[0].textContent = response.articles[0].title + " " + response.articles[0].author + " " + response.articles[0].description + " ";
      document.querySelectorAll('.message2')[0].textContent = response.articles[1].title + " " + response.articles[1].author + " " + response.articles[1].description + " ";
      document.querySelectorAll('.message3')[0].textContent = response.articles[2].title + " " + response.articles[2].author + " " + response.articles[2].description + " ";
      document.querySelectorAll('.message4')[0].textContent = response.articles[3].title + " " + response.articles[3].author + " " + response.articles[3].description + " ";
      document.querySelectorAll('.message5')[0].textContent = response.articles[4].title + " " + response.articles[4].author + " " + response.articles[4].description + " ";

      // created a ANCHOR tag using creatElement
      const link = document.createElement("a");
      //selecting the span for the whole text within the HTML
      const span = document.querySelector('.message5');
      // dot notation allow to target/access the property of the object
      link.innerText = "Click here to read more"
      // link.href = response.articles[4].url
      link.setAttribute('href', response.articles[4].url);
      //putting link on page
      span.appendChild(link);

      //creating a clickable link
      const link4 = document.createElement("a");
      const span4 = document.querySelector('.message4');
      link4.innerText = response.articles[3].url
      link4.setAttribute('href', response.articles[3].url);
      //putting link on page
      span4.appendChild(link4);

      //creating a clickable link
      const link3 = document.createElement("a");
      const span3 = document.querySelector('.message3');
      link3.innerText = response.articles[2].url
      link3.setAttribute('href', response.articles[2].url);
      //putting link on page
      span3.appendChild(link3);

      //creating a clickable link
      const link2 = document.createElement("a");
      const span2 = document.querySelector('.message2');
      link2.innerText = response.articles[1].url
      link2.setAttribute('href', response.articles[1].url);
      //putting link on page
      span2.appendChild(link2);

      //creating a clickable link
      const link1 = document.createElement("a");
      const span1 = document.querySelector('.message1');
      link1.innerText = response.articles[0].url
      link1.setAttribute('href', response.articles[0].url);
      //putting link on page
      span1.appendChild(link1);
    })
    .catch(err => {
      console.log(`error ${err}`);
    });

};




Array.from(star).forEach(function (element) {
  element.addEventListener('click', function () {
    // const name = this.parentNode.parentNode.childNodes[1].innerText
    console.log("beginning star handler")
    const msg = this.parentNode.parentNode.childNodes[1].innerText
    const star = parseFloat(this.parentNode.parentNode.childNodes[4].innerText)
    console.log(msg)
    console.log(star)
    fetch('messages', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        // 'name': name,
        'msg': msg,
      })
    })
      .then(response => {

        if (!response.ok) return console.log("error")
        // the event is "save news" the eventlistner is in routes.js
        //emit is creating the event
        socket.emit("save news", "stared news article")
        console.log(response);
        return response.json()

      })
      .then(data => {
        console.log("this should have THE ID", data)
        //we are setting the
        element.setAttribute("data-messageid", data._id)
      })
  });
});

function updateMessages(message) {
  console.log(message);
  var messages = document.getElementById('savedMessages');

  var li = document.createElement("LI");
  li.className = "message1";
  var spanMessage = document.createElement("SPAN");
  spanMessage.innerHTML = message;
  var spanTrash = document.createElement("SPAN");
  //creating new trash can
  var iFaTrash = document.createElement("i");
  iFaTrash.className = "fa fa-trash";
  //add evenet listener to the NEW trash button before the page is reloaded
  iFaTrash.addEventListener('click', trashHandler)
  iFaTrash.setAttribute("aria-hidden", true);
  spanTrash.appendChild(iFaTrash);
  li.appendChild(spanMessage);
  li.appendChild(spanTrash);

  messages.appendChild(li);

}
function trashHandler() {
  // const name = this.parentNode.parentNode.childNodes[1].innerText
  const msg = this.parentNode.parentNode.childNodes[1].innerText;
  const messageid = this.parentNode.parentNode.dataset.messageid;
  fetch('messages', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'

    },
    body: JSON.stringify({
      // 'name': name,
      'msg': msg,
      'messageid': messageid
    })
  }).then(function (response) {
    window.location.reload(true)
  })
  //clicking on star dynamically creates a li through main.js but it is missing the message id -- was until we added a message id in the star handler
};
//for each trash can add eventhandler & will run function  ^^^^ above
Array.from(trash).forEach(function (element) {
  element.addEventListener('click', trashHandler);
});
