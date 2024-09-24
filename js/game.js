let animationIntervals = [];
let endbossBattleStatus = false;
let canvas;
let world;
let keyboard = new Keyboard();
let fullscreen = false;
let sound = false;
let exit = false;
let gameOver = false;
let wonGame = false;
let breakGame = false;
let rememberBreakStatus = false;
let rememberSoundStatus = false;
let pepeIsDead = false;
let gameplay_sound = new Audio('assets/audio/gameplay.mp4');
let endboss_sound = new Audio('assets/audio/endboss.mp3');

/**
 * This function checks the orientation of the window and displays a warning if the orientation is portrait.
 * 
 */
function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        document.getElementById('orientationWarning').style.display = 'flex';
    } else {
        document.getElementById('orientationWarning').style.display = 'none';
    }
}

/**
 * This is a function to include outsourced html elements
 * 
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute("include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            let html = await resp.text();
            element.innerHTML = html;
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * This function initiate the objects for generate and implement the canvas elements of the game.
 * 
 */
function initGame() {
    hideStartScreen();
    document.getElementById('switchSoundIcon').src = './assets/img/11_menu/sound-off.png';
    document.getElementById('menuIconActivateBreak').style.display = 'flex';
    document.getElementById('switchPlayIcon').src = './assets/img/11_menu/break.png';
    playGameSound();
    canvas = document.getElementById('canvas');
    createLevel();
    world = new World(canvas, keyboard);
    mobilePanelPressEvents();
    world.startGame();
}

/**
 * Displays the story popup frame.
 */
function readStory() {
    let popupFrame = document.getElementById('popupFrameStory');
    popupFrame.style.display = "flex";
}

/**
 * This function prevents the browser's default behavior for this event and sets the corresponding key state.
 *
 * @param {Event} event - The event object representing the touch event.
 * @param {string} key - The key to be set in the keyboard object.
 * @param {boolean} state - The state to set the key to (true for touchstart, false for touchend).
 */
function handleTouch(event, key, state) {
    event.preventDefault();
    keyboard[key] = state;
}

/**
 * This function includes the different menu functions in the game.
 * 
 * @param {String} e - The element which should initiate the corresponding function.
 */
function clickMenuIcon(e) {
    if (e === 'fullscreen') {
        clickFullscreenIcon();
    } else if (e === 'keyboard') {
        clickKeyboardIcon();
    } else if (e === 'break') {
        clickBreakIcon();
    } else if (e === 'sound') {
        clickSoundIcon();
    } else if (e === 'exit') {
        clickExitIcon();
    }
}

/**
 * This function switch the screen to fullscreen or default
 * 
 */
function clickFullscreenIcon() {
    if (!fullscreen) {
        fullscreen = true;
        initFullscreen();
    } else {
        fullscreen = false;
        exitFullscreen();
    }
}

/**
 * This function switch the screen to fullscreen
 * 
 */
function initFullscreen() {
    let screen = document.getElementById('fullscreenMode');
    if (screen.requestFullscreen) {
        screen.requestFullscreen();
    } else if (screen.msRequestFullscreen) {
        screen.msRequestFullscreen();
    } else if (screen.webkitRequestFullscreen) {
        screen.webkitRequestFullscreen();
    }
}

/**
 * This function switch the screen to default screen
 * 
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * This function opens the popup to show the keyboard controls
 * 
 */
function clickKeyboardIcon() {
    let popupFrame = document.getElementById('popupFrame');
    popupFrame.style.display = "flex";
}

/**
 * This function prevents the unwanted closing of the popup by clicked on the content 
 * 
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * This function closes the popup with the keyboard controls
 * 
 */
function closePopup() {
    document.getElementById('popupFrame').style.display = 'none';
    document.getElementById('popupFrameStory').style.display = 'none';
}

/**
 * Toggles the game between paused and playing states and changes the icon accordingly.
 */
function clickBreakIcon() {
    let icon = document.getElementById('switchPlayIcon');
    if (!breakGame) {
        noBreakSettings(icon);
    } else {
        breakSettings(icon);
    }
}

/**
 * Sets the game to a paused state, disables sound, and changes the play icon.
 * 
 * @param {HTMLElement} icon - The icon element to update based on the game state.
 */
function noBreakSettings(icon) {
    breakGame = true;
    if(sound) {
        rememberSoundStatus = true;
        sound = false;
        initSoundGameIcon();
        playGameSound();
    }
    world.toggleAnimations();
    icon.src = './assets/img/11_menu/play.png';
}

/**
 * Sets the game to a playing state, enables sound, and changes the break icon.
 * 
 * @param {HTMLElement} icon - The icon element to update based on the game state.
 */
function breakSettings(icon) {
    breakGame = false;
    if(rememberSoundStatus) {
        sound = true;
        rememberSoundStatus = false;
    } else {
        sound = false;
    }
    initSoundGameIcon();
    playGameSound();
    world.toggleAnimations();
    icon.src = './assets/img/11_menu/break.png';
}

/**
 * This function turns the game sound off or on and changes the icon
 * 
 */
function clickSoundIcon() {
    let icon = document.getElementById('switchSoundIcon');
    if (!sound && !breakGame) {
        sound = true;
        icon.src = './assets/img/11_menu/sound-on.png';
    }
    else {
        sound = false;
        icon.src = './assets/img/11_menu/sound-off.png';
    }
    playGameSound();
}

/**
 * Plays or pauses the game sound based on the sound state.
 */
function playGameSound() {
    if (sound && !gameOver && !wonGame) {
        if (endbossBattleStatus) {
            endboss_sound.play();
            gameplay_sound.pause();
        } else {
            gameplay_sound.play();
            document.getElementById('switchSoundIcon').src = './assets/img/11_menu/sound-on.png';
        }
    } else {
        gameplay_sound.pause();
        endboss_sound.pause();
    }
}

/**
 * This function ends the game
 * 
 */
function clickExitIcon() {
    if (!exit) {
        exit = true;
        document.getElementById('footerLinks').style.display = 'flex';
        exitGame();
    }
}

/**
 * Exits the game, pauses animations, and hides the play screen.
 */
function exitGame() {
    setBreakStatus();
    breakGame = true;
    world.toggleAnimations();
    hidePlayScreen();
    document.getElementById('playBtnMenu').style.display = 'none';
    updateMenuButtons();
    initSoundMenuBtn();
}

/**
 * Sets the break status based on the current game state.
 */
function setBreakStatus() {
    if (!breakGame) {
        rememberBreakStatus = false;
    } else {
        rememberBreakStatus = true;
    }
}

/**
 * Continues the game from a paused state and restores the previous state.
 */
function continuePlay() {
    if (exit) {
        checkRememberBreakStatus();
        document.getElementById('continuePlayBtnMenu').style.display = 'none';
        document.getElementById('playBtnMenu').style.display = 'flex';
        hideStartScreen();
        world.toggleAnimations();
        initSoundGameIcon();
        exit = false;
    }
}

/**
 * Restores the previous break status of the game.
 */
function checkRememberBreakStatus() {
    if (rememberBreakStatus) {
        breakGame = true;
    } else {
        breakGame = false;
    }
}

/**
 * Restarts the game.
 */
function restartGame() {
    stopCurrentSounds();
    resetGameVariables();
    // resetGameObjects();
    initGame();
}

/**
 * Stop current sounds.
 */
function stopCurrentSounds() {
    world.won_sound.pause();
    world.loose_sound.pause();
}

/**
 * Resets the game variables to their initial values.
 */
function resetGameVariables() {
    animationIntervals.forEach(interval => clearInterval(interval));
    animationIntervals = [];
    endbossBattleStatus = false;
    exit = false;
    gameOver = false;
    wonGame = false;
    breakGame = false;
    rememberBreakStatus = false;
    pepeIsDead = false;

    world.endboss.endbossBattleStatus = false;
    world.endboss.energy = 100;
    world.endboss.isResting = false;
}

/**
 * Resets the game objects to their initial states.
 */
function resetGameObjects() {
    gameplay_sound.pause();
    gameplay_sound.currentTime = 0;
    endboss_sound.pause();
    endboss_sound.currentTime = 0;
}

/**
 * Opens the footer link popup with the selected content.
 * 
 * @param {string} element - The element to load in the popup.
 */
async function openFooterLink(element) {
    let contentDiv = document.getElementById('contentFooterLinks');
    openPopup(contentDiv);

    if (element.includes('privacy-policy')) {
        contentDiv.innerHTML = `        
            <div class="content-footer-text d_c_fs_fs" include-html="../assets/templates/privacy-police.html" ></div>
            `;
    } else if (element.includes('imprint')) {
        contentDiv.innerHTML = `        
            <div class="content-footer-text d_c_fs_fs" include-html="../assets/templates/imprint.html" ></div>
            `;
    } else if (element.includes('game-menu')) {
        contentDiv.style.display = 'none';
        document.getElementById('menuScreen').style.display = 'flex';
        initMenuBtns();
    }
    await includeHTML();
}

/**
 * Opens a popup by displaying the content division and hiding the menu screen.
 * 
 * @param {HTMLElement} contentDiv - The content division to display.
 */
function openPopup(contentDiv) {
    contentDiv.style.display = 'flex';
    contentDiv.innerHTML = ``;
    document.getElementById('menuScreen').style.display = 'none';
}