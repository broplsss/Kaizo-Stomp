kaboom();

// load assets

loadSprite("ghosty", "sprites/enemy.png");
loadSprite("background", "sprites/background.png");
loadSprite("spike", "sprites/spike.png");
loadSprite("bomb", "sprites/bomb.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("dbackground", "sprites/darksky.png");
loadSprite("prize", "sprites/jumpy.png");
loadSprite("apple", "sprites/apple.png");
loadSprite("portal", "sprites/coin.png");
loadSprite("coin", "sprites/coin.png");
loadSound("coin", "sounds/theme.mp3");
loadSprite("start", "sprites/start.png");
loadSound("powerup", "sounds/theme.mp3");
loadSound("blip", "sounds/theme.mp3");
loadSound("hit", "sounds/theme.mp3");
loadSound("portal", "sounds/theme.mp3");
loadSprite("Player", "sprites/playsheet.png", {
  sliceX: 14,
  //sliceY: 0,
  anims: {
     idle: {
      from: 0,
      to: 4,
     },
     run: {
      from: 5,
      to: 7,
     },
     jump: {
      from: 8,
      to: 13,
     },
    
   },
});
loadSprite("Player2", "sprites/char.png", {
  sliceX: 12,
  //sliceY: 0,
  anims: {
     idle: {
      from: 0,
      to: 0,
     },
     run: {
      from: 0,
      to: 4,
     },
     bounce: {
      from: 6,
      to: 11,
     },
    
   },
});

function addDialog() {
		const h = 160
		const pad = 16
		const bg = add([
			pos(0, height() - h),
			rect(width(), h),
			color(0, 0, 0),
			z(100),
		])
		const txt = add([
			text("", {
				width: width(),
			}),
			pos(0 + pad, height() - h + pad),
			z(100),
		])
		bg.hidden = true
		txt.hidden = true
		return {
			say(t) {
				txt.text = t
				bg.hidden = false
				txt.hidden = false
			},
			dismiss() {
				if (!this.active()) {
					return
				}
				txt.text = ""
				bg.hidden = true
				txt.hidden = true
			},
			active() {
				return !bg.hidden
			},
			destroy() {
				bg.destroy()
				txt.destroy()
			},
		}
	}
  const dialog = addDialog()
// custom component controlling enemy patrol movement


function addButton(txt, p, tag, f) {

	const btn = add([
		text(txt, {
      size: 30,
    }),
		pos(p),
		area({ cursor: "pointer", }),
		scale(1),
		origin("center"),
    tag,
    
	])
  
};
function patrol(speed = 60, dir = 1) {
	return {
		id: "patrol",
		require: [ "pos", "area", ],
		add() {
			this.on("collide", (obj, side) => {
				if (side === "left" || side === "right") {
					dir = -dir;
         
          
				}
			});
		},
		update() {
			this.move(speed * dir, 0);
		},
	};
}



// custom component that makes stuff grow big
function big() {
	let timer = 0;
	let isBig = false;
	let destScale = 1;
	return {
		// component id / name
		id: "big",
		// it requires the scale component
		require: [ "scale" ],
		// this runs every frame
		update() {
			if (isBig) {
				timer -= dt();
				if (timer <= 0) {
					this.smallify();
				}
			}
			this.scale = this.scale.lerp(vec2(destScale), dt() * 6);
		},
		// custom methods
		isBig() {
			return isBig;
		},
		smallify() {
			destScale = 1;
			timer = 0;
			isBig = false;
		},
		biggify(time) {
			destScale = 2;
			timer = time;
			isBig = true;
		},
	};
}

// define some constants
const JUMP_FORCE = 990;
const MOVE_SPEED = 360;
const FALL_DEATH = 2400;
COINS = 0;
LevelId = 0;
Darksky = false;
CanBig = true;
Inspect = false;
TrueFalse = true;
CamPosPlay = true;
const characters = {
		"a": {
			sprite: "ghosty",
			msg: "ohhi how are you?",
		},
		"b": {
			sprite: "ghosty",
			msg: "get out!",
		},
}
const LEVELS = [
	  [
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                      ^    ",
		"        ^^>^          =    ",
		"        ====          =    ",
		"                      =    ",
		"           $          =    ",
		"^ >^^^^^^^^^^^^^ > ^^^=^^@^",
		"===========================",
	],

  [
		"                           ",
		"   ^ >  >    > >        ^  ",
		"   ^^^^^^^^^^^^^^^^^^^^^^  ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		" >^^^^^^^^^^^^^^^^^^^^^^^@^",
		"===========================",
	],
  [
		"                 ^         ",
		"      ^                  ^ ",
		"                      ^    ",
		"                           ",
		"                ^          ",
		"  ^      ^                 ",
		"                           ",
		"^^^>^^^^^^^>^^^^^^>^^^^@^^^",
		"===========================",
	],
  [
		"                                    @    ",
		"                                   ^^^   ",
		"                          ^> ^           ",
		"                          ^^^^           ",
		"                  ^>^                    ",
		"         ^>  ^    ^^^                    ",        
		"         ^^^^^               ========= ==",
		"                             ========= ==",
		"                           =========== ==",
		"^^>^^^^^^^^^^^^^^^>^^^^>^^>===========^==",
		"=========================================",
    ],
   
      [
		"                                                                                ",
		"                                                                                ",
		"                                ^                                               ",
		"                                                                                ",
		"               ====             =                                     = =       ",
		"                               ==         =                           = =       ",
		"                             ===          ==                          = =       ",
		" ^   $^^  >    >    >        ====   ^ >   ===     >>       ==  ^      =@=       ",
		"&==============&&&&&&&&&&&&&=========&&&&===========&&&&&&===============&&&&&&&",
	],
  	[
    "                &          ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                      ^    ",
		"        & >&          =    ",
		"        &&&&          =    ",
		"                      = &  ",
		"                      =    ",
		"^ > ^^^^^^^^^^   > ^^^=^^@^",
		"====&&&&&&&&&&&&&&&========",
	],
	[ 
    "                        &  ",
		"                    ^ >^&  ",
		"                    ^^^^&  ",
		"                        &  ",
		"              &>  &     &  ",
		"              &&&&&     &  ",
		"                        &  ",
		"                        &  ",
		"      ^ > ^             &  ",
		"      ^^^^^             &  ",
		"                        & @",
		"==                      &&=",
	],
  [ 
    "     @                      ",
    "                            ",
		"                            ",
		"    ^>^                     ",
		"    ^^^                     ",
		"	                           ",
		"      ^ >     >  >   > ^    ",   
		"      ^^^^^^^^^^^^^^^^^^    ",
		"                            ",
		"                            ",
		"                            ",
		"=                        &>&",
		"===&&==================&&===",
	],
	[
  	"                           ",
		"                           ",
		"                           ",
		"                           ",
		"     =@       -        &   ",
		"     ===================   ",
		"                           ",
		"                           ",
		"                           ",
		"&           -           &>&",
		"===&====&&======&&===&=====",
    ],	
    
    
    [
		"  &&&&                     ",
		"  &                        ",
		"  &                        ",
		"  &                        ",
		"  &@$+                &    ",
		"  =====================    ",
		"                           ",
		"  #                        ",
		"                           ",
		"                        ^>^",
		"===========================",
	],
  [
    "                           ",
    "                           ",
		"                        = =",
		"             &>&        =@=",
		"              &          & ",
		"                           ",
		"       ^>^                 ",
		"        ^                  ",
		"   &>&                     ",
		"    &                      ",
		"                           ",
		"^>^                        ",
		"^^^                        ",
	],
    [
    "                ^              ^ @ ",               
    "   ^^                            = ",
    " ^  ^>^^^^^^^  ^^>^^^^^^  ^^^^>^^^^",
    " ^   ^^^^^^^  >^^^^^^^^^  ^^^^^^^^^",
    ">^>^^^^^^^^^^^^^       ^> ^        ",
    "===================================",
    ], 
      
    [
		"==?=============?==========",
		"==             & &        =",
		"===? =?==?======&==========",
		"=== == == =================",
		"=== == == =================",
		"=== == == =================",
		"===&==&== =================",
		"&                         &",
		"=========?=================",
    "&                         &",
		"&=?============?=======?===",
    "  &                    &   ",
		"=========@=================",
	],
    [
    "                     &     ",
    "                     @     ",
		"                     &     ",
		"                           ",
		"    ^            ?         ",
		"                           ",
		"              ?            ",
		"                           ",
		"         ?                 ",
		"      ^       ^   ^        ",
		"    ?                      ",
		"                           ",
		"?&&&&&&&&&&&&&&&&@&&&&&&&&&",
	],         
  // Second Hardest Level
    [
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"  %%    ^^          ^^     ",
		"                      >^   ",
		"                ^     >^   ",
		"    ^  ^^  ^^> ^   =^ >^   @",
		"^===^^^====================",
	],
  [
    // Hardest Level
"                                                                              ^  ",
"                                                                              @ ",
"                                                                    ",
"                  ^      ^^^^^>^^^^^^>^^^^^^>^^^^^>^^^^>^^^^^^^^^               ",
"                 ===     ========================================     =         ",
"                                                                      &    ^>^  ",
"                                                                       &    ^   ",
"             =>>=     ^       ^         >>>>                       ^>^  &  ^@^  ",
"======================&&&&=&&&&==============================&&&&===============",
 ], 

];

// define what each symbol means in the level graph
const levelConf = {
	// grid size
	width: 32,
	height: 32,
	// define each object as a list of components
	"=": () => [
		sprite("grass"),
		area(),
		solid(),
		origin("bot"),
	],
	"$": () => [
		sprite("coin"),
		area(),
		pos(0, -9),
		origin("bot"),
		"coin",
	],
	"%": () => [
		sprite("prize"),
		area(),
		solid(),
		origin("bot"),
		"prize",
	],
	"^": () => [
		sprite("spike"),
		area(),
		solid(),
		origin("bot"),
		"danger",
	],
  "!": () => [
		sprite("bomb"),
		area(),
		solid(),
		origin("bot"),
		"danger",
	],
	"#": () => [
		sprite("apple"),
		area(),
		origin("bot"),
		body(),
		"apple",
	],
	">": () => [
		sprite("ghosty"),
		area(),
		origin("bot"),
		body(),
		patrol(),
		"enemy",
	],
	"p": () => [
		sprite("portal"),
		area({ scale: 0.5, }),
		origin("bot"),
		pos(0, -12),
		"portal",
	],
  "@": () => [
		sprite("start"),
		area({ scale: 0.5, }),
		origin("bot"),
		pos(0, -12),
		"portal",
	],
  any(ch) { 
			const char = characters[ch]
			if (char) {
				return [
					sprite(char.sprite),
					area(),
					solid(),
					"character",
					{ msg: char.msg, },
				]
			}
	},
};
SpriteType= "background";
let Var = 0
scene("game", ({ levelId, coins } = { levelId: 0, coins: COINS }) => {
  
  Var = Math.floor((Math.random() * 2) + 1);
  if (Var = 1){
    SpriteType= "background";
    console.log("darksky - false");
  } else if (Var =2 ){
    SpriteType= "dbackground";
    console.log("darksky - true");
  };
 	const dirs = {
		"left": LEFT,
		"right": RIGHT,
		"up": UP,
		"down": DOWN,
	}
  

  LevelId = levelId;
  
	gravity(3200);
	const background = add([
		sprite(SpriteType),
		pos(0, 0),
		area(),
		scale(20),
    width(width()),
	  height(height()),

	
		//origin("bot"),
	]);
	// add level to scene
	const level = addLevel(LEVELS[levelId ?? 0], levelConf);

	// define player object
	const player = add([
		sprite("Player"),
		pos(0, 0),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		big(),
		origin("bot"),
	]);
  const player2 = add([
		sprite("Player2"),
		pos(0, -40),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
    "player2",
		big(),
		origin("bot"),
	]);
  	// define player object


	// action() runs every frame
	player.action(() => {
		// center camera to player
    background.pos.x = player.pos.x -800;
    background.pos.y= player.pos.y -800; 
    if(CamPosPlay = true){
	    camPos(player.pos);
    };
    if(CamPosPlay = false){
	    camPos(player2.pos);
    };
	
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			go("lose");
		};
    if (player2.pos.x +400 < player.pos.x) {
      player2.pos.x = player.pos.x;
      player2.pos.y = player.pos.y - 100;
			//player2.pos.x = player.pos.x;
      //player2.pos.y = player.pos.y + 200;
		};
     if (player2.pos.x -400 > player.pos.x) {
			player2.pos.x = player.pos.x;
      player2.pos.y = player.pos.y - 100;
		};
	});

	// if player collides with any obj with "danger" tag, lose
	player.collides("danger", () => {
		go("lose");
		play("hit");
	});

	player.collides("portal", () => {
		play("portal");
		if (levelId + 1 < LEVELS.length) {
      COINS = coins;
			go("levelinterval");
		} else {
			go("win");
		}
	});

	
  let hasApple = false;
	player.collides("enemy", (e) => {

    go("lose");
		play("hit");

   
  
	});

	

	// grow an apple if player's head bumps into an obj with "prize" tag
	player.on("headbutt", (obj) => {
		if (obj.is("prize") && !hasApple) {
			const apple = level.spawn("#", obj.gridPos.sub(0, 1));
			apple.jump();
			hasApple = true;
			play("blip");
		}
	});

	// player grows big collides with an "apple" obj
	player.collides("apple", (a) => {
		destroy(a);
		// as we defined in the big() component
		player.biggify(15);
		hasApple = false;
		play("powerup");
	});

	let coinPitch = 0;

	action(() => {
		if (coinPitch > 0) {
			coinPitch = Math.max(0, coinPitch - dt() * 100);
		}
	});
  
  for (const dir in dirs) {
		
    wait(2, () => {
      dialog.dismiss()
    })
		
		
	
	}



  action("player", (player) => {
    if (time() - c >= y) {
      c = time();
      var pPos = player.pos;
      bully.play("throw");
      bully.play("run");
      add([
        sprite("principalShot"),
        area(),
        pos(bully.pos),
        cleanup(3),
        origin("center"),
        { dir: pPos.sub(bully.pos).unit(), },
        "bullyProjectile",
      ]);
    };
  });


	player.collides("coin", (c) => {
		destroy(c);
		play("coin", {
			detune: coinPitch,
		});
		coinPitch += 100;
		coins += 1;
		coinsLabel.text = coins;
	});

	const coinsLabel = add([
		text(coins),
		pos(24, 24),
		fixed(),
	]);
  JumpN = 0;
	// jump with space
	keyPress("space", () => {
		// these 2 functions are provided by body() component
    player.play("idle");
    if(JumpN < 2){
      player.jump(JUMP_FORCE);
      JumpN = JumpN + 1;
    };
		if (player.grounded()) {
			JumpN = 0;
		};
	});
  	// jump with space
	keyPress("up", () => {
		// these 2 functions are provided by body() component
    player.play("idle");
    if(JumpN < 2){
      player.jump(JUMP_FORCE);
      JumpN = JumpN + 1;
    };
		if (player.grounded()) {
			JumpN = 0;
		};
	});
  player.grounded((l) => {
		if (l.is("player2")) {
			player.jump(JUMP_FORCE * 1.5)
			
			addKaboom(player.pos)
			play("powerup")
		}
	})
  player2.collides("enemy", () => {
		player2.jump(JUMP_FORCE * 1.5);
    player2.collides("player", () => {
		  player.jump(JUMP_FORCE * 1.5);
	  });
	});
  keyPress("b", () => {
    //alert("hello");

    if(CanBig = true){
      // /alert("cello");
      
      player.biggify(5)
      player.play("idle");
      //CanBig = false;
      //setTimeout(5000)
      //CanBig = true;
      
    };
	  
	});

  keyPress("c", () => {
   
    if(CamPosPlay=true){
      CamPosPlay = false;
    };
    if(CamPosPlay=false){
      CamPosPlay = true;
    };
    
      
	  
	});
	keyDown("left", () => {
		player.move(-MOVE_SPEED, 0);
    player.play("run");
    player.flipX(false);
	});

	keyDown("right", () => {
		player.move(MOVE_SPEED, 0);
    //player.play("idle");
    player.flipX(true);
    if(TrueFalse = true){
      TrueFalse = false;
      player.play("run");
      
      TrueFalse= true;
    };
	});

	keyPress("down", () => {
		player.weight = 3;
    player.play("idle");
	});

	keyRelease("down", () => {
		player.weight = 1;
    
	});
 //
 //

 //
 	keyDown("a", () => {
		player2.move(-MOVE_SPEED, 0);
    player2.play("run");
    player2.flipX(true);
	});

	keyDown("d", () => {
		player2.move(MOVE_SPEED, 0);
    //player.play("idle");
    player.flipX(false);
    if(TrueFalse = true){
      TrueFalse = false;
      player2.play("run");
      
      TrueFalse= true;
    };
	});

	keyPress("s", () => {
		player2.weight = 3;
    player2.play("idle");
	});

	keyRelease("down", () => {
		player2.weight = 1;
    
	});
	keyPress("w", () => {
		// these 2 functions are provided by body() component
    player2.play("idle");
    if(JumpN < 2){
      player2.jump(JUMP_FORCE);
      JumpN = JumpN + 1;
    };
		if (player2.grounded()) {
			JumpN = 0;
		};
	});
	keyPress("f", () => {
		fullscreen(!fullscreen());
    player.play("idle");
	});

});
scene("menu", () => {
  gravity(3200);
  VarEXE = 0 
  JumpN = 0;
  const background = add([
		sprite("dbackground"),
		pos(-10,-10),
		
		scale(20),
    width(width()),
	  height(height()),

	
		//origin("bot"),
	]);
  addButton("Start", vec2(200, 100),"start", () => debug.log("Teleporting"))
  addButton("Other", vec2(width()-200, 100),"other", () => debug.log("Teleporting"))
 
  const player = add([
    
		sprite("Player"),
   
		pos(center()),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		big(),
	  origin("bot"),
	]);
  player.collides("start", () => {
		go("game");
		play("hit");
	});
  player.collides("other", () => {
		go("instructions");
		play("hit");
	});
  const enemy = add([
    
		sprite("ghosty"),
   
		pos(100,0),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		patrol(),
	  origin("bot"),
	]);


  button = add([
		text("Stomp"),
		pos(width() / 2, height() / 2 - 80),
    
		
		scale(1),
		origin("center"),
    
	]);
  
  button1 = add([
		text("By: zthum Studios"),
		
    pos(center()),
    
	
		scale(0.5),
		origin("center"),
    
	]);
  add([
	  rect(width(), 48),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(0, height() - 48),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);
  add([
	  rect(48, height()),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(width() - 48, 0),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);
  add([
	  rect(48, height()),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(0, 0),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);


  keyPress("up", () => {
		// these 2 functions are provided by body() component
    player.play("idle");
    if(JumpN < 2){
      player.jump(JUMP_FORCE);
      JumpN = JumpN + 1;
    };
		if (player.grounded()) {
			JumpN = 0;
		};
	});

  keyPress("b", () => {
    //alert("hello");

    if(CanBig = true){
      // /alert("cello");
      
      player.biggify(5)
      player.play("idle");
      //CanBig = false;
      //setTimeout(5000)
      //CanBig = true;
      
    };
	  
	});
  

	keyDown("left", () => {
		player.move(-MOVE_SPEED, 0);
    player.play("run");
    player.flipX(false);
	});

	keyDown("right", () => {
		player.move(MOVE_SPEED, 0);
    //player.play("idle");
    player.flipX(true);
    if(TrueFalse = true){
      TrueFalse = false;
      player.play("run");
      
      TrueFalse= true;
    };
	});

	keyPress("down", () => {
		player.weight = 3;
    player.play("idle");
	});

	keyRelease("down", () => {
		player.weight = 1;
    
	});
  if(player.pos.x > 400 ){
    
    player.pos.x = 0;
    player.pos = center();
  };
  if(player.pos.x <  - 400 ){
    
    player.pos.x = 0;
    player.pos = center();
  };
  player.collides("enemy", () => {
		go("game");
		//play("start");
	});
 
  //addButton("Quit", vec2(200, 200), () => debug.log("bye"));
	
});
scene("levelinterval", () => {
  Title = "Level Complete!";
  Subtitle = "";
  gravity(3200);
  VarEXE = 0 
  JumpN = 0;
  if( LevelId == 0){
    
    Subtitle = "Hint: Spikes Hurt!";
  } else if(LevelId == 1){
    
    Subtitle = "Hint: You can double jump!";
  } else if(LevelId == 2){
    
    Subtitle = "Hint: Place the Wheel ontop of enemies and get on, you can now crowdsurf!";
  } else if(LevelId == 3){
    
    Subtitle = "Hint: Press B to supersize!";
  } else if(LevelId == 4){
    
    Subtitle = "Hint: You can use your wheel to deter enemies!";
  } else if(LevelId == 5){
    
    Subtitle = "Hint: Wonder what that spring on top of the wheel does?";
  } else{
    
    Subtitle = "Please stand by... in the dimension";
  };
  const background = add([
		sprite("dbackground"),
		pos(-10,-10),
		
		scale(20),
    width(width()),
	  height(height()),

	
		//origin("bot"),
	]);

  const player = add([
    
		sprite("Player"),
   
		pos(center()),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		big(),
	  origin("bot"),
	]);
  addButton("Continue", vec2(200, 100),"start", () => debug.log("Teleporting"))
  addButton("Replay", vec2(width()-200, 100),"continue", () => debug.log("Teleporting"))
  player.collides("start", () => {
   go("game", {
				levelId: LevelId + 1,
				coins: COINS,
	  });
  });
  player.collides("continue", () => {
   go("game", {
				levelId: LevelId,
				coins: COINS,
	  });
  });
  loop(0.15, () => {
    add([
    
	  	sprite("ghosty"),
      lifespan(0.75),
		  pos(center()),
		  area(),
		  scale(1),
		// makes it fall to gravity and jumpable
	  	body(),
		// the custom component we defined above
	  	patrol(),
	    origin("bot"),
	  ]);
    setInterval(3000);
  });

  


  button = add([
		text(Title),
		pos(width() / 2, height() / 2 - 80),
    
		
		scale(1),
		origin("center"),
    
	]);
  
  button1 = add([
		text(Subtitle,{
      width: width() - pos * 2,
    }),
		
    pos(center()),
    
	
		scale(0.5),
		origin("center"),
    
	]);
  add([
	  rect(width(), 48),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(0, height() - 48),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);
  add([
	  rect(48, height()),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(width() - 48, 0),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);
  add([
	  rect(48, height()),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(0, 0),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);


  keyPress("up", () => {
		// these 2 functions are provided by body() component
    player.play("idle");
    if(JumpN < 2){
      player.jump(JUMP_FORCE);
      JumpN = JumpN + 1;
    };
		if (player.grounded()) {
			JumpN = 0;
		};
	});

  keyPress("b", () => {
    //alert("hello");

    if(CanBig = true){
      // /alert("cello");
      
      player.biggify(5)
      player.play("idle");
      //CanBig = false;
      //setTimeout(5000)
      //CanBig = true;
      
    };
	  
	});
  

	keyDown("left", () => {
		player.move(-MOVE_SPEED, 0);
    player.play("run");
    player.flipX(false);
	});

	keyDown("right", () => {
		player.move(MOVE_SPEED, 0);
    //player.play("idle");
    player.flipX(true);
    if(TrueFalse = true){
      TrueFalse = false;
      player.play("run");
      
      TrueFalse= true;
    };
	});

	keyPress("down", () => {
		player.weight = 3;
    player.play("idle");
	});

	keyRelease("down", () => {
		player.weight = 1;
    
	});
  if(player.pos.x > 400 ){
    
    player.pos.x = 0;
    player.pos = center();
  };
  if(player.pos.x <  - 400 ){
    
    player.pos.x = 0;
    player.pos = center();
  };
  player.collides("enemy", () => {
		go("game");
		//play("start");
	});
  

  //addButton("Quit", vec2(200, 200), () => debug.log("bye"));
	
});
scene("lose", () => {
  const background = add([
		sprite("dbackground"),
		pos(-10,-10),
		
		scale(20),
    width(width()),
	  height(height()),

	
		//origin("bot"),
	]);

  const player = add([
    
		sprite("Player"),
   
		pos(center()),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		big(),
	  origin("bot"),
	]);
  

	keyPress(() => 
  go("game", {
		levelId: LevelId,
		coins: 0,
	}));
  button = add([
		text("You Lost"),
		pos(width() / 2, height() / 2 - 80),
    
		
		scale(1),
		origin("center"),
    
	]);
  
  button1 = add([
		text("Press Space to Respawn"),
		
    pos(center()),
    
	
		scale(0.5),
		origin("center"),
    
	]);
});
scene("instructions", () => {
  gravity(3200);
  VarEXE = 0 
  JumpN = 0;
  const background = add([
		sprite("dbackground"),
		pos(-10,-10),
		
		scale(20),
    width(width()),
	  height(height()),

	
		//origin("bot"),
	]);
  addButton("Instructions", vec2(200, 100),"Instructions", () => debug.log("Teleporting"));
  addButton("Other", vec2(width()-200, 100),"Other", () => debug.log("Teleporting"));
 
 
  const player = add([
    
		sprite("Player"),
   
		pos(center()),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		big(),
	  origin("bot"),
	]);
  player.collides("Instructions", () => {
		go("Instructions");
		play("hit");
	});
  player.collides("Other", () => {
		go("other");
		play("hit");
	});
  const enemy = add([
    
		sprite("ghosty"),
   
		pos(100,0),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		patrol(),
	  origin("bot"),
	]);


  button = add([
		text("Stomp"),
		pos(width() / 2, height() / 2 - 80),
    
		
		scale(1),
		origin("center"),
    
	]);
  
  button1 = add([
		text("By: zthum Studios"),
		
    pos(center()),
    
	
		scale(0.5),
		origin("center"),
    
	]);
  add([
	  rect(width(), 48),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(0, height() - 48),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);
  add([
	  rect(48, height()),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(width() - 48, 0),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);
  add([
	  rect(48, height()),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(0, 0),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);


  keyPress("up", () => {
		// these 2 functions are provided by body() component
    player.play("idle");
    if(JumpN < 2){
      player.jump(JUMP_FORCE);
      JumpN = JumpN + 1;
    };
		if (player.grounded()) {
			JumpN = 0;
		};
	});

  keyPress("b", () => {
    //alert("hello");

    if(CanBig = true){
      // /alert("cello");
      
      player.biggify(5)
      player.play("idle");
      //CanBig = false;
      //setTimeout(5000)
      //CanBig = true;
      
    };
	  
	});
  

	keyDown("left", () => {
		player.move(-MOVE_SPEED, 0);
    player.play("run");
    player.flipX(false);
	});

	keyDown("right", () => {
		player.move(MOVE_SPEED, 0);
    //player.play("idle");
    player.flipX(true);
    if(TrueFalse = true){
      TrueFalse = false;
      player.play("run");
      
      TrueFalse= true;
    };
	});

	keyPress("down", () => {
		player.weight = 3;
    player.play("idle");
	});

	keyRelease("down", () => {
		player.weight = 1;
    
	});
  if(player.pos.x > 400 ){
    
    player.pos.x = 0;
    player.pos = center();
  };
  if(player.pos.x <  - 400 ){
    
    player.pos.x = 0;
    player.pos = center();
  };
  player.collides("enemy", () => {
		go("game");
		//play("start");
	});
 
  //addButton("Quit",
});
scene("other", () => {
  gravity(3200);
  VarEXE = 0 
  JumpN = 0;
  const background = add([
		sprite("dbackground"),
		pos(-10,-10),
		
		scale(20),
    width(width()),
	  height(height()),

	
		//origin("bot"),
	]);
  addButton("Backstory", vec2(200, 100),"Instructions", () => debug.log("Teleporting"));
  addButton("Credits", vec2(width()-200, 100),"Other", () => debug.log("Teleporting"));
 
 
  const player = add([
    
		sprite("Player"),
   
		pos(center()),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		big(),
	  origin("bot"),
	]);
  player.collides("Instructions", () => {
		go("Backstory");
		play("hit");
	});
  player.collides("Other", () => {
		go("Credits");
		play("hit");
	});
  const enemy = add([
    
		sprite("ghosty"),
   
		pos(100,0),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		patrol(),
	  origin("bot"),
	]);


  button = add([
		text("Stomp"),
		pos(width() / 2, height() / 2 - 80),
    
		
		scale(1),
		origin("center"),
    
	]);
  
  button1 = add([
		text("By: zthum Studios"),
		
    pos(center()),
    
	
		scale(0.5),
		origin("center"),
    
	]);
  add([
	  rect(width(), 48),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(0, height() - 48),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);
  add([
	  rect(48, height()),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(width() - 48, 0),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);
  add([
	  rect(48, height()),
	  outline(1),
	  area(),
    
    color(10, 10, 10),

	  pos(0, 0),
	  // Give objects a solid() component if you don't want other solid objects pass through
	  solid(),
  ]);


  keyPress("up", () => {
		// these 2 functions are provided by body() component
    player.play("idle");
    if(JumpN < 2){
      player.jump(JUMP_FORCE);
      JumpN = JumpN + 1;
    };
		if (player.grounded()) {
			JumpN = 0;
		};
	});

  keyPress("b", () => {
    //alert("hello");

    if(CanBig = true){
      // /alert("cello");
      
      player.biggify(5)
      player.play("idle");
      //CanBig = false;
      //setTimeout(5000)
      //CanBig = true;
      
    };
	  
	});
  

	keyDown("left", () => {
		player.move(-MOVE_SPEED, 0);
    player.play("run");
    player.flipX(false);
	});

	keyDown("right", () => {
		player.move(MOVE_SPEED, 0);
    //player.play("idle");
    player.flipX(true);
    if(TrueFalse = true){
      TrueFalse = false;
      player.play("run");
      
      TrueFalse= true;
    };
	});

	keyPress("down", () => {
		player.weight = 3;
    player.play("idle");
	});

	keyRelease("down", () => {
		player.weight = 1;
    
	});
  if(player.pos.x > 400 ){
    
    player.pos.x = 0;
    player.pos = center();
  };
  if(player.pos.x <  - 400 ){
    
    player.pos.x = 0;
    player.pos = center();
  };
  player.collides("enemy", () => {
		go("game");
		//play("start");
	});
 
  //addButton("Quit",
});
scene("win", () => {
	add([
		text("You Win"),
	]);
	keyPress(() => go("game"));
});
scene("Instructions", () => {
	add([
		text("You Win"),
	]);
	keyPress(() => go("game"));
});

scene("Backstory", () => {
	add([
		text("You Win"),
	]);
	keyPress(() => go("game"));
});
scene("win", () => {
	add([
		text("You Win"),
	]);
	keyPress(() => go("game"));
});


go("menu");