//                       grass  dirt   gravel    mud      sand     clay    stone     iron   copper    gold    diamond    lava            
const blocknames =     ["grass", "dirt", "gravel", "mud",     "sand", "clay",   "stone",  "iron",   "copper", "gold", "diamond", "lava",  "unbreakable", "brick"]
const blockCharColors = [32768, 8281926, 11316396, 4271395, 16772002, 13418174, 8289918, 12763344, 13801216, 16766976, 11204863, 16711680,0,13047552];
const blockCharText =    ["«",    "Ò",     "Ö",      "Õ",      "Ö",     "Õ",     "Ñ",      "®",      "²",      "Ô",      "Ô",      "®",        "¬","Ë"];
const blockPrimary = ["#7e5f46", "#7e5f46", "#acacac", "#412d23", "#ffeba2", "#cfb7b7", "#7e7e7e", "#d0cde4", "#d29700", "#acacac", "#acacac", "#fe0001" , "#608dad","#C71700"];
const blockSecondary = ["#008000", "#76573e", "#7e7e7e", "#4f3426", "#e0c978", "#a1846d", "#777373", "#b4b1cd", "#acacac", "#ffd800", "#aaf8ff", "#8a0606", "#c6d7e3","#ffffff"]
const playerchars = ["¤", "¡", "▇", "▉", "ð", "í", "ö", "÷", "ù", "ú", "û", "ý", "þ", "ø", "§", "Ã", "Í", "Ä", "ë", "ò", "¢", "£", "Æ", "Ë", "¾", "¿", "ä", "å", "È", "É"];
const playerColors = ["#ecc983", "#ecc983", "#000", "#000", "#005aff", "#005aff", "#005aff", "#005aff", "#005aff", "#005aff", "#005aff", "#005aff", "#005aff", "#005aff", "#6f6f6f", "#6f6f6f", "#6f6f6f", "#6f6f6f", "#6f6f6f", "#6f6f6f", "#6f6f6f", "#6f6f6f", "#ecc983", "#ecc983", "#ecc983", "#ecc983", "#ecc983", "#ecc983", "#ecc983", "#ecc983", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", ]
api_chat_send("/gridsize 20x20");

const replaceColorWithImage = () => {
  w.registerHook("renderchar", (charCode, ctx, tileX, tileY, charX, charY, offsetX, offsetY, width, height) => {
    if (String.fromCharCode(charCode) == "¨") {
      const color = getCharColor(tileX, tileY, charX, charY);
      const charIndex = blockCharColors.indexOf(color);
      if (charIndex !== -1) {
        const PrimaryColor = blockPrimary[charIndex];
        const SecondaryColor = blockSecondary[charIndex];
        const char = blockCharText[charIndex];
        if (char) {
          ctx.fillStyle = SecondaryColor;
          ctx.fillRect(offsetX, offsetY, width, height);

          ctx.font = `${cellH}px untitled7regular`
          ctx.textBaseline = "top"
          var textYOffset = cellH - (5 * zoom);
          var fontX = tileX * cellW + offsetX;
          var fontY = tileY * cellH + offsetY;
          var XPadding = cellWidthPad * zoom;
          ctx.fillStyle = PrimaryColor
          ctx.fillText(char, offsetX, offsetY);
        }
      }
    } else {
      const char = String.fromCharCode(charCode);
      const charIndex = playerchars.indexOf(char);
      if (charIndex !== -1) {

        //const color = getCharColor(tileX, tileY, charX, charY);
        ctx.fillStyle = "transparent";
        ctx.fillRect(offsetX, offsetY, width, height);
        const color = playerColors[charIndex];
        ctx.fillStyle = color
        ctx.font = `${cellH}px untitled7regular`
        ctx.textBaseline = "middle"
      }
    }
    ctx.textBaseline = "middle"
    return false;
  });
};
replaceColorWithImage();
const CycleImage = (imageArray, index) => {
  return imageArray[globalTickIterator % imageArray.length];
};

const imgBase = "https://ik.imagekit.io/poopman/minecraft/";
const imgUpdate = "?updatedAt=1684871602842";
const getImage = (imgName) => {
  return imgBase + imgName + imgUpdate;
}
const MinecraftImageSource = {
  grass: [getImage("grass.png")],
  mud: [getImage("mud.png")],
  dirt: [getImage("dirt.png")],
  stone: [getImage("stone.png")],
  diamond: [getImage("diamond-ore.png")],
  gravel: [getImage("gravel.png")],
  iron: [getImage("iron-ore.png")],
  clay: [getImage("clay.png")],
  copper: [getImage("copper-ore.png")],
  lava: [getImage("lava-01.png"), getImage("lava-02.png"), getImage("lava-03.png"), getImage("lava-04.png"), getImage("lava-05.png"), getImage("lava-06.png"), getImage("lava-07.png"), getImage("lava-08.png"), getImage("lava-09.png"), getImage("lava-10.png")],
  gold: [getImage("gold-ore.png")],
  sand: [getImage("sand.png")],
  heart: [getImage("heart.png")],
  home: [getImage("home.png")],
  player_head_left: [getImage("player-head-left.png")],
  player_head_right: [getImage("player-head-right.png")],
  player_chest_left: [getImage("player-chest-left.png")],
  player_chest_right: [getImage("player-chest-right.png")],
  player_stand_left: [getImage("player-stand-left.png")],
  player_stand_right: [getImage("player-stand-right.png")],
  player_rightarm_stand_left: [getImage("player-rightarm-stand-left.png")],
  player_leftarm_stand_right: [getImage("player-leftarm-stand-right.png")],
  player_leftleg_walk_right_01: [getImage("player_leftleg_walk_right_01.png")],
  player_rightleg_walk_right_01: [getImage("player_rightleg_walk_right_01.png")],
  player_pants_walk: [getImage("player_pants_walk.png")],
  player_leftleg_walk_left_01: [getImage("player_leftleg_walk_left_01.png")],
  player_rightleg_walk_left_01: [getImage("player_rightleg_walk_left_01.png")],
  player_rightleg_walk_left_02: [getImage("player_rightleg_walk_left_02.png")],
  player_leftleg_walk_right_02: [getImage("player_leftleg_walk_right_02.png")],
  player_pants_walk_left01: [getImage("player_pants_walk_left01.png")],
  player_pants_walk_right01: [getImage("player_pants_walk_right01.png")],
  player_pants_walk_left02: [getImage("player_pants_walk_left02.png")],
  player_pants_walk_right02: [getImage("player_pants_walk_right02.png")],
  player_arm_diag_1: [getImage("player_arm_diag_1.png")],
  player_arm_diag_2: [getImage("player_arm_diag_2.png")],
  player_arm_diag_right: [getImage("player_arm_diag_right.png")],
  player_arm_diag_left: [getImage("player_arm_diag_left.png")],
  player_arm_diagback_right: [getImage("player_arm_diagback_right.png")],
  player_arm_diagback_left: [getImage("player_arm_diagback_left.png")],
  drop: [getImage("drop.png")],
  pick_swing_top_01: [getImage("pick_swing_top_01.png")],
  pick_swing_top_02: [getImage("pick_swing_top_01.png")],
  pick_swing_arm_right_01: [getImage("pick_swing_arm_right_01.png")],
  pick_swing_arm_left_01: [getImage("pick_swing_arm_left_01.png")],
  pick_swing_arm_right_02: [getImage("pick_swing_arm_right_02.png")],
  pick_swing_arm_left_02: [getImage("pick_swing_arm_left_02.png")],

  pick_swing_arm_right_02: [getImage("pick_swing_arm_right_03.png")],
  pick_swing_arm_left_02: [getImage("pick_swing_arm_left_03.png")],
}

w.render()
var radioHTML = ``;
var heartsHTML = ``;
const labelsText = ["grass", "dirt", "stone", "gravel", "mud", "sand", "clay", "iron", "copper", "gold", "diamond", "lava","unbreakable","brick"]
const labelsBG = ["rgb(0,128,0)", "rgb(126,95,70)", "rgb(126,126,126)", "rgb(172,172,172)",
  "rgb(65,45,35)", "rgb(255,235,162)", "rgb(204,190,190)", "rgb(194,192,208)", "rgb(210,151,0)", "rgb(255,216,0)", "rgb(170,248,255)","rgb(255,0,0)", "rgb(10,10,10)"
]
for (i = 0; i < 14; i++) {
  radioHTML += `
    <input type="radio" id="radio${i}" name="radioGroup" class="radio-input block-radio">
    <label for="radio${i}">
      <div class="radio-label">
        <div src="image1.png" class="radio-image" style = "background-color:${labelsBG[i]}"></div>
        <div class="radio-text">${labelsText[i]}</div>
      </div>
    </label>\n
`
}
for (i = 1; i <= 10; i++) {
  heartsHTML += `
<img class="heart" src = ${MinecraftImageSource.heart}>
`
}
const mc_html = `
<div id="mc-healthbar">
${heartsHTML}
</div>
<div id="home-bar">
<input type="button" id="mc-home-btn" name="home" class="" onclick= "">
<label id="home-label"for="mc-home-btn">
<div class="block-num" id="h-text" style = "position: static;">MINECRAFT WORLD BUILDER</div>
</label>
</div>
<div id="mc-toolbar">
${radioHTML}
   
</div>`;
const mc_css = `
#home-bar{
    position: fixed;
height:100px;
width:100%;
    background-color: #000000d1;
    display: flex;
    justify-content: center;
    font-family: monospace;
    top:0px;
}
#home-label{
    position: fixed;
    top: 12px;
    left: 50px;
    height: 50px;
    width: 50px;
    z-index: 1;
    cursor: pointer;
font-family: monospace;
    color: white;
}

#mc-healthbar{
    position: fixed;
    height: 50px;
    width: 100%;
    bottom: 100px;
    left: 0px;
    background-color: #000000d1;
    display: flex;
    justify-content: center;
    font-family: monospace;
}
#mc-toolbar{
    position: fixed;
    height: 100px;
    width: 100%;
    bottom: 0px;
    left: 0px;
    background-color: #000000d1;
    display: flex;
    justify-content: center;
    font-family: monospace;
}


.radio-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  cursor: pointer;
}

.radio-input:checked + label .radio-image {
   border: 2px solid white; /* Default outline color */
}
.radio-image {
  width: 50px;
  height: 50px;
    border: 2px solid black; /* Default outline color */
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: column;

}

.radio-text {
  color: white;
  margin-top: 5px;
}
.radio-input {
  display: none;
}
.block-num {
    text-align: center;
    position: absolute;
    top: 25px;
    font-weight: 900;

    text-shadow: 0 0 4px white;
}
@font-face {
    font-family: 'untitled7regular';
    src: url('https://cdn.jsdelivr.net/gh/poopman-owot/ourworldofminecraft@alpha-0.09/minecraft2-webfont.woff2') format('woff2'),
         url('https://cdn.jsdelivr.net/gh/poopman-owot/ourworldofminecraft@alpha-0.09/minecraft2-webfont.woff') format('woff');
    font-weight: normal;
    font-style: monospace;

}
`;

const head = document.head || document.getElementsByTagName('head')[0];
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(mc_css));
head.appendChild(style);
document.querySelector('body').insertAdjacentHTML('beforeend', mc_html);
w.doAnnounce("this is an alpha version. expect issues");
var control = false;
owot.addEventListener('mousemove', (event) => {
  if (event.ctrlKey) {
    event_mouseup(event);
    const blockname = getBlockUI();
    const index = blocknames.indexOf(blockname)
    if (index !== -1) {
      const color = blockCharColors[index];
      writeChar("¨", true, color, true)
    }
else{console.log("unknown")}
  }
  else if (event.altKey) {
    event_mouseup(event);
      writeChar(" ", true, 16777215, true)
    
  }

});

function getBlockUI() {
  const selectedRadio = document.querySelector('.block-radio:checked + label div div + div');

  if (selectedRadio) {
    return selectedRadio.innerText

  }
  return null
}
