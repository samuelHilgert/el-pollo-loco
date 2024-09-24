/**
 * Initializes the menu buttons based on the game state.
 */
function initMenuBtns() {
    if (breakGame == true) {
        document.getElementById('playBtnMenu').style.display = 'none';
        document.getElementById('continuePlayBtnMenu').style.display = 'flex';
        document.getElementById('restartBtnMenu').style.display = 'flex';
    } else {
        document.getElementById('playBtnMenu').style.display = 'flex';
        document.getElementById('continuePlayBtnMenu').style.display = 'none';
    }
}

/**
 * Hides the start screen and displays the game canvas and menu buttons.
 */
function hideStartScreen() {
    document.getElementById('menuScreen').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('gameMenuButtons').style.display = 'flex';
    document.getElementById('footerLinks').style.display = 'none';
}

/**
 * Hides the play screen and displays the start menu.
 */
function hidePlayScreen() {
    document.getElementById('menuScreen').style.display = 'flex';
    document.getElementById('restartBtnMenu').style.display = 'flex';
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('gameMenuButtons').style.display = 'none';
}

/**
 * Toggles the game sound state via the sound menu button.
 */
function clickSoundBtn() {
    let soundBtn = document.getElementById('soundMenuSetting');
    if (sound) {
        soundBtn.innerHTML = 'Sound Off';
        sound = false;
    }
    else {
        soundBtn.innerHTML = 'Sound On';
        sound = true;
    }
    playGameSound();
}

/**
 * Initializes the sound icon based on the sound state.
 */
function initSoundGameIcon() {
    let icon = document.getElementById('switchSoundIcon');
    if (sound) {
        icon.src = './assets/img/11_menu/sound-on.png';
    } else {
        icon.src = './assets/img/11_menu/sound-off.png';
    }
}


/**
 * Updates the visibility of the menu buttons based on the game state.
 */
function updateMenuButtons() {
    if (!pepeIsDead) {
        document.getElementById('continuePlayBtnMenu').style.display = 'flex';
    }
    if (wonGame || gameOver) {
        document.getElementById('continuePlayBtnMenu').style.display = 'none';
        document.getElementById('soundMenuSetting').style.display = 'none';
    }
}

/**
 * Initializes the sound menu button text based on the sound state.
 */
function initSoundMenuBtn() {
    let soundBtn = document.getElementById('soundMenuSetting');
    if (sound) {
        soundBtn.innerHTML = 'Sound On';
    }
    else {
        soundBtn.innerHTML = 'Sound Off';
    }
}