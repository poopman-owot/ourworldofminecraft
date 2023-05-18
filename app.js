//before major chnge 374
//Before playersided changes 408
function minecraft() {}
let timeOfDay = 0;
let cycleSpeed = 1;
let globalTickIterator = 0;
var BlockImages = [];
var charImages = [];
var surfaces = null;
var Material = null;
var WorldSeed = null;
var clientSetup = false;
var timestamp = null;
var tilesBuffer = [];
var playerLocation = [0, 0, 0, 0];
const minecraftBlocks = "█";
let dayColor = {
  r: 226,
  g: 241,
  b: 255,
}
useHighlight = false;

function pixels() {
  // This is what gives us that blocky pixel styling, rather than a blend between pixels.
  owot.style.cssText = 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
    'image-rendering: -moz-crisp-edges;' + // FireFox
    'image-rendering: -o-crisp-edges;' + // Opera
    'image-rendering: -webkit-crisp-edges;' + // Chrome
    'image-rendering: crisp-edges;' + // Chrome
    'image-rendering: -webkit-optimize-contrast;' + // Safari
    'image-rendering: pixelated; ' + // Future browsers
    '-ms-interpolation-mode: nearest-neighbor;'; // IE
  // Use nearest-neighbor scaling when images are resized instead of the resizing algorithm to create blur.
  owotCtx.webkitImageSmoothingEnabled = false;
  owotCtx.mozImageSmoothingEnabled = false;
  owotCtx.msImageSmoothingEnabled = false;
  owotCtx.imageSmoothingEnabled = false;
}
class User {
  constructor(username, usertype) {
    this.username = username;
    this.usertype = usertype;
  }
}
var user = null;

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function SendRecieveServerData(value) {
  w.broadcastReceive(value);
  w.on("cmd", function(e) {
    if (e.sender) {
      if (w.socketChannel !== e.sender) {
        if (isJsonString(e.data)) {
          const jsonData = JSON.parse(e.data);
          if (jsonData.recieve) {
            if (jsonData.recieve.sender == w.socketChannel) {

              if (jsonData.recieve.dataType) {

                if (jsonData.recieve.dataType == "setupClient") {
                  OnSetupClient(jsonData.recieve);
                }
                if (jsonData.recieve.dataType == "TimeOfDay") {
                  OnTimeOfDay(jsonData.recieve);
                }
                if (jsonData.recieve.dataType == "SurfaceData") {
                  OnSurfaceData(jsonData.recieve);
                }
                if (jsonData.recieve.dataType == "PlayerData") {
                  onPlayerData(jsonData.recieve);
                }
              }
            }
          }
        }
      }
    }
  })
}
SendRecieveServerData(true);

function tellServer(e) {
  w.broadcastCommand(`{"broadcast":${JSON.stringify(e)}}`, true);
}

function AskSetupClient() {
  w.hideChat();
  if (clientSetup == false) {
    w.on("chat", function(e) {
      if (e.message == "This message is visible to only you.") {
        tellServer({
          SetupClient: e
        })
      }
      removeChatByIdAndDate(e.id, timestamp)
    })
    api_chat_send("/test");
    timestamp = Date.now();
    setTimeout(function() {
      AskSetupClient();
    }, 1000)
  }
}

function OnSetupClient(server) {
  if (server) {
    const e = server;
    clientSetup = true;
    api_chat_send(e.grid);
    userZoom = e.zoom;
    doZoom(e.zoom * 100);
    user = new User(e.username, e.usertype);
    AskTimeOfDay();
    AskForSurfaceData();
    api_chat_send = doZoom = w.goToCoord = () => OnSetupClient();

  } else {
    console.error("Communication from minecraft server failed.")
  }
}


function AskTimeOfDay() {
  if (user) {
    tellServer({
      AskTimeOfDay: true,
      User: user
    })
  }
}

function AskForSurfaceData() {
  if (user) {
    tellServer({
      AskSurfaceData: true,
      User: user
    })
  }
}

function AskForWorldData(x, y) {
  if (user) {

    tellServer({
      AskForWorldData: true,
      location: [x, y, tileW, tileH, cellW, cellH],
      User: user,
    })
  }
}

function SendPlayerEvent(e) {
  if (user) {
    tellServer({
      SendPlayerEvent: true,
      User: user,
      KeyboardEvent: [e.type, e.key],
      Color: YourWorld.Color
    })
  }
}

function OnSurfaceData(e) {
  [surfaces, Material, WorldSeed] = e.packetData;
}

function OnTimeOfDay(e) {
  [timeOfDay, cycleSpeed] = e.packetData;
  w.redraw();
}

const asyncGetTiles = async () => {
  const uniqueArrays = await removeDuplicateArraysAsync(tilesBuffer);
  tilesBuffer = uniqueArrays;
  for (let i = 0; i < tilesBuffer.length; i++) {
    const tile = tilesBuffer[i];
    if (Array.isArray(tile)) {
      const [x, y] = tile;
      AskForWorldData(x, y)


    } else {
      // the cell is for some reason not iterable
    }

    tilesBuffer.splice(i, 1);
    i--;
  }

  setTimeout(function() {
    asyncGetTiles()
  }, 1000)
}



const removeDuplicateArraysAsync = async (arr) => {
  let uniqueArrays = []; // declare the variable before the map method

  await Promise.all(arr.map(async (innerArr) => {
    // Wait for any asynchronous operations to complete if needed
    //await someAsyncOperation();

    // Use JSON.stringify to compare arrays as strings for equality
    const isUnique = !uniqueArrays.some(a => JSON.stringify(a) === JSON.stringify(innerArr));

    // Assign the result to the uniqueArrays variable
    uniqueArrays = uniqueArrays || []; // initialize the variable if it's not set yet
    if (isUnique) {
      uniqueArrays.push(innerArr);
    }
  }));

  return uniqueArrays;
};


function RenderPlayerEdits(char, X, Y, x, y) {
  if (user) {
    tellServer({
      RenderUserEdits: [char, X, Y, x, y],
      User: user
    })
  }
}


function renderBlock(char, charColor, tileX, tileY, charX, charY) {
  if (!Tile.get(tileX, tileY)) {
    Tile.set(tileX, tileY, blankTile());
  }
  var tile = Tile.get(tileX, tileY);
  var cell_props = tile.properties.cell_props;
  if (!cell_props) cell_props = {};
  var color = tile.properties.color;
  if (!color) color = new Array(tileArea).fill(0);

  var hasChanged = false;
  var prevColor = 0;
  var prevBgColor = -1;
  var prevChar = "";
  var prevLink = getLink(tileX, tileY, charX, charY);

  // set text color
  prevColor = color[charY * tileC + charX];
  color[charY * tileC + charX] = charColor;
  if (prevColor != charColor) hasChanged = true;
  tile.properties.color = color; // if the color array doesn't already exist in the tile
  // update cell properties (link positions)

  // set char locally
  var con = tile.content;
  prevChar = con[charY * tileC + charX];
  con[charY * tileC + charX] = char;
  if (prevChar != char) hasChanged = true;
  w.setTileRedraw(tileX, tileY);

}

function loadScript(url, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onload = function() {
    callback();
  };

  document.head.appendChild(script);
}
// Load perlin.js
loadScript(`https://cdn.jsdelivr.net/gh/josephg/noisejs@latest/perlin.js`, function() {
  main();
});

function main() {
  pixels();
  AskSetupClient(); // get client data for save states
  textInput.remove();
  DisableUserInput(); // make it feel more gamelike
  w.redraw();

  w.on("tileRendered", function(rendered) {
    if (clientSetup) {
      if (surfaces) {
        tilesBuffer.push([rendered.tileX, rendered.tileY]);
      }
    }
  })
  asyncGetTiles();
}



// this function disables scrolling and zooming to help the game feel more like an actual game.
function DisableUserInput() {

  document.onmousewheel = function(e) {
    e.preventDefault()
  }
  document.oncontextmenu = function(e) {
    e.preventDefault()
  }
  defaultCursor = "pointer";
  defaultDragCursor = "pointer";
  scrollingEnabled = false;
  draggingEnabled = false;
  gridEnabled = false;
  cursorOutlineEnabled = true;
  Permissions.can_edit_tile = function() {
    return true
  }
  document.addEventListener("keydown", (e) => {
    if (
      e.ctrlKey &&
      (e.code === "Equal" ||
        e.code === "NumpadAdd" ||
        e.code === "Minus" ||
        e.code === "NumpadSubtract" ||
        e.code === "Equal" ||
        e.code === "NumpadAdd" ||
        e.code === "Minus" ||
        e.code === "NumpadSubtract")
    ) {
      e.preventDefault();
    }
  });

  document.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    }, {
      passive: false
    }
  );

  return



}

setInterval(function() {
  if (clientSetup) {
    AskTimeOfDay();
  }
}, 10000);


const Lerp = (start = 0, end = 0, amt = 0.5, roundResult = false) => {
  let value = (1 - amt) * start + amt * end;
  if (roundResult) {
    value = Math.round(value);
  }
  return value;
}

const CycleImage = (imageArray, index) => {
  return imageArray[globalTickIterator % imageArray.length];
};

const imgBase = "https://ik.imagekit.io/poopman/minecraft/";
const imgUpdate = "?updatedAt=1681500165863";
const getImage = (imgName) => {
  return imgBase + imgName + imgUpdate;
}

const MinecraftImageSource = {
  grass: [getImage("grass.png")],
  dirt: [getImage("dirt.png")],
  stone: [getImage("stone.png")],
  gravel: [getImage("gravel.png")],
  mud: [getImage("mud.png")],
  sand: [getImage("sand.png")],
  clay: [getImage("clay.png")],
  iron: [getImage("iron-ore.png")],
  copper: [getImage("copper-ore.png")],
  gold: [getImage("gold-ore.png")],
  diamond: [getImage("diamond-ore.png")],
  lava: [getImage("lava-01.png"), getImage("lava-02.png"), getImage("lava-03.png"), getImage("lava-04.png"), getImage("lava-05.png"), getImage("lava-06.png"), getImage("lava-07.png"), getImage("lava-08.png"), getImage("lava-09.png"), getImage("lava-10.png")],
}



const materialKey = {
  "32768": MinecraftImageSource.grass,
  "8281926": MinecraftImageSource.dirt,
  "8289918": MinecraftImageSource.stone,
  "11316396": MinecraftImageSource.gravel,
  "4271395": MinecraftImageSource.mud,
  "16772002": MinecraftImageSource.sand,
  "13418174": MinecraftImageSource.clay,
  "12763344": MinecraftImageSource.iron,
  "13801216": MinecraftImageSource.copper,
  "16766976": MinecraftImageSource.gold,
  "11204863": MinecraftImageSource.diamond,
  "16711680": MinecraftImageSource.lava,
}

for (block in Object.keys(materialKey)) {
  charImages.push(new Image)
}

const getMaterialIndex = (number) => {
  const keys = Object.keys(materialKey).sort((a, b) => Number(a) - Number(b));
  const key = keys.find(key => Number(key) === number);
  if (key) {
    return keys.indexOf(key);
  }
  return -1;
};
const CellToPixelCoords = (...cellCoords) => {
  const [x = 0, y = 0, z = 0, w = 0] = Array.isArray(cellCoords[0]) ? cellCoords[0] : cellCoords;

  if (cellCoords.length > 4 || x === undefined || y === undefined || z === undefined || w === undefined) {
    console.error(`CellToPixelCoords: Invalid cellCoords. Arguments can either be [x, y, z, w] or x, y, z, w. Your cellCoords was: ${cellCoords}`);
    return;
  }

  const X = Math.round(x) * tileW + z * cellW + Math.round(positionX) + Math.round(owotWidth / 2);
  const Y = Math.round(y) * tileH + w * cellH + Math.round(positionY) + Math.round(owotHeight / 2);

  return [X, Y];
}

const SubtractArrays = (arr1, arr2, roundResult = false) => {
  const resultArray = arr1.map((value, index) => {
    let result = value - arr2[index];
    if (roundResult) {
      result = Math.round(result);
    }
    return result;
  });
  return resultArray;
}
const LerpArray = (startArray, endArray = startArray.map(() => 0), amt = 0.5, roundResult = false) => {
  let resultArray = startArray.map((value, i) => Lerp(value, endArray[i], amt, roundResult));
  return resultArray;
}
const centerPlayer = (coords, offset = [0, 0], lerpSpeed = 0.01, ...rest) => {
  let x = 0,
    y = 0;
  // If input is an array
  if (Array.isArray(offset) && offset.length < 3) {
    [x = 0, y = 0] = offset;
  }
  // If input is two separate arguments
  else if (rest.length < 2) {
    [x = 0, y = 0] = rest;
  }
  // Invalid input
  else {
    console.error(`centerPlayer: Invalid offset. Arguments can either be [x, y] or x, y. Your offset was: ${offset}`);
    return;
  }
  return ScrollWorld(LerpArray([0, 0], SubtractArrays(CellToPixelCoords(coords), [(owotWidth / 2) + x, (owotHeight / 2) + y]), lerpSpeed));
};
const ScrollWorld = (offset = [0, 0], ...rest) => {
  let x = 0,
    y = 0;

  // If input is an array
  if (Array.isArray(offset) && offset.length < 3) {
    [x = 0, y = 0] = offset;
  }
  // If input is two separate arguments
  else if (rest.length < 2) {
    [x = 0, y = 0] = rest;
  }
  // Invalid input
  else {
    console.error(`ScrollWorld: Invalid offset. Arguments can either be [x, y] or x, y. Your offset was: ${offset}`);
    return;
  }

  const deltaX = Math.trunc(x);
  const deltaY = Math.trunc(y);

  positionY -= deltaY;
  positionX -= deltaX;

  w.emit("scroll", {
    deltaX: -deltaX,
    deltaY: -deltaY
  });

  return [deltaY, deltaX];
};

const replaceColorWithImage = () => {
  w.registerHook("renderchar", (charCode, ctx, tileX, tileY, charX, charY, offsetX, offsetY, width, height) => {
    const color = getCharColor(tileX, tileY, charX, charY);
    const index = getMaterialIndex(color);
    const charKey = Object.keys(MinecraftImageSource)[index];
    if (charKey !== undefined) {
      const imageSrc = CycleImage(MinecraftImageSource[charKey], globalTickIterator);
      charImages[index].src = imageSrc;
      ctx.fillStyle = "transparent";
      ctx.fillRect(offsetX, offsetY, width, height);
      ctx.drawImage(charImages[index], offsetX, offsetY, width, height);
    }
    return false;
  });
};

function onPlayerData(e) {
  playerLocation = e.location;

}
setInterval(function() {
  centerPlayer(playerLocation, [0, 0], 0.05);
  w.redraw();
}, 10)
//replaceColorWithImage();

//} //minecraft
minecraft();

document.addEventListener('keydown', (event) => {
  SendPlayerEvent(event);
});
document.addEventListener('keyup', (event) => {
  SendPlayerEvent(event);
});
