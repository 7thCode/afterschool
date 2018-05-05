/// <reference path="../../node_modules/@types/lodash/index.d.ts" />
/// <reference path="../../node_modules/@types/pixi.js/index.d.ts" />
/// <reference path="../../node_modules/@types/howler/index.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// マージしてみる
var Game;
(function (Game) {
    var Location = /** @class */ (function () {
        function Location() {
            this.x = 0;
            this.y = 0;
        }
        Location.to_pix = function (block) {
            return block * planck_length;
        };
        Location.equal = function (location1, location2) {
            var result = false;
            if (location1.x === location2.x) {
                result = (location1.y === location2.y);
            }
            return result;
        };
        Location.offset = function (location, offset) {
            return { x: location.x - offset.x, y: location.y - offset.y };
        };
        Location.left = function (location) {
            return Location.offset(location, { x: 1, y: 0 });
        };
        Location.right = function (location) {
            return Location.offset(location, { x: -1, y: 0 });
        };
        Location.up = function (location) {
            return Location.offset(location, { x: 0, y: 1 });
        };
        Location.down = function (location) {
            return Location.offset(location, { x: 0, y: -1 });
        };
        return Location;
    }());
    var SpriteBuilder = /** @class */ (function () {
        function SpriteBuilder() {
        }
        SpriteBuilder.create_rect = function (attribute) {
            var result = new PIXI.Graphics();
            result.beginFill(0x000000, 1);
            result.drawRect(Location.to_pix(attribute.x), Location.to_pix(attribute.y), Location.to_pix(1), Location.to_pix(1)); // x,y,width,height
            return result;
        };
        SpriteBuilder.create_sprite = function (texture_name, attribute) {
            var Texture = PIXI.utils.TextureCache[texture_name];
            var result = new PIXI.Sprite(Texture);
            if (attribute) {
                result.x = Location.to_pix(attribute.x);
                result.y = Location.to_pix(attribute.y);
            }
            return result;
        };
        SpriteBuilder.create_animation_sprite = function (images, attribute) {
            var textures = [];
            images.forEach(function (image) {
                textures.push(PIXI.Texture.fromFrame(image));
            });
            var result = new PIXI.extras.AnimatedSprite(textures);
            if (attribute) {
                result.x = Location.to_pix(attribute.x);
                result.y = Location.to_pix(attribute.y);
            }
            return result;
        };
        return SpriteBuilder;
    }());
    var Ease = /** @class */ (function () {
        function Ease(min, max, particles) {
            this.min = min;
            this.max = max;
            this.particle_size = (max - min) / particles;
        }
        Ease.prototype.linear = function (x) {
            return x * this.particle_size;
        };
        // todo:
        Ease.prototype.in = function (x) {
            return x * this.particle_size;
        };
        Ease.prototype.out = function (x) {
            return x * this.particle_size;
        };
        Ease.prototype.inout = function (x) {
            return x * this.particle_size;
        };
        return Ease;
    }());
    var Sound = /** @class */ (function () {
        function Sound(config) {
            this.sound = null;
            this._on = true;
            this.sound = new Howl(config);
        }
        Object.defineProperty(Sound.prototype, "is_on", {
            get: function () {
                return this._on;
            },
            enumerable: true,
            configurable: true
        });
        Sound.prototype.on = function () {
            this._on = true;
        };
        Sound.prototype.off = function () {
            this._on = false;
        };
        Sound.prototype.play = function (no) {
            if (this._on) {
                this.sound.play("walk");
            }
        };
        return Sound;
    }());
    var Actor = /** @class */ (function () {
        function Actor(base, location) {
            this._base = null;
            this._sprite = null;
            this._location = null;
            this.moment = 0;
            this.vx = 0;
            this.vy = 0;
            this._base = base;
            this._location = location;
        }
        Object.defineProperty(Actor.prototype, "sprite", {
            get: function () {
                return this._sprite;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Actor.prototype, "location", {
            get: function () {
                return this._location;
            },
            set: function (location) {
                this._location = location;
                this._sprite.x = Location.to_pix(this._location.x);
                this._sprite.y = Location.to_pix(this._location.y);
            },
            enumerable: true,
            configurable: true
        });
        Actor.prototype.move = function (reconnaissance, vx, vy) {
            var trrain = this._base.trrain(reconnaissance);
            if (this.moment < 0) {
                var moved = false;
                switch (trrain) {
                    case 0:
                        this.animate(this._base.game.moment);
                        this.vx = vx;
                        this.vy = vy;
                        this._location = reconnaissance;
                        moved = true;
                        break;
                    //         case 1: // world's end.
                    //         case 2: // impermeable wall.
                    //         case 3: // transparent wall.
                    //             break;
                }
            }
        };
        Actor.prototype.move_left = function () {
            this.move(Location.left(this.location), -4, 0);
        };
        Actor.prototype.move_up = function () {
            this.move(Location.up(this.location), 0, -4);
        };
        Actor.prototype.move_right = function () {
            this.move(Location.right(this.location), 4, 0);
        };
        Actor.prototype.move_down = function () {
            this.move(Location.down(this.location), 0, 4);
        };
        Actor.prototype.animate = function (time) {
            this.moment = time;
        };
        Actor.prototype.heartbeat = function () {
        };
        return Actor;
    }());
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player(base, face, location, sound) {
            var _this = _super.call(this, base, location) || this;
            _this.sound = null;
            _this._live = true;
            _this._sprite = SpriteBuilder.create_sprite(face, {
                x: _this._location.x,
                y: _this._location.y
            });
            _this.sound = sound;
            return _this;
        }
        Object.defineProperty(Player.prototype, "live", {
            get: function () {
                return this._live;
            },
            set: function (live) {
                this._live = live;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.heartbeat = function () {
            this.moment--;
            if (this.moment >= 0) {
                this.sprite.x += this.vx;
                this.sprite.y += this.vy;
                if (this.moment === 0) {
                    this.move_end();
                }
            }
        };
        Player.prototype.move_end = function () {
            if (this.sound) {
                this.sound.play(0);
            }
            this._base.illuminate(this);
            this._base.move_end();
        };
        Player.prototype.move_left = function () {
            _super.prototype.move_left.call(this);
        };
        Player.prototype.move_up = function () {
            _super.prototype.move_up.call(this);
        };
        Player.prototype.move_right = function () {
            _super.prototype.move_right.call(this);
        };
        Player.prototype.move_down = function () {
            _super.prototype.move_down.call(this);
        };
        return Player;
    }(Actor));
    var Creature = /** @class */ (function (_super) {
        __extends(Creature, _super);
        function Creature(base, face, location, type) {
            var _this = _super.call(this, base, location) || this;
            _this.type = 0;
            _this._live = true;
            _this._sprite = SpriteBuilder.create_animation_sprite(face, {
                x: _this._location.x,
                y: _this._location.y
            });
            _this._sprite.animationSpeed = 0.05;
            _this._sprite.play();
            _this.type = type;
            return _this;
        }
        Object.defineProperty(Creature.prototype, "live", {
            get: function () {
                return this._live;
            },
            set: function (live) {
                this._live = live;
                if (!this._live) {
                    this._sprite.visible = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        Creature.prototype.randomwalk = function () {
            if (this.live) {
                var direction = Math.floor(Math.random() * 4);
                switch (direction) {
                    case 0:
                        this.move_left();
                        break;
                    case 1:
                        this.move_up();
                        break;
                    case 2:
                        this.move_right();
                        break;
                    case 3:
                        this.move_down();
                        break;
                }
            }
        };
        Creature.prototype.heartbeat = function () {
            this.moment--;
            if (this.moment >= 0) {
                this.sprite.x += this.vx;
                this.sprite.y += this.vy;
                if (this.moment === 0) {
                    this.move_end();
                }
            }
        };
        Creature.prototype.move_end = function () {
            this._base.others_move_end(this);
        };
        return Creature;
    }(Actor));
    var Props = /** @class */ (function () {
        function Props(location) {
            this._sprite = null;
            this._location = null;
            this.lifespan = 0;
            this._location = location;
            this._sprite = new PIXI.Container();
            this._sprite.visible = false;
            this._sprite.x = location.x;
            this._sprite.y = location.y;
        }
        Object.defineProperty(Props.prototype, "sprite", {
            get: function () {
                return this._sprite;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Props.prototype, "location", {
            get: function () {
                return this._location;
            },
            enumerable: true,
            configurable: true
        });
        Props.prototype.heartbeat = function () {
        };
        return Props;
    }());
    var Messages = /** @class */ (function () {
        function Messages(location, size) {
            this._size = null;
            this._sprite = null;
            this.lifespan = 0;
            this.ease = null;
            this._size = size;
            this._sprite = new PIXI.Text("");
            this._sprite.x = location.x;
            this._sprite.y = location.y;
        }
        Object.defineProperty(Messages.prototype, "sprite", {
            get: function () {
                return this._sprite;
            },
            enumerable: true,
            configurable: true
        });
        Messages.prototype.show = function (message, style, time, callback) {
            var _style = new PIXI.TextStyle(style);
            this._sprite.style = _style;
            this._sprite.text = message;
            this.lifespan = time;
            this.ease = new Ease(0, 1, time);
            this._sprite.visible = true;
            this.callback = callback;
        };
        Messages.prototype.heartbeat = function () {
            if (this._sprite.visible) {
                if (this.lifespan > 0) {
                    this._sprite.alpha = this.ease.linear(this.lifespan);
                    this.lifespan--;
                }
                else {
                    this._sprite.visible = false;
                    if (this.lifespan === 0) {
                        this.on_close();
                    }
                }
            }
        };
        Messages.prototype.on_close = function () {
            if (this.callback) {
                this.callback();
            }
        };
        return Messages;
    }());
    var Dialogs = /** @class */ (function (_super) {
        __extends(Dialogs, _super);
        function Dialogs(location, size) {
            var _this = _super.call(this, location) || this;
            _this._size = null;
            _this.message = null;
            _this.background = null;
            _this._size = size;
            _this.background = new PIXI.Graphics();
            _this.background.beginFill(0xffffff, 0.4);
            _this.background.drawRect(0, 0, _this._size.w, _this._size.h); // x,y,width,height
            _this._sprite.addChild(_this.background);
            _this.message = new Messages({ x: 10, y: 10 }, size);
            _this._sprite.addChild(_this.message.sprite);
            return _this;
        }
        Dialogs.prototype.show = function (message, time, callback) {
            var style = {
                fontFamily: "Arial",
                fontSize: 36,
                fontStyle: "italic",
                fontWeight: "bold",
                fill: ["#a5fffd", "#332bff"],
                stroke: "#501b1e",
                strokeThickness: 2,
                dropShadow: true,
                dropShadowColor: "#bfbeff",
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 300
            };
            this.message.show(message, style, time, null);
            this.lifespan = time;
            this._sprite.visible = true;
            this.callback = callback;
        };
        Dialogs.prototype.heartbeat = function () {
            if (this._sprite.visible) {
                if (this.lifespan > 0) {
                    this.lifespan--;
                }
                else {
                    this._sprite.visible = false;
                    if (this.lifespan === 0) {
                        this.on_close();
                    }
                }
            }
        };
        Dialogs.prototype.on_close = function () {
            if (this.callback) {
                this.callback();
            }
        };
        return Dialogs;
    }(Props));
    var Buttons = /** @class */ (function () {
        function Buttons(location, size, image_name, callback) {
            this._size = null;
            this._sprite = null;
            this._size = size;
            var textureButton = PIXI.Texture.fromImage(image_name);
            this._sprite = new PIXI.Sprite(textureButton);
            this._sprite.x = location.x;
            this._sprite.y = location.y;
            this._sprite.interactive = true;
            this._sprite.buttonMode = true;
            this._sprite.on("pointerdown", callback);
        }
        Object.defineProperty(Buttons.prototype, "sprite", {
            get: function () {
                return this._sprite;
            },
            enumerable: true,
            configurable: true
        });
        return Buttons;
    }());
    var ControlPanel = /** @class */ (function (_super) {
        __extends(ControlPanel, _super);
        function ControlPanel(dod, location, size) {
            var _this = _super.call(this, location) || this;
            _this._size = null;
            _this.background = null;
            _this.left_button = null;
            _this.right_button = null;
            _this.up_button = null;
            _this.down_button = null;
            _this.end_button = null;
            _this.stop_button = null;
            _this.dod = dod;
            _this._size = size;
            _this.background = new PIXI.Graphics();
            _this.background.beginFill(0xff8f8f, 1);
            _this.background.drawRect(0, 0, _this._size.w, _this._size.h); // x,y,width,height
            _this._sprite.addChild(_this.background);
            var turn_end = function () {
                if (!_this.dod.progress) {
                    _this.dod.turn_end();
                }
            };
            var move_left = function () {
                if (!_this.dod.progress) {
                    _this.dod.explorer.move_left();
                }
            };
            var move_right = function () {
                if (!_this.dod.progress) {
                    _this.dod.explorer.move_right();
                }
            };
            var move_up = function () {
                if (!_this.dod.progress) {
                    _this.dod.explorer.move_up();
                }
            };
            var move_down = function () {
                if (!_this.dod.progress) {
                    _this.dod.explorer.move_down();
                }
            };
            var stop = function () {
                _this.dod.setlevel(1);
            };
            _this.stop_button = new Buttons({ x: 60, y: 20 }, { w: 100, h: 50 }, "img/end.png", stop);
            _this._sprite.addChild(_this.stop_button.sprite);
            _this.end_button = new Buttons({ x: 60, y: 70 }, { w: 100, h: 50 }, "img/end.png", turn_end);
            _this._sprite.addChild(_this.end_button.sprite);
            _this.left_button = new Buttons({ x: 10, y: 170 }, { w: 100, h: 50 }, "img/left.png", move_left);
            _this._sprite.addChild(_this.left_button.sprite);
            _this.right_button = new Buttons({ x: 110, y: 170 }, { w: 100, h: 50 }, "img/right.png", move_right);
            _this._sprite.addChild(_this.right_button.sprite);
            _this.up_button = new Buttons({ x: 60, y: 120 }, { w: 100, h: 50 }, "img/up.png", move_up);
            _this._sprite.addChild(_this.up_button.sprite);
            _this.down_button = new Buttons({ x: 60, y: 220 }, { w: 100, h: 50 }, "img/down.png", move_down);
            _this._sprite.addChild(_this.down_button.sprite);
            _this._sprite.visible = true;
            return _this;
        }
        ControlPanel.prototype.show = function () {
        };
        ControlPanel.prototype.heartbeat = function () {
        };
        ControlPanel.prototype.on_close = function () {
        };
        return ControlPanel;
    }(Props));
    var DisplayPanel = /** @class */ (function (_super) {
        __extends(DisplayPanel, _super);
        function DisplayPanel(dod, location, size) {
            var _this = _super.call(this, location) || this;
            _this._size = null;
            _this.background = null;
            _this.dod = dod;
            _this._size = size;
            _this.background = new PIXI.Graphics();
            _this.background.beginFill(0x8f8fff, 1);
            _this.background.drawRect(0, 0, _this._size.w, _this._size.h); // x,y,width,height
            _this._sprite.addChild(_this.background);
            _this._sprite.visible = true;
            return _this;
        }
        DisplayPanel.prototype.show = function () {
        };
        DisplayPanel.prototype.heartbeat = function () {
        };
        DisplayPanel.prototype.on_close = function () {
        };
        return DisplayPanel;
    }(Props));
    var GameBase = /** @class */ (function () {
        function GameBase(game, stages) {
            var _this = this;
            this.app = null;
            this.game = null;
            this.stage = null;
            this.main_view = null;
            this.mask = [];
            this.shadow_mask = [
                [
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
                ],
                [
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[1, 1, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 1, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
                ],
                [
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[1, 0, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[1, 1, 0, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
                ],
                [
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
                ],
                [
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 0, 1, 1]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 0, 1]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
                ],
                [
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 1, 1]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
                ],
                [
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
                    [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
                ]
            ];
            this.turn_count = 0;
            this.explorer = null;
            this.trrain_plain = null;
            this.creature_list = [];
            this.dialog = null;
            this.message = null;
            this._progress = false;
            this.app = new PIXI.Application({
                width: (game.field_size.w * planck_length) + (game.field_location.x * 2),
                height: (game.field_size.h * planck_length) + (game.field_location.y * 2),
                antialias: true,
                backgroundColor: 0x808080,
                transparent: false,
                resolution: 1
            });
            this.game = game;
            this.breath = function (delta) {
                _this.heartbeat(delta);
            };
        }
        Object.defineProperty(GameBase.prototype, "progress", {
            get: function () {
                return this._progress;
            },
            enumerable: true,
            configurable: true
        });
        GameBase.prototype.init = function (stage_no) {
            this.stage = stages[stage_no];
            this.trrain_plain = this.stage.field;
            this.app.stage.removeChild(this.main_view);
            this.main_view = new PIXI.Container();
            this.main_view.x = this.game.field_location.x;
            this.main_view.y = this.game.field_location.y;
            this.app.stage.addChild(this.main_view);
            this.controlpanel = new ControlPanel(this, { x: 890, y: 50 }, { h: 640, w: 220 });
            this.app.stage.addChild(this.controlpanel.sprite);
            this.displaypanel = new DisplayPanel(this, { x: 50, y: 50 }, { h: 640, w: 200 });
            this.app.stage.addChild(this.displaypanel.sprite);
        };
        GameBase.prototype.illuminate = function (actor) {
            var _this = this;
            var make_mask = function (location, mask, trrain) {
                var pattern_or = function (source_mask, action_mask) {
                    var result = [];
                    source_mask.forEach(function (mask_row, y) {
                        var row = [];
                        result.push(row);
                        mask_row.forEach(function (mask_value, x) {
                            if (action_mask[y][x] === 0) {
                                row.push(mask_value);
                            }
                            else {
                                row.push(0.0);
                            }
                        });
                    });
                    return result;
                };
                var pattern_y = 0;
                for (var range_y = location.y - 3; range_y < location.y + 3; range_y++) {
                    var row = trrain[range_y];
                    var pattern_x = 0;
                    if (row) {
                        for (var range_x = location.x - 3; range_x < location.x + 3; range_x++) {
                            if (row[range_x] > 0) {
                                mask = pattern_or(mask, _this.shadow_mask[pattern_y][pattern_x]);
                            }
                            pattern_x++;
                        }
                    }
                    pattern_y++;
                }
                return mask;
            };
            var location = actor.location;
            var center = Location.offset(location, { x: 3, y: 3 });
            var darkness_plain = this.stage.darkness_plain; // this.stage.field[1];
            var init_mask = [
                [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                [0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0],
                [0.0, 0.0, 0.5, 1.0, 0.5, 0.0, 0.0],
                [0.0, 0.5, 1.0, 1.0, 1.0, 0.5, 0.0],
                [0.0, 0.0, 0.5, 1.0, 0.5, 0.0, 0.0],
                [0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0],
                [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
            ];
            this.mask = make_mask(location, init_mask, this.trrain_plain);
            var mask_location = { x: 0, y: 0 };
            this.mask.forEach(function (mask_row) {
                var masked_plain_row = darkness_plain[mask_location.y + center.y];
                mask_location.y++;
                mask_location.x = 0;
                mask_row.forEach(function (mask_value) {
                    if (masked_plain_row) {
                        var target_area = masked_plain_row[mask_location.x + center.x];
                        mask_location.x++;
                        if (target_area) {
                            switch (mask_value) {
                                case 0:
                                    switch (target_area.alpha) {
                                        case 0.0:
                                        case 0.5:
                                        case 1.0:
                                            break;
                                    }
                                    break;
                                case 0.5:
                                    switch (target_area.alpha) {
                                        case 0.0:
                                        case 0.5:
                                            break;
                                        case 1.0:
                                            target_area.alpha = 0.5;
                                            break;
                                    }
                                    break;
                                case 1.0:
                                    switch (target_area.alpha) {
                                        case 0.0:
                                        case 0.5:
                                        case 1.0:
                                            target_area.alpha = 0.0;
                                            break;
                                    }
                                    break;
                            }
                        }
                    }
                });
            });
        };
        GameBase.prototype.others_turn = function () {
        };
        GameBase.prototype.others_move_end = function (target) {
        };
        GameBase.prototype.move_end = function () {
            this.turn_count++;
            if (this.turn_count === 3) {
                this.turn_end();
            }
        };
        GameBase.prototype.turn_end = function () {
            this.turn_count = 0;
            this._progress = true;
            this.on_others_turn_begin();
            this.others_turn();
            this.on_turn_begin();
            this._progress = false;
            /*
            let style1 = {
                fontFamily: "Arial",
                fontSize: 36,
                fontStyle: "italic",
                fontWeight: "bold",
                fill: ["#b0fffa", "#0b54ff"], // gradient
                stroke: "#64a1a7",
                strokeThickness: 2,
                dropShadow: true,
                dropShadowColor: "#95baff",
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 300
            };

            let style2 = {
                fontFamily: "Arial",
                fontSize: 36,
                fontStyle: "italic",
                fontWeight: "bold",
                fill: ["#ffd2ca", "#ff0a16"], // gradient
                stroke: "#977653",
                strokeThickness: 2,
                dropShadow: true,
                dropShadowColor: "#ff25de",
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 300
            };

            this.message.show("End Turn.", style1, 30, () => {
                this.message.show("Other's Turn.", style2, 30, () => {
                    this.on_others_turn_begin();
                    this.others_turn();
                    this.on_turn_begin();
                    this._progress = false;
                });
            });
            */
        };
        GameBase.prototype.on_turn_begin = function () {
        };
        GameBase.prototype.on_others_turn_begin = function () {
        };
        GameBase.prototype.gameover = function () {
        };
        GameBase.prototype.heartbeat = function (delta) {
            this.explorer.heartbeat();
            _.forEach(this.creature_list, function (creature) {
                creature.heartbeat();
            });
            this.dialog.heartbeat();
            this.message.heartbeat();
        };
        GameBase.prototype.init_background = function () {
            this.main_view.addChild(SpriteBuilder.create_sprite(this.stage.faces["background"], null)); // 背景
        };
        GameBase.prototype.init_trrain = function () {
            var _this = this;
            this.trrain_plain.forEach(function (trrain_row, location_y) {
                trrain_row.forEach(function (trrain_number, location_x) {
                    var tllein_category = Math.floor(trrain_number / 10); // 2X  -> impermeable_wall
                    var trrain_face = trrain_number - (tllein_category * 10);
                    switch (tllein_category) {
                        case 2: // impermeable_wall
                            var face = _this.stage.faces["impermeable_wall_up"];
                            switch (trrain_face) {
                                case 1:
                                    face = _this.stage.faces["impermeable_wall_up"];
                                    break;
                                case 2:
                                    face = _this.stage.faces["impermeable_wall_left"];
                                    break;
                                case 3:
                                    face = _this.stage.faces["impermeable_wall_down"];
                                    break;
                                case 4:
                                    face = _this.stage.faces["impermeable_wall_right"];
                                    break;
                                default:
                            }
                            var trrain = SpriteBuilder.create_sprite(face, {
                                x: location_x,
                                y: location_y
                            });
                            _this.main_view.addChild(trrain);
                            break;
                    }
                });
            });
        };
        GameBase.prototype.init_npc = function () {
            var _this = this;
            this.creature_list = [];
            this.stage.creatures.forEach(function (creature) {
                switch (creature.type) {
                    case 1:
                        var _creature = new Creature(_this, _this.stage.faces[creature.face], creature.location, creature.type);
                        _this.creature_list.push(_creature);
                        _this.main_view.addChild(_creature.sprite);
                        break;
                }
            });
        };
        GameBase.prototype.init_darkness = function () {
            this.stage.darkness_plain = [];
            var darkness_plain = this.stage.darkness_plain;
            for (var location_y = 0; location_y < this.game.field_size.h; location_y++) {
                var current_column = [];
                darkness_plain.push(current_column);
                for (var location_x = 0; location_x < this.game.field_size.w; location_x++) {
                    var darkness = SpriteBuilder.create_rect({ x: location_x, y: location_y });
                    current_column.push(darkness);
                    this.main_view.addChild(darkness);
                }
            }
        };
        GameBase.prototype.init_player = function () {
            var sound = new Sound(this.stage.sounds["explorer"]);
            this.explorer = new Player(this, this.stage.faces["explorer_up"], {
                x: this.stage.initial_location.x,
                y: this.stage.initial_location.y
            }, sound);
            this.main_view.addChild(this.explorer.sprite);
        };
        GameBase.prototype.init_dialog = function () {
            this.dialog = new Dialogs({ x: 200, y: 300 }, { w: 300, h: 100 });
            this.main_view.addChild(this.dialog.sprite);
        };
        GameBase.prototype.init_message = function () {
            this.message = new Messages({ x: 700, y: 40 }, { w: 300, h: 100 });
            this.main_view.addChild(this.message.sprite);
        };
        GameBase.prototype.stop = function () {
            this.app.ticker.remove(this.breath);
        };
        // Blowing a breath!
        GameBase.prototype.setup = function () {
            this.turn_count = 0;
            this.init_background();
            this.init_trrain();
            this.init_npc();
            this.init_darkness();
            this.init_player();
            this.init_dialog();
            this.init_message();
            this.on_turn_begin();
            this.app.ticker.add(this.breath);
        };
        GameBase.prototype.setlevel = function (level) {
            if (!this.progress) {
                this.stop();
                this.init(level);
                this.setup();
            }
        };
        GameBase.prototype.trrain = function (location) {
            return this.trrain_plain[location.y][location.x];
        };
        return GameBase;
    }());
    var Dod = /** @class */ (function (_super) {
        __extends(Dod, _super);
        function Dod(game, stage) {
            var _this = _super.call(this, game, stage) || this;
            _this.init(0);
            return _this;
        }
        Dod.prototype.others_move_end = function (target) {
            var _this = this;
            _super.prototype.others_move_end.call(this, target);
            // one-sided
            _.forEach(this.creature_list, function (creature) {
                if (creature.live) {
                    if (Location.equal(_this.explorer.location, creature.location)) {
                        _this.gameover();
                    }
                }
            });
        };
        Dod.prototype.move_end = function () {
            var _this = this;
            _super.prototype.move_end.call(this);
            // one-sided
            _.forEach(this.creature_list, function (creature) {
                if (Location.equal(_this.explorer.location, creature.location)) {
                    creature.live = false;
                }
            });
        };
        Dod.prototype.others_turn = function () {
            this.creature_list.forEach(function (creature) {
                creature.randomwalk();
            });
        };
        Dod.prototype.on_turn_begin = function () {
            _super.prototype.on_turn_begin.call(this);
        };
        Dod.prototype.on_begin_others_turn = function () {
            _super.prototype.on_others_turn_begin.call(this);
        };
        Dod.prototype.gameover = function () {
            _super.prototype.gameover.call(this);
            this.setlevel(0);
        };
        return Dod;
    }(GameBase));
    // Fiat lux.
    var planck_length = 32;
    var game = {
        field_size: { w: 20, h: 20 },
        field_location: { x: 250, y: 50 },
        moment: planck_length / 4
    };
    var stages = [
        {
            faces: {
                explorer_up: "img/ouzi_front.png",
                explorer_left: "img/ouzi_left.png",
                explorer_down: "img/ouzi_back.png",
                explorer_right: "img/ouzi_right.png",
                impermeable_wall_up: "img/castlewall_up.png",
                impermeable_wall_left: "img/castlewall_left.png",
                impermeable_wall_down: "img/castlewall_under.png",
                impermeable_wall_right: "img/castlewall_right.png",
                background: "img/dungeon.png",
                monster_A: ["img/monsterA_1.png", "img/monsterA_2.png"],
                monster_B: ["img/monsterB_4.png", "img/monsterB_3.png", "img/monsterB_2.png", "img/monsterB_1.png"]
            },
            sounds: {
                explorer: {
                    src: ["img/se_maoudamashii_se_footstep02.mp3"],
                    sprite: {
                        walk: [0, 3000]
                    }
                }
            },
            field: [
                [22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24],
                [22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 23, 23, 22, 23, 23, 23, 0, 0, 22, 23, 23, 23, 23, 23, 23, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 23, 23, 23, 23, 23, 0, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 23, 0, 0, 0, 0, 0, 23, 23, 23, 23, 23, 23, 23, 0, 0, 24],
                [22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 23, 23, 23, 23, 23, 0, 0, 23, 23, 22, 23, 23, 23, 0, 0, 0, 24],
                [22, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 23, 23, 23, 23, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 23, 23, 23, 23, 23, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21]
            ],
            darkness_plain: [],
            creatures: [
                { type: 1, location: { x: 3, y: 3 }, face: "monster_A" },
                { type: 1, location: { x: 5, y: 5 }, face: "monster_A" },
                { type: 1, location: { x: 11, y: 6 }, face: "monster_B" },
                { type: 1, location: { x: 3, y: 4 }, face: "monster_A" },
                { type: 1, location: { x: 5, y: 6 }, face: "monster_B" },
                { type: 1, location: { x: 11, y: 7 }, face: "monster_A" },
                { type: 1, location: { x: 3, y: 5 }, face: "monster_A" },
                { type: 1, location: { x: 5, y: 7 }, face: "monster_B" },
                { type: 1, location: { x: 11, y: 8 }, face: "monster_A" },
                { type: 1, location: { x: 4, y: 3 }, face: "monster_A" },
                { type: 1, location: { x: 6, y: 5 }, face: "monster_A" },
                { type: 1, location: { x: 12, y: 6 }, face: "monster_B" },
                { type: 1, location: { x: 4, y: 4 }, face: "monster_A" },
                { type: 1, location: { x: 5, y: 6 }, face: "monster_B" },
                { type: 1, location: { x: 12, y: 7 }, face: "monster_A" },
                { type: 1, location: { x: 4, y: 5 }, face: "monster_A" },
                { type: 1, location: { x: 6, y: 7 }, face: "monster_B" },
                { type: 1, location: { x: 12, y: 8 }, face: "monster_A" }
            ],
            initial_location: { x: 8, y: 10 }
        },
        {
            faces: {
                explorer_up: "img/ouzi_front.png",
                explorer_left: "img/ouzi_left.png",
                explorer_down: "img/ouzi_back.png",
                explorer_right: "img/ouzi_right.png",
                impermeable_wall_up: "img/castlewall_up.png",
                impermeable_wall_left: "img/castlewall_left.png",
                impermeable_wall_down: "img/castlewall_under.png",
                impermeable_wall_right: "img/castlewall_right.png",
                background: "img/dungeon.png",
                monster_A: ["img/monsterA_1.png", "img/monsterA_2.png"],
                monster_B: ["img/monsterB_2.png", "img/monsterB_1.png", "img/monsterB_2.png", "img/monsterB_1.png"]
            },
            sounds: {
                explorer: {
                    src: ["img/se_maoudamashii_se_footstep02.mp3"],
                    sprite: {
                        walk: [0, 3000]
                    }
                }
            },
            field: [
                [22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23],
                [22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 23, 23, 22, 23, 23, 23, 0, 0, 22, 23, 23, 23, 23, 23, 23, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 23, 23, 23, 23, 23, 0, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 23, 0, 0, 0, 0, 0, 23, 23, 23, 23, 23, 23, 23, 0, 0, 24],
                [22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 23, 23, 23, 23, 23, 0, 0, 23, 23, 22, 23, 23, 23, 0, 0, 0, 24],
                [22, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 23, 23, 23, 23, 23, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 23, 23, 23, 23, 23, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 24],
                [22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24],
                [22, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21]
            ],
            darkness_plain: [],
            creatures: [
                { type: 1, location: { x: 3, y: 3 }, face: "monster_B" },
                { type: 1, location: { x: 5, y: 5 }, face: "monster_B" },
                { type: 1, location: { x: 11, y: 6 }, face: "monster_B" },
                { type: 1, location: { x: 3, y: 4 }, face: "monster_B" },
                { type: 1, location: { x: 5, y: 6 }, face: "monster_B" },
                { type: 1, location: { x: 11, y: 7 }, face: "monster_B" },
                { type: 1, location: { x: 3, y: 5 }, face: "monster_B" },
                { type: 1, location: { x: 5, y: 7 }, face: "monster_B" },
                { type: 1, location: { x: 11, y: 8 }, face: "monster_B" }
            ],
            initial_location: { x: 8, y: 10 }
        }
    ];
    var dod = new Dod(game, stages);
    var stage_element = document.getElementById("stage");
    stage_element.appendChild(dod.app.view);
    //   dod.setlevel(0);
    // keybord handling
    var keyboard = function (keyCode) {
        var key = {
            code: keyCode,
            isDown: false,
            isUp: true,
            press: undefined,
            release: undefined,
            downHandler: undefined,
            upHandler: undefined
        };
        key.downHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press)
                    key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };
        key.upHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release)
                    key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };
        window.addEventListener("keydown", key.downHandler.bind(key), false);
        window.addEventListener("keyup", key.upHandler.bind(key), false);
        return key;
    };
    var left = keyboard(37);
    var up = keyboard(38);
    var right = keyboard(39);
    var down = keyboard(40);
    left.press = function () {
        if (!dod.progress) {
            dod.explorer.move_left();
        }
    };
    up.press = function () {
        if (!dod.progress) {
            dod.explorer.move_up();
        }
    };
    right.press = function () {
        if (!dod.progress) {
            dod.explorer.move_right();
        }
    };
    down.press = function () {
        if (!dod.progress) {
            dod.explorer.move_down();
        }
    };
    var start = function (faces) {
        var loader = PIXI.loader;
        _.values(faces).forEach(function (face) {
            if (_.isArray(face)) {
                _.forEach(face).forEach(function (_face) {
                    loader.add(_face);
                });
            }
            else {
                loader.add(face);
            }
        });
        var _start = function () {
            dod.setup();
        };
        loader.load(_start);
    };
    start(dod.stage.faces);
})(Game || (Game = {}));
//# sourceMappingURL=dod.js.map