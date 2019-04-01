var star = document.getElementsByClassName("fa-star");
var trash = document.getElementsByClassName("fa-trash");

var key = "c2e6744e136e40ada602e3af2107c358";
let results = document.querySelector('input')


document.querySelector("button").addEventListener("click", news);
function news(e) {
  let title = results.value;
  e.preventDefault();
  let url = "https://newsapi.org/v2/everything?q=" +title + "&apikey=" +key;
  console.log(url)
fetch(url)
    .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
    .then(response => {
      console.log(response)
      // let listItem = document.createElement("li");
      // document.querySelector("ul").appendChild(listItem);
      document.querySelectorAll('.message1')[0].textContent = response.articles[0].title + " " + response.articles[0].author + " " + response.articles[0].description + " " + response.articles[0].url ;
      document.querySelectorAll('.message2')[0].textContent = response.articles[1].title + " " + response.articles[0].author + " " + response.articles[0].description + " " + response.articles[0].url ;
      document.querySelectorAll('.message3')[0].textContent = response.articles[2].title + " " + response.articles[0].author + " " + response.articles[0].description + " " + response.articles[0].url ;
      document.querySelectorAll('.message4')[0].textContent = response.articles[3].title + " " + response.articles[0].author + " " + response.articles[0].description + " " + response.articles[0].url ;
      document.querySelectorAll('.message5')[0].textContent = response.articles[4].title + " " + response.articles[0].author + " " + response.articles[0].description + " " + response.articles[0].url ;
      // document.querySelector('response.articles[0].url').textContent = 
      // document.querySelector('.print').textContent = response.Actor
      // results.innerHTML = ; //<------ PUT JSON RESPONSE HERE
      //console.log(response)
      // console.log(response.articles[0].title)
    })
    .catch(err => {
      console.log(`error ${err}`);
    });

  };




Array.from(star).forEach(function(element) {
      element.addEventListener('click', function(){
        // const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[1].innerText
        const star = parseFloat(this.parentNode.parentNode.childNodes[4].innerText)
        console.log(msg)
        console.log(star)
        fetch('messages', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            // 'name': name,
            'msg': msg,
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        // const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.remove
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // 'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
