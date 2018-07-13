"use strict";

var rawData = {}
var config = {
  apiKey: "AIzaSyBbmTiH7MPtQEfKW3ElCw5lnX_DLiIeaqQ",
  authDomain: "grantnav-dataviz.firebaseapp.com",
  databaseURL: "https://grantnav-dataviz.firebaseio.com/"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

var excludeWellcome = document.getElementById("scales").checked == true;
console.log(excludeWellcome)

var theme


const canvas = document.createElement("canvas");
canvas.width = 900;
canvas.height = 400;


var total = 0
var newData = {}
var orgs = []
const setData = () => {
  newData = {}
  total = 0
  rawData.forEach((record) => {
    if (record['Funding Org:Name'] === "The Wellcome Trust" && excludeWellcome) {
      null
    } else {
      total = total + record['Amount Awarded']
    }
  })
  var scalar = (total/(canvas.width/5*100)*1.5)
  console.log(total)

  rawData.forEach((record) => {
    if (record['Funding Org:Name'] === "The Wellcome Trust" && excludeWellcome) {
      null
    } else {
       if (newData[record.YearMonth]) {
        newData[record.YearMonth].push({org: record['Funding Org:Name'], value: record['Amount Awarded'],size: Math.sqrt(record['Amount Awarded']/ scalar )})
      } else {
        newData[record.YearMonth] = [{org: record['Funding Org:Name'], value: record['Amount Awarded'], size: Math.sqrt(record['Amount Awarded']/scalar )}]
      }
    }
  })
}
var colors = {}
console.log(newData)
const changeTheme = () => {
  theme = window.location.href.replace('%20', ' ').split("#")[1]
  database.ref('/themes/' + theme.replace(' ', '%20')).once('value').then((snapshot) => {
    console.log('checking firebase')
    console.log(snapshot.val().data)
    rawData = snapshot.val() && snapshot.val().data || {};

    orgs = snapshot.val() && snapshot.val().orgs  || ['The Wellcome Trust' ,'The Big Lottery Fund' ,'Department for Transport',
     "Lloyd's Register Foundation" ,'Gatsby Charitable Foundation',
     'Sport England', 'Wolfson Foundation', 'Nesta', 'London Councils',
     'Esmée Fairbairn Foundation', 'Other']
    console.log(orgs)

    var index = 0
    orgs.forEach((org) => {
        colors[org] = colorList[index]
        index += 1
    })
    setData()
  });

}


const rad = d => d * Math.PI / 180;

canvas.style.border = "2px solid #ddd";
canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
canvas.style.borderRadius = '5px'
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
ctx.lineWidth = 0;

const Engine = Matter.Engine;
const World = Matter.World;
const Vector = Matter.Vector;
const Bodies = Matter.Bodies;
const engine = Engine.create({enableSleeping: true});
const MouseConstraint = Matter.MouseConstraint;
const mouseConstraint = MouseConstraint.create(engine);
const setMouseOffset = () => {
  const rect = canvas.getBoundingClientRect();
  Matter.Mouse.setOffset(mouseConstraint.mouse, {
    x: -rect.x, y: -rect.y
  });
};
setMouseOffset();
document.addEventListener("mousemove", e =>
  setTimeout(setMouseOffset, 500)
);
World.add(engine.world, mouseConstraint);

// Create body arrays
const boxes = [];
const rightboxes = [];
const ledges = [
  Bodies.rectangle(
    -150, 0,
    canvas.width + 50, 15,
    {
                    chamfer: { radius: 3 },
                    isStatic: true,
                   color: '#484848'}
  ),
  Bodies.rectangle(0, 100,
    10, canvas.height, { color: 'rgba(0,0,0,0)'
    , chamfer: { radius: 3 }, isStatic: true}
  ),
  Bodies.rectangle(canvas.width/2, canvas.height - 10,
     canvas.width/5, 20,
                   {
                    chamfer: { radius: 3 },
                    isStatic: true,
                   color: '#484848'}
                  ),
  Bodies.rectangle(canvas.width/2 - canvas.width/10, canvas.height - 10,
  20, canvas.height/2 + 100,
                   {chamfer: { radius: 3 },
                    isStatic: true,
                   color: '#484848'}
  ),
    Bodies.rectangle(canvas.width/2 + canvas.width/10, canvas.height - 10,
  20, canvas.height/2 + 100, {
                    chamfer: { radius: 3 },
                    isStatic: true,
                   color: '#484848'}
  )
];
Matter.Body.rotate(ledges[0], rad(20));



// Add bodies to the world
World.add(engine.world, ledges);
//Engine.run(engine);

// Create ticker
var month = 1
let year = 2008
var t = '200801'
var frameTime
var runningTotal = 0
var orgTotals = {}
const ticker =  ()  => {
    setInterval(() => {
      if (window.location.href.replace('%20', ' ').split("#")[1] !== theme || excludeWellcome !== document.getElementById("scales").checked == true) {
        excludeWellcome = document.getElementById("scales").checked == true;
        console.log(document.getElementById("scales").checked)
        console.log(document.getElementById("scales").checked == true)
        console.log(document.getElementById("scales"))
        t = '200801'
        year = 2008
        month = 1
        for (let i = boxes.length - 1; i >= 0; i--) {
          World.remove(engine.world, boxes[i]);
          boxes.splice(i, 1);
        }
        runningTotal = 0
        orgTotals = {}
        changeTheme()
      }
      if (!(year > 2017 && month > 6)) {
       if (month !== 12) {
        month = month + 1
      } else {
        month = 1
        year = year + 1
      }
        var twodigitmonth = month.toString().length === 1 ? '0' + month : month
       t = year.toString() + twodigitmonth
       Object.keys(newData[t]).forEach((key) => {
         runningTotal = runningTotal + newData[t][key].value

         orgTotals[newData[t][key].org] = orgTotals[newData[t][key].org] ? orgTotals[newData[t][key].org] + newData[t][key].value : newData[t][key].value
       })
      }

    }, 500);
}
ticker()




var colorList = ['#3366CC',
'#DC3912',
'#FF9900',
'#109618',
'#990099',
'#3B3EAC',
'#0099C6',
'#DD4477',
'#66AA00',
'#B82E2E',
'#316395',
'#994499',
'#22AA99',
'#AAAA11',
'#6633CC',
'#E67300',
'#8B0707',
'#329262',
"#5574A6",
'#3B3EAC']

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function MoneyFormat(input)
  {
  var labelValue = Math.ceil(input)
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9

       ? Math.abs(Number(labelValue) / 1.0e+9).toPrecision(3) + "B"
       // Six Zeroes for Millions
       : Math.abs(Number(labelValue)) >= 1.0e+6

       ? Math.round(Math.abs(Number(labelValue)) / 1.0e+6) + "M"
       // Three Zeroes for Thousands
       : Math.abs(Number(labelValue)) >= 1.0e+3

       ? Math.ceil(Math.abs(Number(labelValue)) / 1.0e+3) + "K"

       : Math.abs(Number(labelValue));

   }

const addDate = (ctx) => {
  ctx.font = "16px Nunito";
  ctx.fillStyle = 'rgb(255,255,255)'
  var monthtext = months[Number(t.substring(4, 6)) - 1]
  ctx.fillText( monthtext + " " + t.substring(0,4), 10, canvas.height -50);
  ctx.font = "26px Nunito";
  if (theme) {
    ctx.fillText( '"' + theme + '" Grant Funding', 50, 50);
  } else {
    ctx.fillText( 'Choose a Theme', 50, 50);
  }


  ctx.font = "16px Nunito";
  ctx.fillStyle = 'rgb(255,255,255)'
  ctx.fillText('------ Total: ' + MoneyFormat(runningTotal), canvas.width - 300,
              canvas.height - runningTotal/total * 120 - 20)
  // ctx.fillText('Total: ' + total, 10, 50)
}


const addLegend = (ctx) => {
  var i = 0
  ctx.font = "14px Nunito";
  orgs.forEach((org) => {
    var orgNumber = Number(orgTotals[org]) ? MoneyFormat(orgTotals[org]) : '0'
    var shortOrg
    if (org.length > 20) {
      shortOrg = org.substring(0,20) + '...'
    } else {
      shortOrg = org
    }
    var text = shortOrg

    ctx.fillText(text, canvas.width - 300, 30 +  18 * i)

    ctx.fillStyle = colors[org]
    ctx.fillRect(canvas.width - 150, 18 + 18* i  , orgTotals[org]/total * 200, 14)
    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillText(orgNumber, canvas.width - 100, 30 +  18 * i)
    i = i + 1
  })
}

const draw = (body, ctx) => {
  ctx.fillStyle = body.color || "#fff";
  ctx.beginPath();
  body.vertices.forEach(e => ctx.lineTo(e.x, e.y));
  ctx.closePath();
  ctx.fill();

};

const inBounds = (body, canvas) => {
  for (let i = 0; i < body.vertices.length; i++) {
    if (body.vertices[i].x < canvas.width &&
      body.vertices[i].x > 0 &&
      body.vertices[i].y < canvas.height //&&
      /*body.vertices[i].y > 0*/) {
      return true;
    }
  }

  return false;
};

(function update() {
   if (Math.random() < 1) {
    if (frameTime != t) {
      var array = newData[t]
      if (array) {
        for (var i = 0; i < array.length; i++) {
          boxes.unshift(Bodies.polygon(
            100, -100, 4, array[i].size ,
            {frictionAir: 0, friction: 0, restitution: 0.5,

             color : colors[array[i].org]}
          ))
          World.add(engine.world, [boxes[0]]);
        }
      }

      frameTime = t

    }


  }


  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = boxes.length - 1; i >= 0; i--) {
    draw(boxes[i], ctx);

    if (!inBounds(boxes[i], canvas)) {
      World.remove(engine.world, boxes[i]);
      boxes.splice(i, 1);
    }
  }

  addDate(ctx)
  addLegend(ctx)

  ledges.forEach(e => draw(e, ctx));
  Engine.update(engine);  // instead of a single call to Engine.run(engine)
  requestAnimationFrame(update);
})();
