class MenuManager {
    constructor() {
        this.exit = false;
        this.breakGame = false;
        this.rememberBreakStatus = false;
        this.rememberSoundStatus = false;
        this.pepeIsDead = false;
    }

    toggleBreak(icon, soundManager, world) {
        if (!this.breakGame) {
            this.noBreakSettings(icon, soundManager, world);
        } else {
            this.breakSettings(icon, soundManager, world);
        }
    }

    noBreakSettings(icon, soundManager, world) {
        this.breakGame = true;
        if (soundManager.sound) {
            this.rememberSoundStatus = true;
            soundManager.sound = false;
            soundManager.playGameSound();
        }
        world.toggleAnimations();
        icon.src = './assets/img/11_menu/play.png';
    }

    breakSettings(icon, soundManager, world) {
        this.breakGame = false;
        if (this.rememberSoundStatus) {
            soundManager.sound = true;
            this.rememberSoundStatus = false;
        } else {
            soundManager.sound = false;
        }
        soundManager.playGameSound();
        world.toggleAnimations();
        icon.src = './assets/img/11_menu/break.png';
    }

    exitGame(world) {
        this.setBreakStatus();
        this.breakGame = true;
        world.toggleAnimations();
        this.hidePlayScreen();
        document.getElementById('playBtnMenu').style.display = 'none';
        this.updateMenuButtons();
        this.initSoundMenuBtn();
    }

    setBreakStatus() {
        if (!this.breakGame) {
            this.rememberBreakStatus = false;
        } else {
            this.rememberBreakStatus = true;
        }
    }

    hidePlayScreen() {
        document.getElementById('menuScreen').style.display = 'flex';
        document.getElementById('restartBtnMenu').style.display = 'flex';
        document.getElementById('canvas').style.display = 'none';
        document.getElementById('gameMenuButtons').style.display = 'none';
    }

    updateMenuButtons() {
        if (!this.pepeIsDead) {
            document.getElementById('continuePlayBtnMenu').style.display = 'flex';
        }
        if (wonGame || gameOver) {
            document.getElementById('continuePlayBtnMenu').style.display = 'none';
            document.getElementById('soundMenuSetting').style.display = 'none';
        }
    }

    initSoundMenuBtn() {
        let soundBtn = document.getElementById('soundMenuSetting');
        if (sound) {
            soundBtn.innerHTML = 'Sound On';
        } else {
            soundBtn.innerHTML = 'Sound Off';
        }
    }
}
