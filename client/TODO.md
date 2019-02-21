
- use async/await
- start from clean repo

- draw dependencies scheme

- also polyfill fetch? check on old browser

- try some static filters
- bitmap font
- that need to be located - should be initit through get?

+ add linter
+ spaceBar control
+ loosing focus and spinning

+ handle assets resolutions
       + initial xhdpi size - no scale for images
       + detect device and load appropriate density

+spin button states
+ loading assets
    + loading atlas
    + assets loading priority
    + texture provider, texture keys dictionary
    + loading texture
    + loading sound
    + finalize loader
    + sound loader integrations
    + assets json

+ loading screen
    + loading precent
    + smooth tween
    + loading bar

+ width, height number to some config, reels, rows, spin speed - also to config
+ emulation to json
+ sounds Interface
    + prepare Sound for integration
    + same file multiple ids (for integration/game)
    + check pause/resume with loop

+ gulp task to copy data into dist
+ emulate several spins;
+ skipping winning animations

+ showing rewards
    + lines on init
    + lines reward
    + symbols toggle animations
    + symbol on several lines
    + symbols animation over callback

+ remove blink listener in symbols
+ listeners remove issue
+ reels with different symbols
+ update reelModel when slot model updated
+ reelS  controller - reelS view (reelsContainer)
+ init server emulation with reels and lines
+ apply init stop positions
+ set final tape position (on simulated server response) - check and refactor
+ reverse tape display (from left to right)
+ manual immediately stop
+ spin button disable state (when spinning without response
+ global slot model - to check current state (idle, spin, stop) (inject)
+ change slot state (TODOS)
+ inject slot model
+ data transfer/injection/organisation
+ server simulation
+ fast spin/stop clicking
+ spinButton two states (Spin/Stop) - case when reels start stopping automatically
+ manual, auto stop (one by one)
+ improve scene ( bottom panel layout, mask, reels back)
+ smooth stop with ease


