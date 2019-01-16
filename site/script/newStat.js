var statistics ={
    "democratArr": 0,
    "republicanArr": 0,
    "independentArr": 0,
    "numberOfD": 0,
    "numberOfR": 0,
    "numberOfI": 0,
    "totalMembers": 0,
    "DemocratAvgVotes": 0,
    "RepublicanAvgVotes": 0,
    "IndependentAvgVotes": 0,
    "totalVotePcts": 0,
    "totalVotePctsAvg": 0,
    "leastLoyal": [],
    "mostLoyal": [],
    "leastEngaged": 0,
    "mostEngaged": 0,  
}

var app = new Vue({
  el: '#app',
  data:{
    members: [],
    stats : statistics,
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

  app.members = json.results[0].members;
  makeList(app.members);
  app.stats.totalVotePcts = sumVotePct(app.members);
  
  populateStatistics()
  
  
}).catch(function(error) {
  alert('Json could not be fetched: ' + error.message);
});

});



function makeList(array){
  
  statistics.independentArr= array.filter(function(member){
    return member.party ==="I";
  });
  
  statistics.republicanArr = array.filter(function(member){
    return member.party === "R";
  });
  
  statistics.democratArr = array.filter(function(member){
    return member.party === "D";
  });
}

function populateStatistics(){
  // populates numberOfmembers in each party
  statistics.numberOfD = statistics.democratArr.length;
  statistics.numberOfR = statistics.republicanArr.length;
  statistics.numberOfI = statistics.independentArr.length;
  statistics.totalMembers = (statistics.democratArr.length + statistics.republicanArr.length + statistics.independentArr.length);
  
  //populates average votes for each party
  statistics.DemocratAvgVotes = (avgVotes(statistics.democratArr)).toFixed(2);
  statistics.RepublicanAvgVotes =  (avgVotes(statistics.republicanArr)).toFixed(2);
  statistics.IndependentAvgVotes =  (avgVotes(statistics.independentArr)).toFixed(2);
  statistics.totalVotePctsAvg = (statistics.totalVotePcts / statistics.totalMembers).toFixed(2); 
  
  var sortLoyal = app.members.sort(function(a,b){ 
  if(a.votes_with_party_pct == null)
    a.votes_with_party_pct = 0
    if(b.votes_with_party_pct == null)
    b.votes_with_party_pct = 0
  return a.votes_with_party_pct - b.votes_with_party_pct})

  statistics.leastLoyal =  sortLoyal.slice(0, (0.1 * sortLoyal.length));

  statistics.mostLoyal = sortLoyal.slice(0.9 * sortLoyal.length);

//Sort considering empty JSON data values.
var sortAttendance = app.members.sort(function(a,b){ 
  if(typeof(a.missed_votes_pct) == "undefined")
    a.missed_votes_pct = 0
    if(typeof(b.missed_votes_pct) == "undefined")
    b.missed_votes_pct = 0
  return a.missed_votes_pct - b.missed_votes_pct})

  //populates attendance statistics
  statistics.leastEngaged = sortAttendance.slice(0.9 * sortAttendance.length)
  statistics.mostEngaged = sortAttendance.slice(0, (0.1 * sortAttendance.length));
}

function avgVotes (array){
  var voteTotal = 0;
  var longitud = 1;
  if(array.length > 0)
    longitud = array.length;
  array.forEach(function(member){
    if(member.votes_with_party_pct != null)
      voteTotal += member.votes_with_party_pct;
  })
  return (voteTotal / longitud);
} 

function sumVotePct(array){
  var voteTotal = 0;
  array.forEach(function(member){
    if (member.votes_with_party_pct != null)
    voteTotal += member.votes_with_party_pct;
  })
  return voteTotal;
}
