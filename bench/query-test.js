/** @type {jsonOdm|exports} */
var jsonOdm = require('./dist/jsonOdm.js');

let testSource = {bigCollection:[]};
for(let i = 1; i < 500000; i++){
    testSource.bigCollection.push({id:i,name:'name'+i,profession:(['plumber','hairdresser','misha','sailor','student','teacher','fishers man','crab fisher','super programmer','unemployed','programmer','designer'])[(Math.random()*10*i)%11]});
}
jsonOdm.JsonOdm.addSource("test",testSource,true);
let bigCollection =  new jsonOdm.Collection("bigCollection");

module.exports = {
    name: 'Query benchmarks',
    maxTime: 2,
    tests: [
        {
            name: 'Simple Query all 500,000 Elements',
            fn: function() {
                bigCollection.$query().$branch("id").$gte(0).$all();
            }
        },
        {
            name: 'Complex Query all 500,000 Elements',
            fn: function() {
                let $q = bigCollection.$query();
                $q.$and(
                    $q.$branch("id").$gte(4000),
                    $q.$or(
                        $q.$branch('profession').$eq('plumber','hairdresser'),
                        $q.$branch('profession').$ne('sailor','student')
                    ),
                    $q.$branch("name").$ne('name49999')
                ).$all();
            }
        },
        {
            name: 'Simple text search within 500,000 Elements',
            fn : function(){
                let $q = bigCollection.$query();
                $q.$branch("profession").$text('"ish" mish fish -crab').$all();
            }
        }
    ]
};