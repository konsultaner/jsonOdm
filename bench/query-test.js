/** @type {jsonOdm|exports} */
var jsonOdm = require('../bin/json.odm.min.js');

var testSource = {bigCollection:[]};
for(var i = 1; i < 500000; i++){
    testSource.bigCollection.push({id:i,name:'name'+i,profession:(['plumber','hairdresser','misha','sailor','student','teacher','fishers man','crab fisher','super programmer','unemployed','programmer','designer'])[(Math.random()*10*i)%11]});
}
jsonOdm.addSource("test",testSource,true);
var bigCollection =  new jsonOdm.Collection("bigCollection");

module.exports = {
    name: 'Query benchmarks',
    maxTime: 2,
    tests: [
        {
            name: 'Simple Query all 500,000 Elements',
            fn: function() {
                bigCollection.$query().$branch("id").$gte(0).$all();
                return;
            }
        },
        {
            name: 'Complex Query all 500,000 Elements',
            fn: function() {
                var $q = bigCollection.$query();
                $q.$and(
                    $q.$branch("id").$gte(4000),
                    $q.$or(
                        $q.$branch('profession').$eq('plumber','hairdresser'),
                        $q.$branch('profession').$ne('sailor','student')
                    ),
                    $q.$branch("name").$ne('name49999')
                ).$all();
                return;
            }
        },
        {
            name: 'Simple text search within 500,000 Elements',
            fn : function(){
                var $q = bigCollection.$query();
                $q.$branch("profession").$text('"ish" mish fish -crab').$all();
                return;
            }
        }
    ]
};