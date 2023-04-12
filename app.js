userZoom = 3;
doZoom(300);
api_chat_send("/warp OurWorldofCraft")
let worldBuffer = [];

let Material = {
  Grass: 32768,
  Dirt: 8281926,
  Stone: 8289918,
  Gravel: 11316396,
  Mud: 4271395,
  Sand: 16772002,
  Clay: 13418174,
  Air: 16777215,
  Iron: 12763344,
  Copper: 13801216,
  Gold: 16766976,
  Diamond: 11204863,
  Lava: 16711680,
}

class MaterialLayer {
  constructor(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    this.g = g;
    this.h = h;
    this.i = i;
    this.j = j;
    this.k = k;
    this.l = l;
    this.m = m;

  }

  getValues() {
    return [this.a, this.b, this.c, this.d, this.e, this.f, this.g, this.h];
  }

  setValues(values) {
    [this.a, this.b, this.c, this.d, this.e, this.f, this.g, this.h] = values;
  }
}

surface0 = new MaterialLayer(
  Material.Dirt,
  Material.Dirt,
  Material.Mud,
  Material.Sand,
  Material.Mud,
  Material.Sand,
  Material.Gravel,
  Material.Mud,
  Material.Sand,
  Material.Clay,
  Material.Air,
  Material.Clay,
  Material.Stone,

);
surface1 = new MaterialLayer(
  Material.Dirt,
  Material.Dirt,
  Material.Dirt,
  Material.Mud,
  Material.Mud,
  Material.Dirt,
  Material.Gravel,
  Material.Mud,
  Material.Sand,
  Material.Clay,
  Material.Air,
  Material.Clay,
  Material.Stone,

);
surface2 = new MaterialLayer(
  Material.Dirt,
  Material.Dirt,
  Material.Dirt,
  Material.Dirt,
  Material.Clay,
  Material.Clay,
  Material.Clay,
  Material.Clay,
  Material.Mud,
  Material.Clay,
  Material.Stone,
  Material.Stone,
  Material.Sand,

);
surface3 = new MaterialLayer(
  Material.Dirt,
  Material.Clay,
  Material.Clay,
  Material.Clay,
  Material.Clay,
  Material.Mud,
  Material.Clay,
  Material.Stone,
  Material.Stone,
  Material.Sand,
  Material.Clay,
  Material.Mud,
  Material.Clay,

);

surface3 = new MaterialLayer(
  Material.Dirt,
  Material.Clay,
  Material.Clay,
  Material.Clay,
  Material.Clay,
  Material.Mud,
  Material.Clay,
  Material.Iron,
  Material.Stone,
  Material.Iron,
  Material.Clay,
  Material.Mud,
  Material.Iron,

);
surface4 = new MaterialLayer(
  Material.Stone,
  Material.Dirt,
  Material.Clay,
  Material.Clay,
  Material.Clay,
  Material.Mud,
  Material.Clay,
  Material.Iron,
  Material.Stone,
  Material.Iron,
  Material.Clay,
  Material.Mud,
  Material.Gold,

);
surface5 = new MaterialLayer(
  Material.Stone,
  Material.Dirt,
  Material.Clay,
  Material.Clay,
  Material.Clay,
  Material.Mud,
  Material.Clay,
  Material.Iron,
  Material.Air,
  Material.Air,
  Material.Clay,
  Material.Mud,
  Material.Diamond,

);

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
  api_chat_send("/gridsize 10x10");
  let worldSeed = noise.seed(5234);
  w.on("tileRendered", function(rendered) {
    generateWorldData(rendered.tileX, rendered.tileY)
  })

}

function determineBlocks(depth, value, value2) {
  //gernerate a generalized rarety percentage
  //most common
  let surfaceParameters = {};
  if (depth < 0 + (value2)) {
    surfaceParameters = surface0;
  } else if (depth < 10 + (value2)) {
    surfaceParameters = surface1;
  } else if (depth < 20 + (value2)) {
    surfaceParameters = surface2;
  } else if (depth < 30 + (value2)) {
    surfaceParameters = surface3;
  } else if (depth < 40 + (value2)) {
    surfaceParameters = surface4;
  } else if (depth < 50 + (value2)) {
    surfaceParameters = surface5;
  } else {
    return Material.Lava;
  }
  if (value < 10 + (value2)) {
    return surfaceParameters.a
  } else if (value < 20 + (value2)) {
    return surfaceParameters.b
  } else if (value < 30 + (value2)) {
    return surfaceParameters.c
  } else if (value < 40 + (value2)) {
    return surfaceParameters.d
  } else if (value < 50 + (value2)) {
    return surfaceParameters.e
  } else if (value < 60 + (value2)) {
    return surfaceParameters.f
  } else if (value < 70 + (value2)) {
    return surfaceParameters.g
  } else if (value < 80 + (value2)) {
    return surfaceParameters.h
  } else if (value < 85 + (value2)) {
    return surfaceParameters.i
  } else if (value < 90 + (value2)) {
    return surfaceParameters.j
  } else if (value < 95 + (value2)) {
    return surfaceParameters.k
  } else if (value < 98.5 + (value2)) {
    return surfaceParameters.l
  } else {
    return surfaceParameters.m
  }
}

const generateWorldData = async (a, b) => {

  const offset = 12345;
  a += offset;
  b += offset;
  if (!Tile.get(a - offset, b - offset).content.toString().includes("█")) {
    //generate base material
    if (b - offset >= 0) {
      for (let x = 0; x < (tileW / cellW); x++) {
        for (let y = 0; y < (tileH / cellH); y++) {
          let tileOffset = Math.abs(noise.perlin2((a * (a * tileW === 0 ? 1 : a * tileW)) / 100, (b * (b * tileH === 0 ? 1 : b * tileH)) / 100));
          let celloffset = Math.abs(noise.simplex2((x * (a * tileW === 0 ? 1 : a * tileW)) / 100, (y * (b * tileH === 0 ? 1 : b * tileH)) / 100));
          let cellValue = Math.abs(noise.simplex2((x * (a * tileW === 0 ? 1 : a * tileW)) / 100, (y * (b * tileH === 0 ? 1 : b * tileH)) / 100));
          tileOffset *= 10;
          celloffset *= 10;
          cellValue *= 108.8;

          const cell = ((x + a) + (y + b) * (tileW / cellW)) * 4;
          let color = determineBlocks(b - offset, cellValue, celloffset);
          //await worldBuffer.push([b, a, y, x, getDate(),"█" , nextObjId,color])
          if (b - offset == 0) {

            let z = Math.abs((Math.sin(2 * x) + Math.sin(Math.PI * x))) * 7
            let w = Math.abs((Math.sin(2 * a) + Math.sin(Math.PI * a)))
            z = Math.round(Math.abs(z) / 2); // cell hill
            w = Math.round(Math.abs(w) * 6); // tile hill
            if (z > 1) {
              z = 0
            }

            if (w == z) {
              z = 1
            } else {
              z += w; //generate a tile based hill offset
            }
            if (x == 0 || x == 15) {
              z = Lerp(z, 4);
            }

            if (y > z) {

              await broadcastWrite("█", color, a - offset, b - offset, x, y, true, false)
            }
            await broadcastWrite("█", Material.Grass, a - offset, b - offset, x, z, true, false)

          } else {
            await broadcastWrite("█", color, a - offset, b - offset, x, y, true, false)
          }


        }
      }

    }
    //Caves
    if (b - offset > 0 && b - offset < 50) {
      for (let x = 0; x < (tileW / cellW); x++) {
        for (let y = 0; y < (tileH / cellH); y++) {
          let tileValue = Math.abs(noise.perlin2((a * (a * tileW === 0 ? 1 : a * tileW)) / 100, (b * (b * tileH === 0 ? 1 : b * tileH)) / 100));
          let cellValue = Math.abs(noise.perlin2((x * (a * tileW === 0 ? 1 : a * tileW)) / 100, (y * (b * tileH === 0 ? 1 : b * tileH)) / 100));
          tileValue *= 50;
          cellValue *= 50;
          const cell = ((x + a) + (y + b) * (tileW / cellW)) * 4;
          //await worldBuffer.push([b, a, y, x, getDate(),"█" , nextObjId,color])
          if (cellValue + tileValue > 30 && b - offset == 0) {
            await broadcastWrite("█", Material.Sand, a - offset, b - offset, x, y, true, false)
          } else if (cellValue + tileValue > 40) {
            await broadcastWrite(" ", Material.Air, a - offset, b - offset, x, y, true, false)
          }
        }
      }
    }
  }
}
setInterval(function() {
  // network.write(worldBuffer.splice(0, 512))
}, 10)

// place a character
function broadcastWrite(char, charColor, tileX, tileY, charX, charY, local, broadcast, noUndo, undoOffset, charBgColor) {

  if (!Tile.get(tileX, tileY)) {
    return;
  }
  var tile = Tile.get(tileX, tileY);
  var isErase = char == "\x08";
  if (isErase) {
    char = " ";
    charColor = 0x000000;
    charBgColor = -1;
  }
  if (charBgColor == null) {
    charBgColor = -1;
  }

  var cell_props = tile.properties.cell_props;
  if (!cell_props) cell_props = {};
  var color = tile.properties.color;
  var bgcolor = tile.properties.bgcolor;
  if (!color) color = new Array(tileArea).fill(0);

  var hasChanged = false;
  var prevColor = 0;
  var prevBgColor = -1;
  var prevChar = "";
  var prevLink = getLink(tileX, tileY, charX, charY);

  // delete link locally
  if (cell_props[charY]) {
    if (cell_props[charY][charX]) {
      delete cell_props[charY][charX];
      hasChanged = true;
    }
  }
  // change color locally
  if (!Permissions.can_color_text(state.userModel, state.worldModel)) {
    charColor = 0x000000;
  }
  if (!Permissions.can_color_cell(state.userModel, state.worldModel)) {
    charBgColor = -1;
  }

  // set text color
  prevColor = color[charY * tileC + charX];
  color[charY * tileC + charX] = charColor;
  if (prevColor != charColor) hasChanged = true;
  tile.properties.color = color; // if the color array doesn't already exist in the tile

  // set cell color
  if (!bgcolor && charBgColor != -1) {
    bgcolor = new Array(tileArea).fill(-1);
    tile.properties.bgcolor = bgcolor;
  }
  if (bgcolor) {
    prevBgColor = bgcolor[charY * tileC + charX];
    bgcolor[charY * tileC + charX] = charBgColor;
    if (prevBgColor != charBgColor) hasChanged = true;
  }

  // update cell properties (link positions)
  tile.properties.cell_props = cell_props;

  if (!isErase) {
    currDeco = getCharTextDecorations(char);
    char = clearCharTextDecorations(char);
    char = detectCharEmojiCombinations(char) || char;
    var cBold = textDecorationModes.bold;
    var cItalic = textDecorationModes.italic;
    var cUnder = textDecorationModes.under;
    var cStrike = textDecorationModes.strike;
    if (currDeco) {
      cBold = cBold || currDeco.bold;
      cItalic = cItalic || currDeco.italic;
      cUnder = cUnder || currDeco.under;
      cStrike = cStrike || currDeco.strike;
    }
    if (char == " ") { // don't let spaces be bold/italic
      cBold = false;
      cItalic = false;
    }
    char = setCharTextDecorations(char, cBold, cItalic, cUnder, cStrike);
  }

  // set char locally
  var con = tile.content;
  prevChar = con[charY * tileC + charX]
  con[charY * tileC + charX] = char;
  if (prevChar != char) hasChanged = true;
  w.setTileRedraw(tileX, tileY);
  if (bufferLargeChars) {
    if (charY == 0) w.setTileRedraw(tileX, tileY - 1);
    if (charX == tileC - 1) w.setTileRedraw(tileX + 1, tileY);
    if (charY == 0 && charX == tileC - 1) w.setTileRedraw(tileX + 1, tileY - 1);
  }
  if (!local) {
    if (hasChanged && (!noUndo || noUndo == -1)) {
      if (noUndo != -1) {
        undoBuffer.trim();
      }
      undoBuffer.push([tileX, tileY, charX, charY, prevChar, prevColor, prevLink, prevBgColor, undoOffset]);
    }
  }

  //TEMP
  if (window.payLoad && window.chunkMax && window.cleanMemory) {
    return;
  }

  var editArray = [tileX, tileY, charX, charY, getDate(), char, nextObjId];
  if (tileFetchOffsetX || tileFetchOffsetY) {
    editArray[0] += tileFetchOffsetY;
    editArray[1] += tileFetchOffsetX;
  }

  var charColorAdded = false;
  if (charColor && Permissions.can_color_text(state.userModel, state.worldModel)) {
    editArray.push(charColor);
    charColorAdded = true;
  }
  if (charBgColor != null && charBgColor != -1 && Permissions.can_color_cell(state.userModel, state.worldModel)) {
    if (!charColorAdded) {
      editArray.push(0);
    }
    editArray.push(charBgColor);
  }

  tellEdit.push(editArray); // track local changes
  if (!local) {
    writeBuffer.push(editArray); // send edits to server
  }
  if (broadcast) {

    w.broadcastCommand(`{"broadcast":${JSON.stringify(editArray)}}`, true);
  }
  nextObjId++;
}
const Lerp = (start = 0, end = 0, amt = 0.5, roundResult = false) => {
  let value = (1 - amt) * start + amt * end;
  if (roundResult) {
    value = Math.round(value);
  }
  return value;
}
let timeOfDay = 0;
let cycleSpeed = 1;
let r = (226);
let g = (241);
let b = (255);
setInterval(function() {
  timeOfDay += 10;
  if (timeOfDay >= 1000) {
    cycleSpeed = cycleSpeed * -1;
    timeOfDay = 0;
  }


  w.redraw();
}, 10000)

globalTickIterator = 0;
w.registerHook("renderchar", function(charCode, ctx, tileX, tileY, charX, charY, offsetX, offsetY, width, height) {
  if (charCode !== 9608) {
    if (tileY < 3) {
      r += (226 - (((charY + (tileY * 7)) * 5)) * 2 - (timeOfDay)) * cycleSpeed;
      g += (241 - (((charY + (tileY * 7)) * 3)) * 2 - (timeOfDay)) * cycleSpeed;
      b += (255 - (((charY + (tileY * 7)))) * 2 - (timeOfDay)) * cycleSpeed;
      r = Math.max(Math.min(r, 255), 0);
      g = Math.max(Math.min(g, 255), 0);
      b = Math.max(Math.min(b, 255), 0);

      ctx.fillStyle = `rgba(${r}, ${g},  ${b}, 1)`;
      ctx.fillRect(offsetX, offsetY, width, height);
      if (r < (Math.random() * 100) && g < (Math.random() * 100) && b < (Math.random() * 100)) {

        ctx.fillStyle = `rgba(${205+r}, ${205+g},  ${205+b}, ${Math.random()*1})`
        ctx.fillRect(offsetX, offsetY, 1, 1)
      }

      r = 50
      g = 50
      b = 50


      return true;
    } else {
      ctx.fillStyle = `rgba(50, 50,  50, 1)`;
      ctx.fillRect(offsetX, offsetY, width, height);
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      ctx.lineTo(offsetX + width, offsetY + height);
      ctx.stroke();
      return true;
    }

    return false;
  }
});
const CycleImage = (imageArray, index) => {
  return imageArray[globalTickIterator % imageArray.length];
};

const imgBase = "https://ik.imagekit.io/poopman/minecraft/";
const imgUpdate = "?updatedAt=1681321062267";
const getImage = (imgName) => {
  return imgBase + imgName + imgUpdate;
}
const blockChars = "█";
var BlockImages = [];
const SMImageSrc = {
  grass: [getImage("grass.png")],
}
var charImages = [];
const superMarioChars = "█";
for (block in superMarioChars) {
  charImages.push(new Image)
}
const replaceCharWithImage = (masterString, shortSubstring = "", wideSubstring = "", offsetRightSubstring) => {
  w.registerHook("renderchar", (charCode, ctx, tileX, tileY, charX, charY, offsetX, offsetY, width, height) => {
    const char = String.fromCharCode(charCode);
    const str = masterString; // this is the main string used for image replacement.
    const wide = wideSubstring; // this is a substring for cases where you want the image to be 2x wide.
    const short = shortSubstring; // this is a substring for cases where you want the image to be 1/2 height.
    const index = str.indexOf(char);
    const charKey = Object.keys(SMImageSrc)[index];

    if (charKey !== undefined) {
      const imageSrc = CycleImage(SMImageSrc[charKey], globalTickIterator);
      charImages[index].src = imageSrc;
      ctx.fillStyle = "transparent";
      ctx.fillRect(offsetX, offsetY, width, height);
      if (wide.includes(char)) {
        offsetX -= width / 2;
        width *= 2;
      }
      if (short.includes(char)) {
        offsetY += height / 4;
        height /= 2;
        width /= 1.3;
        offsetX += width / 6;
      }
      if (offsetRightSubstring.includes(char)) {
        offsetX += width / 2;
      }
      ctx.drawImage(charImages[index], offsetX, offsetY, width, height);
    }
    return false;
  });
};

//replaceCharWithImage(superMarioChars, "", "", "");
