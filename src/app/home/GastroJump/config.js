const CONFIG = {
    DEFAULT_WIDTH: 393,
    DEFAULT_HEIGHT: 851,
    DEFAULT_GRAVITY: 300,

    // Set control type
    // 0: keybaord arrows (desktop)
    // 1: gyroscope (phone)
    // 2: touch/mouse (desktop and phone)
    // 3: advanced gyroscope (phone)

    DEFAULT_CONTROL_TYPE: 3,
    KEYBOARD_CONTROL_TYPE : 0,
    TOUCH_CONTROL_TYPE: 2,
    GYROSCOPE_CONTROL_TYPE: 3,

    DEFAULT_BACKGROUNDMUSIC: false,
    DEFAULT_SOUNDEFFECTS: false,

    SOLID_PLATFORM_TYPE: 0,
    MOVING_PLATFORM_TYPE: 1,
    DROPPING_PLATFORM_TYPE: 2,
    PLATFORM_IMG_TYPES: ["solidPlatform", "movingPlatform", "droppingPlatform"],
    STAGE_0_START: 0,
    STAGE_1_START: 10000,
    STAGE_2_START: 20000,
    STAGE_3_START: 30000,
    STAGE_4_START: 40000,

    // Spawnrates are expressed in X/100 
    // e.g. 30 would mean 30/100, which is 30%
    // spawnrates are given in arrays, each array position relates to a specific stage
    POWER_UP_BURGER_SPAWNRATE: [20, 20, 20, 30, 30],
    ENEMY_BELLPEPPER_SPAWNRATE: [0, 5, 5, 5, 10],
    COLLECTIBLE_1DOLLAR_SPAWNRATE: [5, 10, 10, 10, 15],
    PLATFORM_MOVING_SPAWNRATE: [5, 5, 10, 15, 20],
    PLATFORM_DROPPING_SPAWNRATE: [5, 5, 10, 15, 20]







}

export default CONFIG