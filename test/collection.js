describe("Collection", function () {

    var testSource = {
        "testCollection":[
            {id:1,name:"Mustermann",firstName:"Tom",married:true},
            {id:2,name:"Musterfrau",firstName:null,married:false}
        ],
        "parentCollection":[
            {
                onOfALotId:300,
                keys:[1,2,3,4],
                childCollection:[
                    {id:1},{id:2},{id:3}
                ]
            }
        ],
        "foreignCollection":[
            {id:1,foreignName:"Mustermann"},
            {id:2,foreignName:"Musterfrau"}
        ],
        "goldenRuleCollection":[
            {id:1,lang:'en',cite:"One should treat others as one would like others to treat oneself."},
            {id:2,lang:'da',cite:"Du skal elske din næste som dig selv!"},
            {id:3,lang:'eo',cite:"Kiel vi volas, ke la homoj faru al vi, faru ankaŭ al ili tiel same."},
            {id:4,lang:'de',cite:"Behandle andere so, wie du von ihnen behandelt werden willst."},
            {id:5,lang:'pl',cite:"Rób innym to, co byś chciał, żeby tobie robili."},
            {id:6,lang:'en',cite:"One should not treat others in ways that one would not like to be treated."}
        ],
        // generated with http://www.generatedata.com/
        "employees":[
            {
                "name": "Alec Velez",
                "salaryGroupId": 4,
                "holidayDaysTaken": 13,
                "daysOff": 9,
                "extraHoursWorked": 17
            },
            {
                "name": "Evan Leach",
                "salaryGroupId": 2,
                "holidayDaysTaken": 6,
                "daysOff": 6,
                "extraHoursWorked": 78
            },
            {
                "name": "Amela Sanchez",
                "salaryGroupId": 2,
                "holidayDaysTaken": 0,
                "daysOff": 2,
                "extraHoursWorked": 77
            },
            {
                "name": "Jin Hoover",
                "salaryGroupId": 3,
                "holidayDaysTaken": 23,
                "daysOff": 3,
                "extraHoursWorked": 16
            },
            {
                "name": "Palmer Velasquez",
                "salaryGroupId": 1,
                "holidayDaysTaken": 23,
                "daysOff": 10,
                "extraHoursWorked": 6
            },
            {
                "name": "Tanya Grant",
                "salaryGroupId": 2,
                "holidayDaysTaken": 14,
                "daysOff": 10,
                "extraHoursWorked": 62
            },
            {
                "name": "Reuben Carrillo",
                "salaryGroupId": 4,
                "holidayDaysTaken": 4,
                "daysOff": 8,
                "extraHoursWorked": 44
            },
            {
                "name": "Cleo Peterson",
                "salaryGroupId": 1,
                "holidayDaysTaken": 17,
                "daysOff": 5,
                "extraHoursWorked": 30
            },
            {
                "name": "Michael Blanchard",
                "salaryGroupId": 5,
                "holidayDaysTaken": 5,
                "daysOff": 3,
                "extraHoursWorked": 20
            },
            {
                "name": "Martena Conley",
                "salaryGroupId": 1,
                "holidayDaysTaken": 20,
                "daysOff": 6,
                "extraHoursWorked": 0
            },
            {
                "name": "Quentin Alston",
                "salaryGroupId": 2,
                "holidayDaysTaken": 23,
                "daysOff": 2,
                "extraHoursWorked": 78
            },
            {
                "name": "Quinlan Livingston",
                "salaryGroupId": 3,
                "holidayDaysTaken": 19,
                "daysOff": 8,
                "extraHoursWorked": 27
            },
            {
                "name": "Ayanna Norris",
                "salaryGroupId": 1,
                "holidayDaysTaken": 9,
                "daysOff": 9,
                "extraHoursWorked": 67
            },
            {
                "name": "Amela Wolfe",
                "salaryGroupId": 1,
                "holidayDaysTaken": 4,
                "daysOff": 1,
                "extraHoursWorked": 68
            },
            {
                "name": "Cherokee Beach",
                "salaryGroupId": 2,
                "holidayDaysTaken": 0,
                "daysOff": 9,
                "extraHoursWorked": 18
            },
            {
                "name": "Clayton Wiley",
                "salaryGroupId": 3,
                "holidayDaysTaken": 3,
                "daysOff": 10,
                "extraHoursWorked": 57
            },
            {
                "name": "Anika Gonzales",
                "salaryGroupId": 3,
                "holidayDaysTaken": 3,
                "daysOff": 10,
                "extraHoursWorked": 63
            },
            {
                "name": "Irma Goodwin",
                "salaryGroupId": 4,
                "holidayDaysTaken": 23,
                "daysOff": 3,
                "extraHoursWorked": 4
            },
            {
                "name": "Jin Eaton",
                "salaryGroupId": 2,
                "holidayDaysTaken": 15,
                "daysOff": 4,
                "extraHoursWorked": 36
            },
            {
                "name": "Ursa Mcgowan",
                "salaryGroupId": 4,
                "holidayDaysTaken": 11,
                "daysOff": 8,
                "extraHoursWorked": 43
            },
            {
                "name": "Sacha Hernandez",
                "salaryGroupId": 5,
                "holidayDaysTaken": 15,
                "daysOff": 10,
                "extraHoursWorked": 24
            },
            {
                "name": "Emerson Roberson",
                "salaryGroupId": 3,
                "holidayDaysTaken": 2,
                "daysOff": 3,
                "extraHoursWorked": 60
            },
            {
                "name": "Giselle Scott",
                "salaryGroupId": 4,
                "holidayDaysTaken": 24,
                "daysOff": 6,
                "extraHoursWorked": 73
            },
            {
                "name": "Rina Gallagher",
                "salaryGroupId": 2,
                "holidayDaysTaken": 8,
                "daysOff": 7,
                "extraHoursWorked": 45
            },
            {
                "name": "Mason Peters",
                "salaryGroupId": 3,
                "holidayDaysTaken": 1,
                "daysOff": 5,
                "extraHoursWorked": 53
            },
            {
                "name": "Haviva Smith",
                "salaryGroupId": 1,
                "holidayDaysTaken": 0,
                "daysOff": 7,
                "extraHoursWorked": 13
            },
            {
                "name": "Lois Lyons",
                "salaryGroupId": 4,
                "holidayDaysTaken": 11,
                "daysOff": 9,
                "extraHoursWorked": 61
            },
            {
                "name": "Latifah Powell",
                "salaryGroupId": 5,
                "holidayDaysTaken": 10,
                "daysOff": 4,
                "extraHoursWorked": 52
            },
            {
                "name": "Gloria Gilmore",
                "salaryGroupId": 4,
                "holidayDaysTaken": 3,
                "daysOff": 6,
                "extraHoursWorked": 34
            },
            {
                "name": "Rajah Gross",
                "salaryGroupId": 2,
                "holidayDaysTaken": 22,
                "daysOff": 5,
                "extraHoursWorked": 23
            },
            {
                "name": "Sybill Brooks",
                "salaryGroupId": 5,
                "holidayDaysTaken": 21,
                "daysOff": 4,
                "extraHoursWorked": 78
            },
            {
                "name": "Stephanie Sandoval",
                "salaryGroupId": 3,
                "holidayDaysTaken": 1,
                "daysOff": 6,
                "extraHoursWorked": 30
            },
            {
                "name": "Maris Juarez",
                "salaryGroupId": 5,
                "holidayDaysTaken": 5,
                "daysOff": 1,
                "extraHoursWorked": 2
            },
            {
                "name": "Demetrius Acosta",
                "salaryGroupId": 2,
                "holidayDaysTaken": 11,
                "daysOff": 3,
                "extraHoursWorked": 44
            },
            {
                "name": "Chadwick Heath",
                "salaryGroupId": 1,
                "holidayDaysTaken": 6,
                "daysOff": 7,
                "extraHoursWorked": 25
            },
            {
                "name": "Moana Murphy",
                "salaryGroupId": 4,
                "holidayDaysTaken": 0,
                "daysOff": 5,
                "extraHoursWorked": 68
            },
            {
                "name": "Britanni Campos",
                "salaryGroupId": 1,
                "holidayDaysTaken": 0,
                "daysOff": 9,
                "extraHoursWorked": 43
            },
            {
                "name": "Mari Watkins",
                "salaryGroupId": 2,
                "holidayDaysTaken": 10,
                "daysOff": 8,
                "extraHoursWorked": 43
            },
            {
                "name": "Mikayla Goff",
                "salaryGroupId": 1,
                "holidayDaysTaken": 6,
                "daysOff": 8,
                "extraHoursWorked": 2
            },
            {
                "name": "Samantha Duke",
                "salaryGroupId": 3,
                "holidayDaysTaken": 15,
                "daysOff": 7,
                "extraHoursWorked": 56
            },
            {
                "name": "Zeph Baird",
                "salaryGroupId": 5,
                "holidayDaysTaken": 0,
                "daysOff": 2,
                "extraHoursWorked": 57
            },
            {
                "name": "Kyra Hale",
                "salaryGroupId": 5,
                "holidayDaysTaken": 2,
                "daysOff": 2,
                "extraHoursWorked": 26
            },
            {
                "name": "Kelsie Montoya",
                "salaryGroupId": 3,
                "holidayDaysTaken": 17,
                "daysOff": 0,
                "extraHoursWorked": 71
            },
            {
                "name": "Rooney Buck",
                "salaryGroupId": 1,
                "holidayDaysTaken": 0,
                "daysOff": 1,
                "extraHoursWorked": 49
            },
            {
                "name": "Chaney Bernard",
                "salaryGroupId": 1,
                "holidayDaysTaken": 22,
                "daysOff": 7,
                "extraHoursWorked": 5
            },
            {
                "name": "Samantha White",
                "salaryGroupId": 1,
                "holidayDaysTaken": 23,
                "daysOff": 6,
                "extraHoursWorked": 49
            },
            {
                "name": "Talon Downs",
                "salaryGroupId": 4,
                "holidayDaysTaken": 24,
                "daysOff": 4,
                "extraHoursWorked": 54
            },
            {
                "name": "Kimberley Trujillo",
                "salaryGroupId": 4,
                "holidayDaysTaken": 19,
                "daysOff": 5,
                "extraHoursWorked": 11
            },
            {
                "name": "Ross Hyde",
                "salaryGroupId": 5,
                "holidayDaysTaken": 0,
                "daysOff": 4,
                "extraHoursWorked": 46
            },
            {
                "name": "Indigo Shelton",
                "salaryGroupId": 1,
                "holidayDaysTaken": 19,
                "daysOff": 10,
                "extraHoursWorked": 25
            },
            {
                "name": "Alisa Sears",
                "salaryGroupId": 5,
                "holidayDaysTaken": 8,
                "daysOff": 3,
                "extraHoursWorked": 79
            },
            {
                "name": "Leigh Koch",
                "salaryGroupId": 2,
                "holidayDaysTaken": 5,
                "daysOff": 5,
                "extraHoursWorked": 24
            },
            {
                "name": "Stone Mathis",
                "salaryGroupId": 5,
                "holidayDaysTaken": 21,
                "daysOff": 9,
                "extraHoursWorked": 15
            },
            {
                "name": "Jemima English",
                "salaryGroupId": 3,
                "holidayDaysTaken": 1,
                "daysOff": 2,
                "extraHoursWorked": 59
            },
            {
                "name": "Aline Cochran",
                "salaryGroupId": 1,
                "holidayDaysTaken": 10,
                "daysOff": 6,
                "extraHoursWorked": 16
            },
            {
                "name": "Stella Boone",
                "salaryGroupId": 2,
                "holidayDaysTaken": 19,
                "daysOff": 4,
                "extraHoursWorked": 5
            },
            {
                "name": "Tamara House",
                "salaryGroupId": 1,
                "holidayDaysTaken": 22,
                "daysOff": 6,
                "extraHoursWorked": 59
            },
            {
                "name": "Blaine Foreman",
                "salaryGroupId": 2,
                "holidayDaysTaken": 23,
                "daysOff": 5,
                "extraHoursWorked": 63
            },
            {
                "name": "Michael Travis",
                "salaryGroupId": 2,
                "holidayDaysTaken": 11,
                "daysOff": 6,
                "extraHoursWorked": 17
            },
            {
                "name": "Travis Morrow",
                "salaryGroupId": 3,
                "holidayDaysTaken": 24,
                "daysOff": 9,
                "extraHoursWorked": 44
            },
            {
                "name": "Angelica Fulton",
                "salaryGroupId": 2,
                "holidayDaysTaken": 7,
                "daysOff": 2,
                "extraHoursWorked": 44
            },
            {
                "name": "Libby Clements",
                "salaryGroupId": 1,
                "holidayDaysTaken": 8,
                "daysOff": 9,
                "extraHoursWorked": 30
            },
            {
                "name": "Nerea Dean",
                "salaryGroupId": 5,
                "holidayDaysTaken": 12,
                "daysOff": 1,
                "extraHoursWorked": 67
            },
            {
                "name": "Alexa Eaton",
                "salaryGroupId": 5,
                "holidayDaysTaken": 10,
                "daysOff": 6,
                "extraHoursWorked": 35
            },
            {
                "name": "Edward Vincent",
                "salaryGroupId": 2,
                "holidayDaysTaken": 6,
                "daysOff": 3,
                "extraHoursWorked": 29
            },
            {
                "name": "Noel Santana",
                "salaryGroupId": 1,
                "holidayDaysTaken": 8,
                "daysOff": 5,
                "extraHoursWorked": 73
            },
            {
                "name": "Shelby Stanton",
                "salaryGroupId": 1,
                "holidayDaysTaken": 13,
                "daysOff": 3,
                "extraHoursWorked": 31
            },
            {
                "name": "Reuben Dillon",
                "salaryGroupId": 3,
                "holidayDaysTaken": 14,
                "daysOff": 6,
                "extraHoursWorked": 20
            },
            {
                "name": "Quyn Alford",
                "salaryGroupId": 4,
                "holidayDaysTaken": 5,
                "daysOff": 10,
                "extraHoursWorked": 65
            },
            {
                "name": "Aaron Matthews",
                "salaryGroupId": 3,
                "holidayDaysTaken": 6,
                "daysOff": 10,
                "extraHoursWorked": 79
            },
            {
                "name": "Inga Austin",
                "salaryGroupId": 2,
                "holidayDaysTaken": 10,
                "daysOff": 0,
                "extraHoursWorked": 49
            },
            {
                "name": "Lydia Madden",
                "salaryGroupId": 4,
                "holidayDaysTaken": 12,
                "daysOff": 2,
                "extraHoursWorked": 7
            },
            {
                "name": "Herrod Riddle",
                "salaryGroupId": 2,
                "holidayDaysTaken": 9,
                "daysOff": 10,
                "extraHoursWorked": 64
            },
            {
                "name": "Odysseus Petty",
                "salaryGroupId": 1,
                "holidayDaysTaken": 24,
                "daysOff": 5,
                "extraHoursWorked": 39
            },
            {
                "name": "Fitzgerald Lee",
                "salaryGroupId": 3,
                "holidayDaysTaken": 22,
                "daysOff": 5,
                "extraHoursWorked": 38
            },
            {
                "name": "Barbara Tucker",
                "salaryGroupId": 2,
                "holidayDaysTaken": 22,
                "daysOff": 5,
                "extraHoursWorked": 59
            },
            {
                "name": "Rhoda Jensen",
                "salaryGroupId": 4,
                "holidayDaysTaken": 2,
                "daysOff": 5,
                "extraHoursWorked": 44
            },
            {
                "name": "Jackson Chase",
                "salaryGroupId": 4,
                "holidayDaysTaken": 12,
                "daysOff": 5,
                "extraHoursWorked": 42
            },
            {
                "name": "Roth Jackson",
                "salaryGroupId": 4,
                "holidayDaysTaken": 16,
                "daysOff": 1,
                "extraHoursWorked": 27
            },
            {
                "name": "Reuben Macdonald",
                "salaryGroupId": 3,
                "holidayDaysTaken": 14,
                "daysOff": 2,
                "extraHoursWorked": 52
            },
            {
                "name": "Knox Shaw",
                "salaryGroupId": 4,
                "holidayDaysTaken": 3,
                "daysOff": 3,
                "extraHoursWorked": 53
            },
            {
                "name": "Silas Mcdowell",
                "salaryGroupId": 1,
                "holidayDaysTaken": 7,
                "daysOff": 1,
                "extraHoursWorked": 71
            },
            {
                "name": "Eve Durham",
                "salaryGroupId": 5,
                "holidayDaysTaken": 21,
                "daysOff": 0,
                "extraHoursWorked": 8
            },
            {
                "name": "May Peck",
                "salaryGroupId": 5,
                "holidayDaysTaken": 1,
                "daysOff": 0,
                "extraHoursWorked": 42
            },
            {
                "name": "Brent Gay",
                "salaryGroupId": 1,
                "holidayDaysTaken": 10,
                "daysOff": 7,
                "extraHoursWorked": 77
            },
            {
                "name": "Naida Burris",
                "salaryGroupId": 2,
                "holidayDaysTaken": 12,
                "daysOff": 0,
                "extraHoursWorked": 61
            },
            {
                "name": "Paloma Langley",
                "salaryGroupId": 2,
                "holidayDaysTaken": 9,
                "daysOff": 1,
                "extraHoursWorked": 44
            },
            {
                "name": "Lewis Vega",
                "salaryGroupId": 5,
                "holidayDaysTaken": 21,
                "daysOff": 3,
                "extraHoursWorked": 65
            },
            {
                "name": "Macaulay Stout",
                "salaryGroupId": 2,
                "holidayDaysTaken": 14,
                "daysOff": 7,
                "extraHoursWorked": 63
            },
            {
                "name": "Yvette Cruz",
                "salaryGroupId": 4,
                "holidayDaysTaken": 11,
                "daysOff": 3,
                "extraHoursWorked": 36
            },
            {
                "name": "Shelley Best",
                "salaryGroupId": 2,
                "holidayDaysTaken": 4,
                "daysOff": 6,
                "extraHoursWorked": 24
            },
            {
                "name": "Louis Pennington",
                "salaryGroupId": 4,
                "holidayDaysTaken": 8,
                "daysOff": 6,
                "extraHoursWorked": 47
            },
            {
                "name": "Kibo Chen",
                "salaryGroupId": 5,
                "holidayDaysTaken": 13,
                "daysOff": 4,
                "extraHoursWorked": 60
            },
            {
                "name": "Stacey Burnett",
                "salaryGroupId": 5,
                "holidayDaysTaken": 21,
                "daysOff": 4,
                "extraHoursWorked": 71
            },
            {
                "name": "Virginia Kidd",
                "salaryGroupId": 4,
                "holidayDaysTaken": 13,
                "daysOff": 1,
                "extraHoursWorked": 9
            },
            {
                "name": "Gisela Moore",
                "salaryGroupId": 4,
                "holidayDaysTaken": 24,
                "daysOff": 1,
                "extraHoursWorked": 16
            },
            {
                "name": "Serina Reyes",
                "salaryGroupId": 1,
                "holidayDaysTaken": 3,
                "daysOff": 7,
                "extraHoursWorked": 20
            },
            {
                "name": "Brody Keller",
                "salaryGroupId": 1,
                "holidayDaysTaken": 1,
                "daysOff": 0,
                "extraHoursWorked": 80
            },
            {
                "name": "Ralph Mcdonald",
                "salaryGroupId": 3,
                "holidayDaysTaken": 20,
                "daysOff": 2,
                "extraHoursWorked": 0
            },
            {
                "name": "Sharon Hayden",
                "salaryGroupId": 4,
                "holidayDaysTaken": 24,
                "daysOff": 1,
                "extraHoursWorked": 21
            }
        ],
        "salaryGroup":[
            {id:1,name:"Trainee",salary:"1400€"},
            {id:2,name:"Junior",salary:"2100€"},
            {id:3,name:"General",salary:"2600€"},
            {id:4,name:"Senior",salary:"3200€"},
            {id:5,name:"Master",salary:"4800€"}
        ],
        "arithmeticCollection":[
            {id:1,cars:12,trucks:23,bikes:8},
            {id:2,cars:3,trucks:18,bikes:18},
            {id:3,cars:23,trucks:22,bikes:23},
            {id:4,cars:1,trucks:12,bikes:82}
        ],
        "aLot":[],
        "geo":[
            // google example https://storage.googleapis.com/maps-devrel/google.json
            {
                "type": "Feature",
                "properties": {
                    "letter": "G",
                    "color": "blue",
                    "rank": "7",
                    "ascii": "71"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [123.61, -22.14], [122.38, -21.73], [121.06, -21.69], [119.66, -22.22], [119.00, -23.40],
                            [118.65, -24.76], [118.43, -26.07], [118.78, -27.56], [119.22, -28.57], [120.23, -29.49],
                            [121.77, -29.87], [123.57, -29.64], [124.45, -29.03], [124.71, -27.95], [124.80, -26.70],
                            [124.80, -25.60], [123.61, -25.64], [122.56, -25.64], [121.72, -25.72], [121.81, -26.62],
                            [121.86, -26.98], [122.60, -26.90], [123.57, -27.05], [123.57, -27.68], [123.35, -28.18],
                            [122.51, -28.38], [121.77, -28.26], [121.02, -27.91], [120.49, -27.21], [120.14, -26.50],
                            [120.10, -25.64], [120.27, -24.52], [120.67, -23.68], [121.72, -23.32], [122.43, -23.48],
                            [123.04, -24.04], [124.54, -24.28], [124.58, -23.20], [123.61, -22.14]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "o",
                    "color": "red",
                    "rank": "15",
                    "ascii": "111"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [128.84, -25.76], [128.18, -25.60], [127.96, -25.52], [127.88, -25.52], [127.70, -25.60],
                            [127.26, -25.79], [126.60, -26.11], [126.16, -26.78], [126.12, -27.68], [126.21, -28.42],
                            [126.69, -29.49], [127.74, -29.80], [128.80, -29.72], [129.41, -29.03], [129.72, -27.95],
                            [129.68, -27.21], [129.33, -26.23], [128.84, -25.76]
                        ],
                        [
                            [128.45, -27.44], [128.32, -26.94], [127.70, -26.82], [127.35, -27.05], [127.17, -27.80],
                            [127.57, -28.22], [128.10, -28.42], [128.49, -27.80], [128.45, -27.44]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "o",
                    "color": "yellow",
                    "rank": "15",
                    "ascii": "111"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [131.87, -25.76], [131.35, -26.07], [130.95, -26.78], [130.82, -27.64], [130.86, -28.53],
                            [131.26, -29.22], [131.92, -29.76], [132.45, -29.87], [133.06, -29.76], [133.72, -29.34],
                            [134.07, -28.80], [134.20, -27.91], [134.07, -27.21], [133.81, -26.31], [133.37, -25.83],
                            [132.71, -25.64], [131.87, -25.76]
                        ],
                        [
                            [133.15, -27.17], [132.71, -26.86], [132.09, -26.90], [131.74, -27.56], [131.79, -28.26],
                            [132.36, -28.45], [132.93, -28.34], [133.15, -27.76], [133.15, -27.17]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "g",
                    "color": "blue",
                    "rank": "7",
                    "ascii": "103"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [138.12, -25.04], [136.84, -25.16], [135.96, -25.36], [135.26, -25.99], [135, -26.90],
                            [135.04, -27.91], [135.26, -28.88], [136.05, -29.45], [137.02, -29.49], [137.81, -29.49],
                            [137.94, -29.99], [137.90, -31.20], [137.85, -32.24], [136.88, -32.69], [136.45, -32.36],
                            [136.27, -31.80], [134.95, -31.84], [135.17, -32.99], [135.52, -33.43], [136.14, -33.76],
                            [137.06, -33.83], [138.12, -33.65], [138.86, -33.21], [139.30, -32.28], [139.30, -31.24],
                            [139.30, -30.14], [139.21, -28.96], [139.17, -28.22], [139.08, -27.41], [139.08, -26.47],
                            [138.99, -25.40], [138.73, -25.00 ], [138.12, -25.04]
                        ],
                        [
                            [137.50, -26.54], [136.97, -26.47], [136.49, -26.58], [136.31, -27.13], [136.31, -27.72],
                            [136.58, -27.99], [137.50, -28.03], [137.68, -27.68], [137.59, -26.78], [137.50, -26.54]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "l",
                    "color": "green",
                    "rank": "12",
                    "ascii": "108"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [140.14,-21.04], [140.31,-29.42], [141.67,-29.49], [141.59,-20.92], [140.14,-21.04]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "e",
                    "color": "red",
                    "rank": "5",
                    "ascii": "101"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [144.14, -27.41], [145.67, -27.52], [146.86, -27.09], [146.82, -25.64], [146.25, -25.04],
                            [145.45, -24.68], [144.66, -24.60], [144.09, -24.76], [143.43, -25.08], [142.99, -25.40],
                            [142.64, -26.03], [142.64, -27.05], [142.64, -28.26], [143.30, -29.11], [144.18, -29.57],
                            [145.41, -29.64], [146.46, -29.19], [146.64, -28.72], [146.82, -28.14], [144.84, -28.42],
                            [144.31, -28.26], [144.14, -27.41]
                        ],
                        [
                            [144.18, -26.39], [144.53, -26.58], [145.19, -26.62], [145.72, -26.35], [145.81, -25.91],
                            [145.41, -25.68], [144.97, -25.68], [144.49, -25.64], [144, -25.99], [144.18, -26.39]
                        ]
                    ]
                }
            }
        ]
    };
    for(var i = 1; i < 10000; i++){
        testSource.aLot.push({
            id:i,name:'Richi'+i
        })
    }
    jsonOdm.addSource("test",testSource,true);

    describe("Source Selection", function () {
        it("Collection should be empty", function () {
            jsonOdm.addSource("empty",{},true);
            var collection = new jsonOdm.Collection("parentCollection");
            expect(collection.length).toBe(0);
            jsonOdm.selectSource("test");
            collection = new jsonOdm.Collection("parentCollection");
            expect(collection.length).toBe(1);
        });
    });
    describe("Array inheritance", function () {
        var collection;
        beforeEach(function () {
            collection = new jsonOdm.Collection("testCollection");
        });
        it("Should have initial length", function () {
            expect(collection.length).toBe(2);
        });
        it("Should allow adding values in array style", function () {
            collection[0] = {name:"Mustermann-1"};
            collection[1] = {name:"Mustermann-2"};
            collection[2] = {name:"Mustermann-3"};
            collection.push({name:"Mustermann-4"});
            expect(collection.length).toBe(4);
            expect(collection[1].name).toBe("Mustermann-2");
        });
    });
    describe("Decoration", function () {
        var collection;
        beforeEach(function () {
            collection = new jsonOdm.Collection("parentCollection");
        });
        it("Should be decorated", function () {
            expect(collection.$hasMany).not.toBeUndefined();
            expect(typeof collection.$hasMany).toBe("function");
            expect(typeof collection.$branch(0,'childCollection').$hasMany).toBe("function");
        });
        it("Should join", function () {
            collection.$hasMany("keys","id","foreignCollection","foreignKeys");
            collection.$hasOne("onOfALotId","id","aLot","onOfALot");
            expect(collection[0].foreignKeys.length).toBe(2);
            expect(collection[0].onOfALot.id).toBe(collection[0].onOfALotId);
        });
    });
    describe("Querying", function () {
        describe("Simple Logic with collection 'testCollection'", function () {
            var collection;
            beforeAll(function () {
                collection = new jsonOdm.Collection("testCollection");
            });
            it("Should be equal", function () {
                expect(collection.$query().$branch("name").$eq("Mustermann").$first().name).toBe("Mustermann");
                expect(collection.$query().$branch("name").$eq("Jack").$all().length).toBe(0);
            });
            it("Should be not equal", function () {
                expect(collection.$query().$branch("name").$ne("Musterfrau").$first().name).toBe("Mustermann");
                expect(collection.$query().$branch("name").$nin(["Musterfrau","Mustermann"]).$all().length).toBe(0);
                expect(collection.$query().$branch("name").$nin(["Musterfrau"]).$first().name).toBe("Mustermann");
            });
            it("Should be greater then and greater then or equal", function () {
                expect(collection.$query().$branch("id").$gt(1).$all()[0].name).toBe("Musterfrau");
                expect(collection.$query().$branch("id").$gte(1).$all().length).toBe(2);
            });
            it("Should be less then or equal", function () {
                expect(collection.$query().$branch("id").$lte(2).$first().name).toBe("Mustermann");
                expect(collection.$query().$branch("id").$lte(2).$all().length).toBe(2);
            });
            it("Should be null", function () {
                expect(collection.$query().$branch("firstName").$isNull().$all().length).toBe(1);
                expect(collection.$query().$branch("middleName").$isNull().$all().length).toBe(2);
            });
            it("Should exist", function () {
                expect(collection.$query().$branch("middleName").$exists().$all().length).toBe(0);
                expect(collection.$query().$branch("firstName").$exists().$all().length).toBe(2);
            });
            it("Should filter by type", function () {
                // TODO something is wrong here
                //expect(collection.$query().$branch("firstName").$type("string","null").$all().length).toBe(2);
                expect(collection.$query().$branch("firstName").$type("string").$all().length).toBe(1);
                expect(collection.$query().$branch("middleName").$type("undefined").$all().length).toBe(2);
                expect(collection.$query().$branch("firstName").$type("undefined").$all().length).toBe(0);
            });

        });
        describe("Simple Logic with collection 'aLot'", function () {
            var collection;
            beforeAll(function () {
                collection = new jsonOdm.Collection("aLot");
            });
            it("Should be less then", function () {
                expect(collection.$query().$branch("id").$lt(401).$all().length).toBe(400);
            });
            it("Should be equal with multiple parameters", function () {
                expect(collection.$query().$branch("name").$eq("Richi199","Richi400").$all()[1].name).toBe("Richi400");
            });
            it("Should be in a value", function () {
                expect(collection.$query().$branch("name").$in(["Richi199","Richi400"]).$all()[1].name).toBe("Richi400");
            });
        });
        describe("Modulo operator", function () {
            var collection;
            beforeAll(function () {
                collection = new jsonOdm.Collection("aLot");
            });
            it("Should calculate the modulo", function () {
                expect(collection.$query().$branch("id").$mod(4,0).$all().length).toBe(Math.floor(collection.length/4));
                expect(collection.$query().$branch("id").$mod(4,0).$first().id).toBe(4);
            });
        });
        describe("Regular expression", function () {
            var collection;
            beforeAll(function () {
                collection = new jsonOdm.Collection("aLot");
            });
            it("Should find by regular expression", function () {
                expect(collection.$query().$branch("name").$regex("^richi[0-9]{1,2}$","i").$all().length).toBe(99);
                expect(collection.$query().$branch("name").$regex(/^richi[0-9]{1,2}$/i).$all().length).toBe(99);
                expect(collection.$query().$branch("name").$regex("^richi[0-9]{1,2}$").$all().length).toBe(0);
                expect(collection.$query().$branch("name").$regex(/^richi[0-9]{1,2}$/).$all().length).toBe(0);
            });
        });
        describe("Logic operators", function () {
            var collection, q,subCollection;
            beforeAll(function () {
                collection = new jsonOdm.Collection("aLot");
                q = collection.$query();
            });
            it("Should select by one or the other", function () {
                subCollection = q.$or(
                    q.$branch("name").$eq("Richi400"),
                    q.$branch("name").$eq("Richi199")
                ).$all();
                expect(subCollection.length).toBe(2);
                expect(subCollection[0].id).toBe(199);
                expect(subCollection[1].id).toBe(400);
            });
            it("Should select by one and the other", function () {
                subCollection = q.$and(
                    q.$branch("name").$eq("Richi401"),
                    q.$branch("id").$eq(401)
                ).$all();
                expect(subCollection.length).toBe(1);
                expect(subCollection[0].id).toBe(401);
            });
            it("Should select by one nand the other", function () {
                subCollection = q.$nand(
                    q.$branch("id").$eq(401),
                    q.$branch("name").$eq("Richi401")
                ).$all();
                expect(subCollection.length).toBe(collection.length-1);
                expect(subCollection.$query().$branch("id").$eq(401).$all().length).toBe(0);
            });
            it("Should select by one nor the other", function () {
                subCollection = q.$nor(
                    q.$branch("id").$gt(600),
                    q.$branch("id").$lt(400),
                    q.$branch("id").$eq(500)
                ).$all();
                expect(subCollection.length).toBe(200);
                expect(subCollection[0].id).toBe(400);
                expect(subCollection[100].id).toBe(501);
                expect(subCollection[99].id).toBe(499);
            });
            it("Should select by complex one or the other", function () {
                subCollection = q.$or(
                    q.$and(
                        q.$branch("name").$eq("Richi401"),
                        q.$branch("id").$eq(401)
                    ),
                    q.$and(
                        q.$branch("name").$eq("Richi1002"),
                        q.$branch("id").$eq(1002)
                    )
                ).$all();
                expect(subCollection.length).toBe(2);
                expect(subCollection[0].id).toBe(401);
                expect(subCollection[1].id).toBe(1002);
            });
        });
        describe("Accumulation operators", function () {
            var collection, q;
            beforeEach(function () {
                collection = new jsonOdm.Collection("employees");
                collection.$hasOne("id","salaryGroupId","salaryGroup");
                q = collection.$query();
            });
            it("Should group without projection", function () {
                var grouped = q.$group(
                    "salaryGroupId"
                ).$all();
                expect(grouped.length).toBe(5);
            });
            it("Should group the collection by fields", function () {
                var grouped = q.$group(
                    "salaryGroupId",
                    ["salaryGroup","name"],
                    "daysOff",
                    {
                        "allExtraHours":q.$sum("extraHoursWorked"),
                        "allDaysOff":q.$sum("daysOff"),
                        "elements": q.$push(),
                        "count":q.$count()
                    }
                ).$all();
                for(var i = 0; i < grouped.length; i++){
                    expect(grouped[i].count).toBe(grouped[i].elements.length);
                    expect(grouped[i].count * grouped[i].daysOff).toBe(grouped[i].allDaysOff);
                    var allExtraHoursWorked = 0;
                    for(var j = 0; j < grouped[i].elements.length; j++){
                        allExtraHoursWorked += grouped[i].elements[j].extraHoursWorked;
                        expect(grouped[i].salaryGroup.name).toBe(grouped[i].elements[j].salaryGroup.name);
                    }
                    expect(allExtraHoursWorked).toBe(grouped[i].allExtraHours);
                }
            });
            it("Should sum up a field", function () {
                // sum up manually
                var expectedSum = 0;
                for(var i = 0; i < testSource.employees.length; i++){
                    expectedSum += testSource.employees[i].daysOff;
                }
                q.$sum("daysOff").$all();
                expect(expectedSum).toBe(q.$$accumulation);
            });
            it("Should get the average of a field", function () {
                // sum up manually
                var sum = 0;
                for(var i = 0; i < testSource.employees.length; i++){
                    sum += testSource.employees[i].daysOff;
                }
                var subQ = q.$avg("daysOff");
                subQ.$all();
                expect(sum/testSource.employees.length).toBe(subQ.$$accumulation);
            });
            it("Should get the maximum of a field", function () {
                // sum up manually
                var max = 0;
                for(var i = 0; i < testSource.employees.length; i++){
                    max = Math.max(max,testSource.employees[i].daysOff);
                }
                q.$max("daysOff").$all();
                expect(max).toBe(q.$$accumulation);
            });
            it("Should get the maximum of a field", function () {
                // sum up manually
                var min = 0;
                for(var i = 0; i < testSource.employees.length; i++){
                    min = Math.min(min,testSource.employees[i].daysOff);
                }
                q.$min("daysOff").$all();
                expect(min).toBe(q.$$accumulation);
            });
            it("Should count all elements", function () {
                q.$count().$all();
                expect(collection.length).toBe(q.$$accumulation);
            });
            it("Should count all elements", function () {
                q.$push().$all();
                expect(collection.length).toBe(q.$$accumulation.length);
            });
        });
        describe("Arithmetic operators", function () {
            var collection, q;
            beforeEach(function () {
                collection = new jsonOdm.Collection("arithmeticCollection");
                q = collection.$query();
            });
            it("Should add all fields", function () {
                var sum = collection[0].cars+collection[0].trucks+collection[0].bikes;
                expect(q.$add(q.$branch("cars"),q.$branch("trucks"),q.$branch("bikes")).$eq(sum).$first().id).toBe(collection[0].id);
            });
            it("Should subtract all fields", function () {
                var subtraction = collection[1].cars-collection[1].trucks-collection[1].bikes;
                expect(q.$subtract(q.$branch("cars"),q.$branch("trucks"),q.$branch("bikes")).$eq(subtraction).$first().id).toBe(collection[1].id);
            });
            it("Should multiply all fields", function () {
                var multiply = collection[2].cars*collection[2].trucks*collection[2].bikes;
                expect(q.$multiply(q.$branch("cars"),q.$branch("trucks"),q.$branch("bikes")).$eq(multiply).$first().id).toBe(collection[2].id);
            });
            it("Should divide all fields", function () {
                var division = collection[3].cars/collection[3].trucks/collection[3].bikes;
                expect(q.$divide(q.$branch("cars"),q.$branch("trucks"),q.$branch("bikes")).$eq(division).$first().id).toBe(collection[3].id);
            });
            it("Should calculate fields1 mod field2", function () {
                var moduloResult = collection[1].trucks%collection[1].bikes;
                expect(q.$modulo(q.$branch("trucks"),q.$branch("bikes")).$eq(moduloResult).$first().id).toBe(collection[1].id);
            });
            it("Should calculate fields1 mod 5", function () {
                var moduloResult = collection[0].trucks % 5;
                expect(q.$modulo(q.$branch("trucks"),5).$eq(moduloResult).$first().id).toBe(collection[0].id);
            });
        });
    });
    describe("String modification", function () {
        var collection, firstCite;
        beforeAll(function () {
            collection = new jsonOdm.Collection("goldenRuleCollection");
            firstCite = collection.$query().$first();
        });
        it("Should substring the result", function () {
           expect(collection.$query().$branch("cite").$substr(3,12).$eq(firstCite.cite.substr(3,12)).$first().id).toBe(firstCite.id);
        });
        it("Should double substring the result", function () {
           expect(collection.$query().$branch("cite").$substr(3,12).$substr(0,2).$eq(firstCite.cite.substr(3,12).substr(0,2)).$first().id).toBe(firstCite.id);
        });
    });
    describe("Projection", function () {
        var collection,query,projected;
        beforeAll(function () {
            collection = new jsonOdm.Collection("goldenRuleCollection");
            query = collection.$query();
            projected = query.$project({
                concat: function (element) {
                    return element.id + element.lang
                },
                firstFour : query.$branch("cite").$substr(0,4),
                firstTen : query.$branch("cite").$substr(0,20).$substr(0,10),
                lang:1,
                language:query.$branch("lang")
            }).$all();
        });
        it("Should have concat id and language", function () {
            expect(projected[0].concat).toBe(collection[0].id+collection[0].lang);
        });
        it("Should have the first four cite letters", function () {
            expect(projected[0].firstFour).toBe(collection[0].cite.substr(0,4));
            expect(projected[5].firstFour).toBe(collection[5].cite.substr(0,4));
        });
        it("Should have the first ten cite letters", function () {
            expect(projected[5].firstTen).toBe(collection[5].cite.substr(0,10));
        });
        it("Should have the lang", function () {
            expect(projected[5].lang).toBe("en");
        });
        it("Should have the lang equal to language", function () {
            expect(projected[5].lang).toBe(projected[5].language);
        });
        it("Should not have a cite field", function () {
            expect(projected[5].cite).toBeUndefined();
        });
        it("Should not have a id field", function () {
            expect(projected[5].id).toBeUndefined();
        });
    });
    describe("Find text", function () {
        var collection = new jsonOdm.Collection("goldenRuleCollection");
        it("Should find both english rules",function() {
            expect(collection.$query().$branch("cite").$text("One treat").$all().length).toBe(2);
        });
        it("Should find only first english rule",function() {
            expect(collection.$query().$branch("cite").$text("One treat -not").$all().length).toBe(1);
        });
        it("Should find only first english rule",function() {
            expect(collection.$query().$branch("cite").$text("\"One should treat\"").$all().length).toBe(1);
        });
        it("Should find two 'da' and 'pl'",function() {
            expect(collection.$query().$branch("cite").$text("næste Rób").$all().length).toBe(2);
        });
        it("Should find only 'da' and first 'en'",function() {
            expect(collection.$query().$branch("cite").$text("to -treated").$all().length).toBe(2);
        });
        it("Should find both english rules",function() {
            expect(collection.$query().$branch("cite").$text("trea").$all().length).toBe(2);
        });
        it("Should find only english rules",function() {
            expect(collection.$query().$branch("cite").$text("\"trea\" innym").$all().length).toBe(2);
        });
    });
    describe("Wheresearch", function () {
        var collection = new jsonOdm.Collection("goldenRuleCollection");
        it("Should find all english rules",function(){
            expect(collection.$query().$where("return this.lang == 'en'").$all().length).toBe(0);
        });
        it("Should find first english rules",function(){
            expect(collection.$query().$where("return this.lang == 'en'").$first()).toBeUndefined();
        });
        it("Should find all english rules",function(){
            expect(collection.$query().$where(function(){return this.lang == 'en';}).$all().length).toBe(2);
        });
        it("Should find first english rules",function(){
            expect(collection.$query().$where(function(){return this.lang == 'en';}).$first().id).toBe(1);
        });
        it("Should find all english rules",function(){
            expect(collection.$query().$branch("lang").$where(function(){return this == 'en';}).$all().length).toBe(2);
        });
    });
    describe("Delete elements", function () {
        var collection = new jsonOdm.Collection("aLot");
        collection.$query().$branch("id").$gt(500).$delete();
        it("Should delete all but the first 500", function () {
            expect(collection.length).toBe(500);
        });
    });
    describe("Geo Querying", function () {
        describe("GeoWithin", function () {
            var collection = new jsonOdm.Collection("geo"),
                q;
            it("Should find the 2nd O in Google", function () {
                q = collection.$query().$branch("geometry").$geoWithin(new jsonOdm.Geo.BoundaryBox([129.049317,-31.434555,139.464356,-19.068644]));
                expect(q.$all().length).toBe(1);
            });
            it("Should find the 2nd O and G in Google", function () {
                q = collection.$query().$branch("geometry").$geoWithin(new jsonOdm.Geo.BoundaryBox([129.049317,-35.434555,140.870606,-19.068644]));
                expect(q.$all().length).toBe(2);
            });
        });
        describe("GeoIntersect", function () {
            var collection = new jsonOdm.Collection("geo"),
                q;
            it("Should find the Goo in Google", function () {
                q = collection.$query().$branch("geometry").$geoIntersects(new jsonOdm.Geo.BoundaryBox([129.049317,-31.434555,139.464356,-19.068644]));
                expect(q.$all().length).toBe(3);
            });
            it("Should find the 2nd O and G in Google", function () {
                q = collection.$query().$branch("geometry").$geoIntersects(new jsonOdm.Geo.BoundaryBox([129.049317,-35.434555,140.870606,-19.068644]));
                expect(q.$all().length).toBe(4);
            });
        });
    });
});