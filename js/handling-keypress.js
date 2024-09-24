const buttons = [{
    id: 'panelBtnLeft',
    key: 'LEFT'
},
{
    id: 'panelBtnRight',
    key: 'RIGHT'
},
{
    id: 'panelBtnJump',
    key: 'W'
},
{
    id: 'panelBtnThrow',
    key: 'SPACE'
}];

/**
 * Sets the corresponding key in the keyboard object to true when a key is pressed down.
 * 
 * @param {KeyboardEvent} event - The event object representing the keydown event.
 */
window.addEventListener('keydown', (event) => {
    if (event.keyCode === 37) {
        keyboard.LEFT = true;
    } else if (event.keyCode === 38) {
        keyboard.UP = true;
    } else if (event.keyCode === 40) {
        keyboard.DOWN = true;
    } else if (event.keyCode === 39) {
        keyboard.RIGHT = true;
    } else if (event.keyCode === 32) {
        keyboard.SPACE = true;
    } else if (event.keyCode === 13) {
        keyboard.ENTER = true;
    } else if (event.keyCode === 27) {
        keyboard.ESC = true;
    } else if (event.keyCode === 80) {
        keyboard.BREAK = true;
    } else if (event.keyCode === 87) {
        keyboard.W = true;
    } else if (event.keyCode === 65) {
        keyboard.A = true;
    } else if (event.keyCode === 68) {
        keyboard.D = true;
    }
});

/**
 * Sets the corresponding key in the keyboard object to false when a key is released.
 * 
 * @param {KeyboardEvent} event - The event object representing the keyup event.
 */
window.addEventListener('keyup', (event) => {
    if (event.keyCode === 37) {
        keyboard.LEFT = false;
    } else if (event.keyCode === 38) {
        keyboard.UP = false;
    } else if (event.keyCode === 40) {
        keyboard.DOWN = false;
    } else if (event.keyCode === 39) {
        keyboard.RIGHT = false;
    } else if (event.keyCode === 32) {
        keyboard.SPACE = false;
    } else if (event.keyCode === 13) {
        keyboard.ENTER = false;
    } else if (event.keyCode === 27) {
        keyboard.ESC = false;
    } else if (event.keyCode === 80) {
        keyboard.BREAK = false;
    } else if (event.keyCode === 87) {
        keyboard.W = false;
    } else if (event.keyCode === 65) {
        keyboard.A = false;
    } else if (event.keyCode === 68) {
        keyboard.D = false;
    }
});

/**
 * This function includes the different panel controls for the mobile version.
 */
function mobilePanelPressEvents() {
    buttons.forEach(button => {
        const element = document.getElementById(button.id);
        element.addEventListener('touchstart', (event) => handleTouch(event, button.key, true));
        element.addEventListener('touchend', (event) => handleTouch(event, button.key, false));
    });
}