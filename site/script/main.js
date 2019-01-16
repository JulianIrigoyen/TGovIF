var app = new Vue({
  el: '#app',
  data:{
    members: [],
    filteredMembers:[],
    states: []
  }
   
  })

//Discriminate AJAX Requests 
  $(function() { 
    var chamber;
      if(document.getElementById('senate')){
        chamber = 'senate'
      }
      else {chamber = 'house'}
      
    fetch('https://api.propublica.org/congress/v1/115/'+chamber+'/members.json', {
  headers: new Headers({
    "X-API-Key": 'SK5QEG7MIQQ6fPQVBcQ2x8UANNC9iAtOet9h7MvR'
  })
}).then(function (response) {
  return response.json()

}).then(function(json){
  console.log(json);
  
  //Link Vue App to relevant JSON Data
  app.members = json.results[0].members;

  //Generate State Dropdown
  app.states = populateStateSelect();

  //Create Array with Filtered Members
  app.filteredMembers = filterMembers(app.members)

  //Update filtered array on event.
  Array.from(document.querySelectorAll('input[name = party]')).forEach(function (input) {
  input.onclick = function () {
    app.filteredMembers = filterMembers(app.members)
  }
  document.getElementById('stateDropdown').onchange = function (){
    app.filteredMembers = filterMembers(app.members)
  }
})
}).catch(function(error) {
  alert('Json Failed: ' + error.message);
});

function populateStateSelect() {
  var estados = [];
  app.members.forEach(function (member) {
    if (estados.indexOf(member.state) == -1) {
      estados.push(member.state)
    }
  })
  return estados.sort();
}
  //Filter Members by Party
function filterMembers(members) {
  var valorDelDropdown = document.getElementById('stateDropdown').value;
  var filteredMembers = [];
  var checkedBoxes = Array.from(document.querySelectorAll('input[name=party]:checked')).map(i => i.value);

  filteredMembers = members.filter(function (member) {
    return checkedBoxes.indexOf(member.party) != -1 && (member.state === valorDelDropdown || valorDelDropdown === "All");
  });
  return filteredMembers;
}
  });

  

